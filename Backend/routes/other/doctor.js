const express=require("express");
const doctorRoute=express.Router();
const {addDoctor,getDoctor,editDoctor,getAllDoctor,deleteDoctor}=require("../../controller/doctorController")
const {adminProtected}=require("../../middleWire/adminProtected");
doctorRoute.post("/api/addDoctor",adminProtected,addDoctor);
doctorRoute.get("/api/getDoctor",getDoctor);
doctorRoute.post("/api/editDoctor",adminProtected,editDoctor);
doctorRoute.get("/api/allDoctor",getAllDoctor);
doctorRoute.delete("/api/deleteDoctor/:id",adminProtected,deleteDoctor);
exports.doctorRoute=doctorRoute;