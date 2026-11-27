const mongoose=require("mongoose");
const countSchema=mongoose.Schema({
  hospitalId:String,
  doctorCnt:Number,
  testCnt:Number,
  appointmentCnt:Number,
})
module.exports=mongoose.model("Count",countSchema);