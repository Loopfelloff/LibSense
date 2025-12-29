import {useState , useEffect} from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import SignupForm from '../components/SignupBox';
import LoginForm from '../components/LoginBox';
import EmailVerificationBox from '../components/EmailVerificationBox';

const allowedPages: (string | undefined)[] = ["login" , "signup" , "emailverification"]

export default function LoginOrSignup(){
    
   const {loginOrSignup}  = useParams<string>()

   const navigate = useNavigate()

   if(!allowedPages.includes(loginOrSignup)) {

        console.log('allowed xainaraixa')
	navigate("/pageNotFound")

   }

    return(
	<>
	{(loginOrSignup === "signup" ) ? 
	    <SignupForm/> : (loginOrSignup === "login") ? <LoginForm/> : <EmailVerificationBox/>
	}
	</>
    ) 



}
