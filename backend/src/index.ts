import express from 'express'
import type {Request , Response} from 'express'
const app = express()
let port = 5000

app.use(express.json())


app.listen(port , ()=>{
    console.log('Listening to port ' , port)
})



