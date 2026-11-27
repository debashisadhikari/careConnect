const express=require("express");
const countRoute=express.Router();
const {countGet}=require("../../controller/countController")
countRoute.get("/api/count",countGet);
exports.countRoute=countRoute;