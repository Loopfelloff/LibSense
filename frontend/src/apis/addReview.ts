import axios from "axios";
import type { Dispatch , SetStateAction} from "react";
import type { addReviewPayload } from "../types/addReviewPayload";

const addBookReview = async (requestPayload : addReviewPayload , setIsLoading :  Dispatch<SetStateAction<boolean>>)=>{
    try{
	setIsLoading(true)
	const response = await axios.post("http://localhost:5000/review/add", requestPayload , {
	    withCredentials : true,
	})

	return response.data.data
	
    }
    catch(err:unknown){
	if(axios.isAxiosError(err)){
	    alert(`can't add the review due to ${err.name}`)
	    console.log(err.response?.data)
	    console.log(err.response?.status)
	}
    }
    finally{
	setIsLoading(false)
    }
}

export {addBookReview}


