import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

const getTopRated = async (startIndex : number , shiftIndex : number , setIsLoading :  Dispatch<SetStateAction<boolean>>)=>{
    try{
	setIsLoading(true)
	const response = await axios.get("http://localhost:5000/topRated", {
	    params : {
		startIndex : startIndex,
		shiftIndex : shiftIndex
	    },
	    withCredentials : true
	})

	console.log(response.status)

	return response
	
    }
    catch(err: unknown){
	if(axios.isAxiosError(err)){
	    console.log(err.response?.data)
	    console.log(err.response?.status)
	}

    }
    finally{
	setIsLoading(false)
    }
} 

export {getTopRated}
