import axios from 'axios'
import type { Dispatch , SetStateAction } from 'react'
const getUserPreference = async ( setIsLoading :  Dispatch<SetStateAction<boolean>>)=>{

    setIsLoading(true)
    try{
	const response = await axios.get("http://localhost:5000/interest/get",{
		withCredentials : true
	    })

	console.log("from the frontend", response.data.data)
	return response.data.data
    }

    catch(err : unknown){
	if(axios.isAxiosError(err)){
	    alert(`can't add the genre because of ${err.name}`)
	    console.log(err.response?.data)
	}
    }
    finally {
	setIsLoading(false)
    }
    
}

export {getUserPreference}
