const express=require("express");
const addTestRoute=express.Router();
const {addTestPoast,editTestPost,testGetAdmin,testGetAll,deleteTest}=require("../../controller/addTestController")
const {adminProtected}=require("../../middleWire/adminProtected");
addTestRoute.post("/api/addTest",adminProtected,addTestPoast);
addTestRoute.post("/api/editTest",adminProtected,editTestPost);
addTestRoute.get("/api/fetchTest",testGetAdmin);
addTestRoute.get("/api/getAllTests",testGetAll);
addTestRoute.delete("/api/delete/:id",adminProtected,deleteTest);

exports.addTestRoute=addTestRoute;