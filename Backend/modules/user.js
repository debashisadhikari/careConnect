const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    Name:{
      type:String,
      require:[true,"Name must required"]
    },
    Phone:{
      type:String,
      require:[true,"Phone no must required"]
    },
    Password:{
      type:String,
      require:[true,"must be required"]
    },
    AccountType:{
      type:String,
      require:[true,"must be required"],
    },
    hospitalId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Hospital",
  default: null,
},
})
module.exports=mongoose.model("User",userSchema);