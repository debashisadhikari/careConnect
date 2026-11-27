const express=require("express");
const logoutRoute=express.Router();
const {logoutPost}=require("../../Controller/authController")
logoutRoute.get("/api/logout",logoutPost);
exports.logoutRoute=logoutRoute;