
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//we will use this to hash the password that we recieve from users

const app = express();


//require a darabase connection
const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');
const auth= require("./auth");

//execute database connection
dbConnect()

app.use(express.json())
//adds middleware to your app
//it parses incoming requestes to JSON


app.use(express.urlencoded({ extended: true }))
//parses incoming requests with URL encoded payloads

//include data => the body of the req
//or using URL encoded data ex HTML form data



app.get('/', (req, res, next) => {
    res.json({
        message: "Hey!, This is your server res"

    })
    next();
})

//register endpoint

//.then ,  .catch, .finally

app.post("/register", (req, res) => {

    console.log(req.body.email)

    bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            console.log(hashedPassword)

            //create a new user instance and collect the data
            const user = new User({
                email: req.body.email,
                password: hashedPassword
            })

            //save the user
            user.save()
                //return success if the new user is added to the database successfully
                .then((result) => {
                    res.status(201).send({
                        message: "User Created Successfully",
                        result
                    })
                })
                //catch error if the new user was not added successfully to the database
                .catch((error) => {
                    res.status(500).send({
                        message: "Error creating user",
                        error
                    })
                })

        }).catch((error) => {
            res.status(500).send({
                message: "Password was not hashed successfully",
                error
            })
        })

})

//login endoint

app.post("/login", (req, res) => {

    //check if the email that user enters on login exists

    User.findOne({ email: req.body.email })
        //if email exists
        .then((user) => {
            //compare the password entered by user and the hashed password found in the db
            console.log(user)
            // console.log({ loginPassword: req.body.password, hashedPassword: user.password })
            bcrypt.compare(req.body.password, user.password)
                //check if password matches

                .then((passwordCheck) => {
                    console.log('passwordCheck', passwordCheck)

                    if (!passwordCheck) {
                        return res.status(400).send({
                            message: "Passwords do not match"

                        })
                    }

                    //create jwt token

                    const token = jwt.sign({
                        userId: user._id,
                        userEmail: user.email
                    }, "RANDOM-TOKEN", { expiresIn: '24h' }
                    )

                    //return the success res

                    res.status(200).send({
                        message: 'Login Successfull',
                        email: user.email,
                        token
                    })



                })
                //catch error if password do not match
                .catch((error) => {
                    res.status(400).send({
                        message: 'Passwords do not match',
                        error
                    })
                })



        }).catch((error) => {
            console.log(error);
            res.status(404).send({
                message: "Email not found",
                error
            })
        })

})


//Get user by ID endpoint:
app.get("/users/:id", (req, res) => {
    const userId = req.params.id;
  
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "User not found"
          });
        }
  
        res.status(200).send(user);
      })
      .catch((error) => {
        res.status(500).send({
          message: "Error retrieving user",
          error
        });
      });
  });
  


//order page
app.get("/order",(req,res)=>{
    res.json({
        message:"You are in now order page"
    })
})


//public-endpoint
app.get("/public-endpoint",(req,res)=>{
    res.json({
        message:"You are free to acess "
    })
})

app.get("/private-endpoint",auth,(req,res)=>{
    res.json({
     message:"You are authorised to access order page"
    })
})


module.exports = app;
