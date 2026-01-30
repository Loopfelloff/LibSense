import type { Request, Response } from "express";
import axios from 'axios'
import { prisma } from "../config/prismaClientConfig.js";
import type { reqUser } from "../types/reqUserType.js";
import { redisClient } from "../config/redisConfiguration.js";
import type { SearchResult } from "../types/searchResult.js";

const genreClassificationHandler = async(req : Request , res : Response)=>{
    try{

	let {description} = req.body as {description : string}
	const user = req.user as reqUser

	if(!description) return res.status(400).json({
	    success : false,
	    errMsg : `missing description in the request header` 
	})

	description = description.trim()

	if(description === '')return res.status(400).json({
	    success : false,
	    errMsg : `missing description in the request header` 
	})



	let recommendedGenres : string[] = []

	try{

	    const response = await axios.post("http://127.0.0.1:8000/genre_classification" , {description : description})

	    recommendedGenres = response.data.data as string[]

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

	if (recommendedGenres.length === 0) return res.status(404).json({
	    success:true,
	    data : []
	})

	let genreIdList : {id : string;}[] | string[]
	let bookIdList : {book_id:string;}[] | string[]

	genreIdList = await prisma.genre.findMany({
	    where : {
		genre_name :{
		    in : recommendedGenres
		}
	    },
	    select : 
	    {
		id : true
	    }
	})


	genreIdList = genreIdList.map(item=>item.id)

	bookIdList = await prisma.bookStatusVal.findMany({
	    where:{
		user_id : user.id
	    }
	    ,
	    select : {
		book_id : true
	    }
	})

	bookIdList= bookIdList.map(item=>item.book_id)

const highestRatedGenreBookList: SearchResult[] = []
const usedBookIds = new Set<string>()

for (const genre_id of genreIdList) {
    const foundBook = await prisma.book.findFirst({
        where : {
            book_genres: {
                some: {
                    genre_id: genre_id
                }
            },
            id: {
                notIn: [...bookIdList, ...Array.from(usedBookIds)]
            }
        },
        select:{
            id: true,
            book_title: true,
            book_cover_image: true,
            avg_book_rating: true,
            book_rating_count: true,
            book_genres: {
                where: {
                    genre_id: genre_id
                },
                select: {
                    genre: {
                        select: {
                            genre_name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            avg_book_rating: 'desc'
        }
    })
    
    if (foundBook) {
        usedBookIds.add(foundBook.id)
        highestRatedGenreBookList.push(foundBook)
    }
}

	res.status(200).json({

	    success : true,
	    data : highestRatedGenreBookList

	})


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
