const express=require("express");
const signupRoute=express.Router();
const {signupPost}=require("../../Controller/authController")
 signupRoute.post("/api/signup",signupPost);
 exports.signupRoute=signupRoute;