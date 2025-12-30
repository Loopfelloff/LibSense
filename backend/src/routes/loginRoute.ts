import express from 'express'
const router = express.Router()
import {loginHandler} from '../controllers/loginController.js'


router.route('/').post(loginHandler)


export {router}
