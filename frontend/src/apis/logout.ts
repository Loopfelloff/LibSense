// this is where i log the fuck out.
import axios from "axios"

const logoutAPI = async()=>{

    const response = await axios.get("http://localhost:5000/logout" , 
    {
	    withCredentials : true
	})

    return response.data.success

} 
export {logoutAPI}

