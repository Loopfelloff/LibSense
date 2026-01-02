import {useEffect , useState} from "react";
import type { ReactNode } from "react";
import { UserContext } from "./UserContext";
import { TailSpin } from "react-loader-spinner"; 
import axios from 'axios'
export type userContext = {
    loggedIn : boolean;
    id : string;
    email : string;
    firstName : string;
    middleName : string;
    lastName : string;
    profilePicLink : string;
}

type propType = {
    children : ReactNode
}

export default function AuthContext({children} : propType){


    const [contextState , setContextState] = useState<userContext | null>(null)
    const [isLoading , setIsLoading] = useState<boolean>(true)

    useEffect(()=>{
	axios.get("http://localhost:5000/auth" , {
	    withCredentials : true
	})
	.then(response =>{
	    setContextState(response.data.data)
	    console.log('success')
	    console.log(response.data.data)
	    setIsLoading(false)
	}) 
	.catch(error =>{
	    console.log(error)
	    console.log(error.response.data.data)
	    setIsLoading(false)
	})
    } , [])
    

    return (
	<UserContext.Provider value={contextState}>
	    {(isLoading) ? <TailSpin/> : children } 
	</UserContext.Provider>
    )

     
}
