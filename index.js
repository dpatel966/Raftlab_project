const express = require('express');
const auth = require('./router/authRouter')
const userRouter = require('./router/UserRouter')
const jwt = require("./jwtauth/jwttoken")
const server = express();
const morgan = require('morgan')





server.use(morgan('dev'));
server.use(express.urlencoded({extended:false}));
server.use(express.json());

 server.use("/api", async (req, res, next) => {
    const result = await jwt.authenticateToken(req)
    if (result.status)
        next()
    else
        res.json({result})

}); 


server.get("/",(req,res)=>{
    res.send("request is comming")
});


 server.use("/",auth);
 server.use("/api/user",userRouter)


server.listen(8989,()=>{
    console.log("server is Runing on port: 8989")
})