import type { Request, Response } from "express";
import axios from "axios";

const getSimilarBooks = async (req: Request, res: Response) => {

    const {description : searchQuery} = req.body as {description : string};

    if(!searchQuery) 
      return res.status(400).json({
        success: false,
        error: {
          errName: "ValidationError",
          errMsg: "No query",
        },
      })
      try {
        const response = await axios.get(
      `http://127.0.0.1:8000/search/${encodeURIComponent(searchQuery.toLowerCase())}`,
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        console.log(response.data.recommendations);
    	return res.status(200).json({
      	  success: true,
      	  data: response.data.recommendations,
    	});
      } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).json({
        success: false,
        error: {
          errName: err.name,
          errMsg: err.message,
        },
      });
    }
  }
}

export { getSimilarBooks };
