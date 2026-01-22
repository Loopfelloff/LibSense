import type { Request, Response } from "express";
import axios from 'axios'

const genreClassificationHandler = async(req : Request , res : Response)=>{
    try{

	let {description} = req.body as {description : string}

	if(!description) return res.status(400).json({
	    success : false,
	    errMsg : `missing description in the request header` 
	})

	description = description.trim()

	if(description === '')return res.status(400).json({
	    success : false,
	    errMsg : `missing description in the request header` 
	})

	try{

	    const response = await axios.post("http://127.0.0.1:8000/genre_classification" , {description : description})

	    return res.status(200).json({
		success : true,
		data : response.data.data
	    })

	}
	catch(error : unknown){
	    if(axios.isAxiosError(error)){
		console.log(error.response?.data)
		return res.status(500).json({
		    success:false,
		    errDetails:{
			errName : error.name,
			errMsg : error.message
		    }
		})

	    }

	}




    }
    catch(err : unknown){

	if(err instanceof Error){
	    res.status(500).json({
		success : false,
		errDetails: {
		    errName : err.name,
		    errMsg : err.message
		}
	    })
	    console.log(err.stack)
	}

    }
}

export {genreClassificationHandler}
