const mongoose=require("mongoose");
const testSchema=mongoose.Schema({
  HospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    default: null,
  },
  hospitalName:String,
  testName:String,
  category:String,
  describtion:String,
  price:String,
  discountprice:String,
  duration:String,
  startTime:String,
  endTime:String,
  availableDays:[],
})
module.exports=mongoose.model("Test", testSchema);