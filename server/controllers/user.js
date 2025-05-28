import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.SECRET;
const HOST =  process.env.SMTP_HOST
const PORT =  process.env.SMTP_PORT
const USER =  process.env.SMTP_USER
const PASS =  process.env.SMTP_PASS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

import User from '../models/userModel.js'
import ProfileModel from '../models/ProfileModel.js';
import e from "express"


export const signin = async (req, res)=> {
    const { email, password } = req.body //Coming from formData

    try {
        const existingUser = await User.findOne({ email })
        
        //get userprofile and append to login auth detail
        const userProfile = await ProfileModel.findOne({ userId: existingUser?._id })

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect  = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

        //If crednetials are valid, create a token for the user
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" })
        
        //Then send the token to the client/frontend
        res.status(200).json({ result: existingUser, userProfile, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong"})
    }
}


export const signup = async (req, res) => {
    console.log("Starting signup function");
    const { email, password, confirmPassword, firstName, lastName, bio } = req.body;
    console.log("Extracted request body");
  
    try {
      // Check if user already exists.
    //   const existingUser = await User.findOne({ email });
    //   console.log("Existing user:", existingUser);
    //   if (existingUser) {
    //     return res.status(400).json({ message: "User already exists" });
    //   }
  
      // Check if passwords match.
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
      }
  
      // Hash the password.
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("Password hashed");
  
      // Create the new user.
      const result = await User.create({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        bio,
      });
      console.log("User created:", result);
  
      // Sign a token with user details.
      const token = jwt.sign(
        { email: result.email, id: result._id },
        SECRET,
        { expiresIn: "1h" }
      );
      console.log("Token generated");
  
      // Optionally, if you plan to create or attach a profile later, do it here.
      // For now we send null (or handle accordingly) for userProfile.
      res.status(200).json({ result, userProfile: null, token });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  

// export const updateProfile = async (req, res) => {
//     const formData = req.body
//     const { id: _id } = req.params
//     console.log(formData)

//     if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No user with this id found')

//     const updatedUser = await User.findByIdAndUpdate(_id, formData, {new: true})
//     res.json(updatedUser)
// }




export const forgotPassword = (req,res)=>{
    const { email } = req.body
  
       // NODEMAILER TRANSPORT FOR SENDING POST NOTIFICATION VIA EMAIL
        const transporter = nodemailer.createTransport({
            host: HOST,
            port : PORT,
            auth: {
            user: USER,
            pass: PASS
            },
            tls:{
                rejectUnauthorized:false
            }
        })
  
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email : email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User does not exist in our database"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"EchoInvoice <hello@echoinvoice.com>",
                    subject:"Password reset request",
                    html:`
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                        <h2 style="color: #1976D2; text-align: center;">Password Reset Request</h2>
                        <p style="font-size: 16px; color: #444;">You have requested to reset your password for your EchoInvoice account.</p>
                        <p style="font-size: 16px; color: #444;">Please click the button below to reset your password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${CLIENT_URL}/reset/${token}" 
                               style="background-color: #1976D2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                               Reset Password
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link in your browser:</p>
                        <p style="font-size: 14px; color: #666; word-break: break-all;">${CLIENT_URL}/reset/${token}</p>
                        <p style="font-size: 14px; color: #666; margin-top: 30px;">If you didn't request this password reset, you can safely ignore this email.</p>
                        <p style="font-size: 14px; color: #666;">This link will expire in 1 hour for security reasons.</p>
                        <div style="margin-top: 40px; text-align: center; color: #888; font-size: 12px;">
                            <p>EchoInvoice - Professional Invoicing Solution</p>
                        </div>
                    </div>
                    `
                })
                res.json({message:"Check your email for password reset instructions"})
            }).catch((err) => console.log(err))
        })
    })
}
  
  
  
  export const resetPassword = (req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
  }
