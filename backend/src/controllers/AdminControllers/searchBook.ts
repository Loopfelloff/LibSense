import type { Request, Response } from 'express'
import axios from 'axios'

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { query } = req.query

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({
        success: false,
        msg: 'Search query is required',
      })
    }

    // Call your Python FastAPI endpoint
    const searchResponse = await axios.get(
      `http://127.0.0.1:8000/search/${encodeURIComponent(query)}`,
      {
        timeout: 10000,
      }
    )

    return res.status(200).json({
      success: true,
      query: searchResponse.data.query,
      recommendations: searchResponse.data.recommendations,
    })
  } catch (error: unknown) {
    console.error('Error searching books:', error)

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return res.status(400).json({
          success: false,
          msg: error.response.data.detail || 'Invalid search query',
        })
      }
    }

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        errName: error.name,
        errMsg: error.message,
      })
    }

    return res.status(500).json({
      success: false,
      errName: 'UnknownError',
      errMsg: 'An error occurred while searching books',
    })
  }
}