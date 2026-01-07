import axios from 'axios'
import type { Dispatch , SetStateAction } from 'react'
const getGenreByName = async (genreName : string , setIsLoading : Dispatch<SetStateAction<boolean>>)=>{

    setIsLoading(true)
    try{
	const response = await axios.get("http://localhost:5000/interest/findGenre" , {
		params : {
		    genreName : genreName
		},
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
    finally{
	setIsLoading(false)
    }
    
}

export {getGenreByName}
