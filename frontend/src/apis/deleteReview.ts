import axios from "axios";
import type { Dispatch , SetStateAction} from "react";
const deleteBookReview = async (reviewId : string , setIsLoading :  Dispatch<SetStateAction<boolean>>)=>{
    try{
	setIsLoading(true)
	const response = await axios.delete("http://localhost:5000/review/delete", {
	   params: {
		reviewId : reviewId
	    },
	   withCredentials: true
	})

	return response.data.data
	
    }
    catch(err:unknown){
	if(axios.isAxiosError(err)){
	    alert(`can't delete your review due to ${ err.name}` ,)
	    console.log(err.response?.data)
	    console.log(err.response?.status)
	}
    }
    finally{
	setIsLoading(false)
    }
}

export {deleteBookReview}



