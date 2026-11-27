const mongoose=require("mongoose");
const bookingSchema=mongoose.Schema({
  HospitalId:String,
  HospitalName:String,
  TestId:String,
  UserId:{
    type: String,
    required:true,
    trim:true,
  },
  UserName:String,
  UserPhone:String,
  Testcategory:String,
  TestName:String,
  Prices:String,
  AppointmentDate:String,
  status:String,


})

module.exports=mongoose.model("Book",bookingSchema);