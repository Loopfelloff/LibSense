import { useState, useRef} from 'react';
import type {KeyboardEvent, ChangeEvent } from 'react'
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
export default function EmailVerificationBox() {
  const navigate = useNavigate()
  const [showMessageBox , setShowMessageBox] = useState<boolean>(false)
  const [countDown ,setCountDown] = useState<number>(5)
  const [failedVerification , setFailedVerification] = useState<boolean>(false)
  const [enableButton , setEnableButton] = useState<boolean>(false)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  const navigateToLogin : ()=>void = ()=>{
      setShowMessageBox(true);

  const intervalId = setInterval(() => {
    setCountDown(prev => {
      if (prev === 1) {
        clearInterval(intervalId);
        navigate("/login");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  }

  const checkIfFull = (newOtp : string[])=>{
      const data = newOtp
      return !((data[0] === '') || (data[1] === '')  || (data[2] === '') || (data[3] === '') || (data[4] === '')  || (data[5] === ''))  
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if(checkIfFull(newOtp)) setEnableButton(true) 
    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if(enableButton) setEnableButton(false)
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    if(checkIfFull(newOtp)) setEnableButton(true) 
    
    // Focus on the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async ()=>{
    setEnableButton(false)
    const otpEntered = otp.join('') 
    try{
    const response = await axios.post("http://localhost:5000/verifyotp" , {
	otp:otpEntered
    } )
    console.log(response.data)
    navigateToLogin() 
    }
    catch(err){
	if(err instanceof Error)
	    {
		console.log(err.message)
		setFailedVerification(true)
	    }
    } 
    finally{
	setEnableButton(true)
    }
  }

  return (
    <>
    {(showMessageBox) ? <div className="flex flex-col justify-center items-center w-48 h-8 fixed right-0 top-0">
	<span className="text-sm text-green-900 " >Success ! You will be re-directed to login page in .... {countDown}</span>
	</div> : <></>}
    <div className="grow bg-gray-50 flex items-center justify-center p-4 w-full">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Verify Your Email
        </h2>
        
        <p className="text-center text-gray-600 mb-8">
          Enter the 6-digit code sent to your email
        </p>
        
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) =>{
		  inputRefs.current[index] = el}}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          ))}
        </div>
       {/** 
              className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
	      style = { (formValidation) ? {backgroundColor: 'gray' , cursor : 'not-allowed'  } : {backgroundColor : 'rgb(51, 65, 85)', cursor : 'pointer' } }
	  **/
       } 
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
	style = {(enableButton)? {backgroundColor : 'rgb(37, 99, 235)' , cursor:"pointer"} : {backgroundColor : 'gray' , cursor:'not-allowed'}}
	    onClick= {handleSubmit}
	>
          Verify Code
        </button>
	
	{(failedVerification) ? <span
	    className = "text-red-900 text-sm"
	    >The otp verification was failed</span> : <></>}
        
        <p className="text-center text-gray-600 mt-4 text-sm">
          Didn't receive the code?{' '}
          <button className="text-blue-600 hover:underline font-semibold">
            Resend
          </button>
        </p>
      </div>
    </div>
    </>
  );
}
