import axios from "axios";

const getTopRated = async (startIndex : number , shiftIndex : number)=>{
    try{
	const response = await axios.get("http://localhost:5000/topRated", {
	    params : {
		startIndex : startIndex,
		shiftIndex : shiftIndex
	    },
	    withCredentials : true
	})

	console.log(response.status)
	
    }
    catch(err: unknown){
	if(axios.isAxiosError(err)){
	    console.log(err.response?.data)
	    console.log(err.response?.status)
	}
    }

} 

export {getTopRated}
