const express = require("express");

const userRouter = express.Router();
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();


userRouter.post("/login", async (req, res) => {
  let { email, password, phone } = req.body;
  if (email && password) {
    try {
      let data = await UserModel.find({ email });
      if (data.length > 0) {
        bcrypt.compare(password, data[0].password, (err, result) => {
          if (err)
            res.send({
              message: "Something went wrong",
              status: 0,
              error: true,
            });

          if (result) {
            let token = jwt.sign(
              { userId: data[0]._id, role: data[0].role },
              process.env.SecretKey
            );
            res.send({
              message: "Login successful",
              status: 1,
              token: token,
              error: false,
            });
          } else {
            res.send({
              message: "Password is incorrect",
              status: 0,
              error: true,
            });
          }
        });
      } else {
        res.send({
          message: "User does not exist , Please Sign up",
          status: 0,
          error: true,
        });
      }
    } catch (error) {
      res.send({
        message: "Something went wrong: " + error.message,
        status: 0,
        error: true,
      });
    }
  } else {



    //for phone
  }
});

userRouter.post("/register", async (req, res) => {
  let { email, name, role, password, phone } = req.body;

  if (email && password) {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err)
        res.send({
          message: "Something went wrong: " + err,
          status: 0,
          error: true,
        });

      try {
        let user = new UserModel({ email, phone, name, role, password: hash });
        await user.save();
        res.send({
          message: "User is regsitered",
          status: 1,
          error: false,
        });
      } catch (error) {
        res.send({
          message: "Somthing went wrong" + error.message,
          status: 0,
          error: true,
        });
      }
    });
  } else {
    try {
      let user = new UserModel({ name, role, phone });
      await user.save();
      res.send({
        message: "User is regsitered",
        status: 1,
        error: false,
      });
    } catch (error) {
      res.send({
        message: "Somthing went wrong" + err,
        status: 0,
        error: true,
      });
    }
  }
});

// OTP  1st
// const otpGenerator = require('otp-generator');
// const { localVariables } = require("../middlewares/authenticator");


// userRouter.get("/generateOTP",localVariables, async(req,res)=>{

//   req.app.locals.OTP= await otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets:false, specialChars: false });
//   console.log(res.app);

//   res.status(201).send({code:req.app.locals.OTP})
// })

// userRouter.get("/verifyOTP", async(req,res)=>{
//   const {code}= req.body
//   if(parseInt(req.app.locals.OTP)=== parseInt(code)){
//     req.app.locals.OTP =null   // reset the OTP value
//     req.app.locals.resetSession= true   //start session for reset password
//     return res.status(201).send({msg:"Verify successfully"})
//   }
//   return res.status(400).send({error:"Invalid OTP"})
// })


// OTP 2nd Nodemailer
/*
const nodemailer = require('nodemailer');

userRouter.post("/generateOTP", async(req,res)=>{
  
  const otp=Math.floor(Math.random()*9000+1000)
   console.log(otp);
   req.app.locals.OTP=otp
   try {
    const transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
    type:"OAuth2",
    user:process.env.EMAIL_USERNAME,
    pass:process.env.PASSWORD,
    clientId:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET
    }
    })

    const {email}= req.body
    const result=await transport.sendMail({
      from:"surya101294@gmail.com",
      to:email,
      subject:"this is a test email",
      html:`<h1>here is your otp ${otp}</h1>`,
      body:"this is your otp for signing up"+`${otp}`
      })
      res.status(201).send({msg:"OTP send to the mailID"})
       
    } catch (error) {
          res.send({msg:"msg Not Delivered", error: error.message})
    }
})

userRouter.post("/verifyOTP", async(req,res)=>{
  const {code}= req.body
  if(req.app.locals.OTP== code){
    return res.status(201).send({msg:"Verify successfully"})
  }
  return res.status(400).send({error:"Invalid OTP"})
})
*/

/** send mail from real gmail account */
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const sendOTP = (req, res) => {
  const { email } = req.body;
  let config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.PASSWORD
    }
  }

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Surya",
      link: 'https://surya101294.github.io/'
    }
  })
  const otp = Math.floor(Math.random() * 9000 + 1000)
  console.log(otp);
  let response = {
    body: {
      name: email,
      intro: `Signup using the OTP! , ${otp}`
    }
  }

  let mail = MailGenerator.generate(response)

  let message = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "OTP",
    html: mail
  }

  transporter.sendMail(message).then(() => {
     res.send({
      msg: "you should receive an email", otp:otp
    })
  }).catch(error => {
    return res.status(500).json({ error })
  })

  // res.status(201).json("sendOTP Successfully...!");
}

userRouter.post("/generateOTP", sendOTP)

module.exports = {
  userRouter,
};
