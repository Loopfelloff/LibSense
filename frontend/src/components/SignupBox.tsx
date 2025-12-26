import { useState } from 'react';
import { Eye, EyeOff, Book, User, Mail, Lock } from 'lucide-react';
import {Link} from 'react-router-dom'
import type { ChangeEvent } from 'react';
import { checkUsernameValidity, checkEmailValidity , checkPasswordValidity , checkConfirmPasswordValidity} from '../utils/formValidation';
import axios from 'axios';

type formData ={
    firstName : string;
    middleName : string;
    lastName : string;
    email : string;
    password : string;
    confirmPassword : string;
}

type passwordError = {
    symbol : boolean;
    num : boolean;
    totalLength : boolean;
}

type userNameError = {
    firstName : boolean;
    lastName : boolean ;
    totalLength : boolean;
}


export default function SignupForm() {
    // state variables
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userNameValidity , setUserNameValidity] = useState<userNameError>(
      {
	  firstName : false,
	  lastName : false,
	  totalLength : false
      }
  )
  const [passwordValidity , setPasswordValidity] = useState<passwordError>({
      symbol : false,
      num : false,
      totalLength : false
  })
  const [emailValidity , setEmailValidity] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<formData>({
    firstName: '',
    middleName : '',
    lastName : '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [confirmPasswordValidity , setConfirmPasswordValidity ] = useState<boolean>(false)
  const [formValidation , setFormValidation] = useState<boolean>(true)


  // function 


  const checkForFormValidation : (formData : formData)=>boolean = (formData : formData )=>{
    const currentUserNameValidity = checkUsernameValidity(formData.firstName , formData.middleName , formData.lastName) 
    setUserNameValidity(currentUserNameValidity)
    const currentPasswordValidity = checkPasswordValidity(formData.password)
    const currentEmailValidity = checkEmailValidity(formData.email)
    const {firstName , lastName , totalLength} = currentUserNameValidity 
    const {symbol , num } = currentPasswordValidity
    const totalLengthPassword = currentPasswordValidity.totalLength
    const email = currentEmailValidity
    const confirmPassword = checkConfirmPasswordValidity(formData.password , formData.confirmPassword)
    if(firstName || lastName || totalLength || symbol || num || totalLengthPassword || email || confirmPassword) return true;
    else return false
	
  }
  const handleChange = (e : ChangeEvent<HTMLInputElement> ) => {
      setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    const  {firstName , middleName , lastName, email , password, confirmPassword } : formData = {
	...formData,
	[e.target.name] : e.target.value
    }


    const currentUserNameValidity = checkUsernameValidity(firstName , middleName , lastName)
    const currentEmailValidity = checkEmailValidity(email)
    const currentPasswordValidity = checkPasswordValidity(password)
    const currentConfirmPasswordValidity = checkConfirmPasswordValidity(password , confirmPassword)

    setUserNameValidity(currentUserNameValidity)

    setPasswordValidity(currentPasswordValidity)

    setEmailValidity(currentEmailValidity)

    setConfirmPasswordValidity(currentConfirmPasswordValidity)

    const newFormData : formData= {

	firstName,
	middleName,
	lastName,
	email,
	password,
	confirmPassword
    }


    if(checkForFormValidation(newFormData)){
	setFormValidation(true)
    }
    else {
	setFormValidation(false)
    }


  };


  const handleSubmit : ()=> Promise<void> = async () => {
    if(checkForFormValidation(formData)) return
    setFormValidation(true)
    const response = await axios.post("http://localhost:5000/registerAccount", {
	firstName : formData.firstName,
	middleName : formData.middleName,
	lastName : formData.lastName,
	email : formData.email,
	password : formData.password
    })
    setFormValidation(false)
    console.log(response.data)
    console.log(response.status)

    
    
  };

  const handleGoogleSignup = () => {
    console.log('Continue with Google clicked');
  };

  return (
    <div className="grow  bg-gray-50 flex items-center gap-6 justify-center pt-18  w-full">
      <div 
        className="w-full max-w-md bg-white flex flex-col"
        style={{
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)',
          height: 'fit-content'
        }}
      >
        <div className="flex flex-col items-center pt-12 pb-8">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <Book className="w-6 h-6 text-gray-700" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">libsense</h2>
          <p className="text-sm text-gray-600">Create your account to get started.</p>
        </div>

        <div className="px-8 flex-1 flex flex-col">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
		{(userNameValidity.firstName) ? <span className ="text-red-900">The first name field can't be null</span> : (userNameValidity.totalLength) ? <span className="text-red-900">The total username length must be greater than 8</span>: <></>}
              </div>
            </div>
	    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
		Middle Name*
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />{ (userNameValidity.totalLength) ? <span className="text-red-900">The total username length must be greater than 8</span>: <></>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
		Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
		{(userNameValidity.lastName) ? <span className ="text-red-900">The last name field can't be null</span> : (userNameValidity.totalLength) ? <span className="text-red-900">The total username length must be greater than 8</span>: <></>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
		{(emailValidity) ? <span className ="text-red-900">Email isn't in the correct format</span> : <></>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
		{(passwordValidity.totalLength) ? <span className ="text-red-900">Password must be atleast 8 characters long</span> : (passwordValidity.symbol) ? <span className ="text-red-900">Password must contain at least one symbol </span>: (passwordValidity.num) ? <span className ="text-red-900">Password must contain atleast one number</span> : <></> }
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
		{(confirmPasswordValidity) ? <span className="text-red-900">This must match with the actual password</span> : <></>}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
	      style = { (formValidation) ? {backgroundColor: 'gray' , cursor : 'not-allowed'  } : {backgroundColor : 'rgb(51, 65, 85)', cursor : 'pointer' } }
            >
              Create Account
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
