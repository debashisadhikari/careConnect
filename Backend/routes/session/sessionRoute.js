const express=require("express");
const sessionRoute=express.Router();
const {sessionGet}=require("../../controller/authController")
sessionRoute.get("/api/me",sessionGet);
exports.sessionRoute=sessionRoute;