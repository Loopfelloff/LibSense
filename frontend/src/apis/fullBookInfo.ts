import axios from "axios";
import type { Dispatch , SetStateAction} from "react";

const getFullBookInfo = async (bookId : string , setIsLoading :  Dispatch<SetStateAction<boolean>>)=>{
    try{
	setIsLoading(true)
	const response = await axios.get("http://localhost:5000/viewBook" , {
	    params : {
		bookId : bookId
	    },
	    withCredentials:true
	})

	return response.data.data
	
    }
    catch(err:unknown){
	if(axios.isAxiosError(err)){
	    console.log(err.response?.data)
	    console.log(err.response?.status)
	}
    }
    finally{
	setIsLoading(false)
    }
}

export {getFullBookInfo}
