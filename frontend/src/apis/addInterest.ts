import axios from 'axios'
import type { Dispatch , SetStateAction } from 'react'
const addInterest = async (genreId : string , setIsLoading :  Dispatch<SetStateAction<boolean>>)=>{

    setIsLoading(true)
    try{
	const response = await axios.post("http://localhost:5000/interest/add" , {
	    genreId : genreId
	}, {
		withCredentials : true
	    })

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

export {addInterest}
