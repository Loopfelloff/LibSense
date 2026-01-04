import express from 'express'
const router = express.Router()

import { addAuthor } from '../controllers/AdminControllers/AddAuthor.js'
import { addBook } from '../controllers/AdminControllers/AddBook.js'
import { deleteAuthor } from '../controllers/AdminControllers/deleteAuthor.js'
import { deleteBook } from '../controllers/AdminControllers/deleteBook.js'
import { getAllAuthors } from '../controllers/AdminControllers/listAllAuthors.js'
import { getAllBooks } from '../controllers/AdminControllers/listAllBook.js'
import { getAuthorDetail } from '../controllers/AdminControllers/getAuthorDetails.js'
import { getBookDetail } from '../controllers/AdminControllers/getSpecificBook.js'
import { updateAuthor } from '../controllers/AdminControllers/updateAuthor.js'
import { updateBookAuthors } from '../controllers/AdminControllers/updateBookAuthors.js'
import { updateBook } from '../controllers/AdminControllers/updateBookInformation.js'

router.post('/addAuthor', addAuthor)
router.delete('/deleteAuthor', deleteAuthor)
router.get('/listAuthors', getAllAuthors)
router.get('/authorDetail/:author_id', getAuthorDetail)
router.put('/updateAuthor', updateAuthor)
router.post('/addBook', addBook)
router.delete('/deleteBook', deleteBook)
router.get('/listBooks', getAllBooks)
router.get('/bookDetail/:book_id', getBookDetail)
router.put('/updateBook', updateBook)
router.put('/updateBookAuthors', updateBookAuthors)


export { router }