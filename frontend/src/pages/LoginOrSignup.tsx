import {useState , useEffect} from 'react';
import { useParams } from 'react-router-dom';
import SignupForm from '../components/SignupBox';
import LoginForm from '../components/LoginBox';

type loginOrSignup = {
    loginOrSignup : "login" | "signup"; 
}

export default function LoginOrSignup(){
    
    const {loginOrSignup}  = useParams<loginOrSignup>()

    return(
	<>
	{(loginOrSignup === "signup" ) ? 
	    <SignupForm/> : <LoginForm/>
	}
	</>
    ) 



}
