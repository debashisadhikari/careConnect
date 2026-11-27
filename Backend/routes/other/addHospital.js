const express=require("express");
const hospitalRoute=express.Router();
const {hospitalPost,hospitalGet}=require("../../controller/hospitalController")
const {adminProtected}=require("../../middleWire/adminProtected");
hospitalRoute.post("/api/addHospital",hospitalPost);
hospitalRoute.get("/api/getHospital",hospitalGet);

exports.hospitalRoute=hospitalRoute;