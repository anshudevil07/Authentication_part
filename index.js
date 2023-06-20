// const dbConnect= require('./db/dbConnect');
// const bcrypt=require("bcrypt");
// const express=require("express");
// const app=express();
// const User=require("./db/userModel");
// const port=3000;

// app.post('/register',(req,res)=>{
//     bcrypt.hash(req.body.password,10).then((hashPassword)=>{
//            const user= new User({
//             name: req.body.name,
//             email:req.body.email,
//             password:hashPassword,
//            })
//            user.save().then((result)=>{
//             res.status(201).send({
//                 message:"user is created successfully",
//                 result,
//             });
//            }).catch(err=>{
//             res.status(500).send({
//                 message:"There is some error",
//                 err,
//             })
//            })
//     }) .catch((err) => {
//         res.status(500).send({
//           message: "Password was not hashed correctly",
//           err,
//         });
//       });
// })



// dbConnect();
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const http = require('http');
const app = require('./app');
const server = http.createServer(app);


server.on('listening', () => {

    console.log('Listening on' + ' 8080')
})

server.listen(8080)
