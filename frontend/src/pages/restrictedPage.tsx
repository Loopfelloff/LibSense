import {  useContext , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
export default function RestrictedPage(){
    const userContext = useContext(UserContext)
    const navigation = useNavigate() 
    useEffect(()=>{
	if(!userContext?.loggedIn) navigation("/signup")
    } , [])
    return (
	<>
	    <div>
	    This is from a very restricted page  {String(userContext?.lastName)}
 	    </div>
	</>
    )
}

