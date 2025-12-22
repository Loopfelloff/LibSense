import express from 'express'
import type {Request , Response} from 'express'
const app = express()
let port = 5000

app.get('/home' , (req : Request, res : Response)=>{
    console.log(`the request is coming form ${req.url}`)
    return res.json('hi how are you mate')
})
app.get('/house' , (req : Request, res : Response)=>{
    console.log(`the request is coming form ${req.url}`)
    return res.json('hi from house')
})


app.listen(port , ()=>{
    console.log('Listening to port ' , port)
})



