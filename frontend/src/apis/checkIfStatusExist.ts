import axios from 'axios'
const checkIfStatusExist = async(bookId : string)=>{
    try {

	const response = await axios.get("http://localhost:5000/checkIfStatusExist", {
	    params : {
		bookId : bookId

	    },
	    withCredentials : true
	})

	console.log("the books existence is " , response.data.data)
	return response.data.data

    }
    catch(err : unknown){
	if(axios.isAxiosError(err)){
	    console.log(err.response?.data)
	    alert(err.name)
	}
    }
}

export {checkIfStatusExist}
