const express=require("express");
const loginRoute=express.Router();
const {loginPost}=require("../../Controller/authController")


loginRoute.post("/api/login",loginPost);

exports.loginRoute=loginRoute;