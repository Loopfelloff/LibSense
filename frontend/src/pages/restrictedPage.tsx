import { useEffect } from "react";
import axios from "axios";

export default function RestrictedPage(){
    useEffect(()=>{
	axios.get("http://localhost:5000/book" , {
		  params : { bookId : 'ef1e4b3b-2e28-41f2-a494-f0b0ff044527' },
		  withCredentials : true
	}	
		 )
	.then(response =>{
	    console.log(response.data)
	    console.log(response.status)
	})
	.catch(reject =>{
	    if(axios.isAxiosError(reject)){
		console.log(reject.response?.data)
		console.log(reject.response?.status)
	    }
	})
    })
    return (
	<></>
    )
}
