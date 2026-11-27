
const Hospital = require("../modules/hostpital");
const User=require("../modules/user");
const Count=require("../modules/counting");
const express=require("express");

exports.hospitalPost = async (req, res, next) => {
  try {
    const obj = req.body;
    const sesUser=req.session;
    if(!sesUser){
      return res.status(404).json({
        success:false,
        message:"login first!",
      })
    }
    if(sesUser.UserType!="admin"){
      return res.status(404).json({
        success:false,
        message:"login first as a admin",
      })
    }

    const userId=req.session.UserId;
    console.log(userId);
    const user=await User.findById(userId);
    console.log(user);
  


    const exist=await Hospital.findOne({
      registrationNo: obj.registrationNo,
    });
    if(!exist){
   const hospital = new Hospital({
  name: obj.name,
  registrationNo: obj.registrationNo,
  hospitalType: obj.hospitalType,
  email: obj.email,
  phone: obj.phone,
  alternatePhone: obj.alternatePhone,
  website: obj.website,
  establishedYear: obj.establishedYear,
  address: obj.address,
  city: obj.city,
  state: obj.state,
  pinCode: obj.pinCode,
  about: obj.about,
  facilities: obj.facilities,
 
  
});
console.log(hospital);
await hospital.save();

 user.hospitalId=hospital._id;
 await user.save();
 req.session.hospitalId=hospital._id;

 const count= await new Count({
  hospitalId:hospital._id.toString(),
  doctorCnt:0,
  testCnt:0,
  appointmentCnt:0,
 })
 await count.save();

 
 
  }else{
 
  
  exist.name = obj.name;
  exist.hospitalType = obj.hospitalType;
  exist.email = obj.email;
  exist.phone = obj.phone;
  exist.alternatePhone = obj.alternatePhone;
  exist.website = obj.website;
  exist.establishedYear = obj.establishedYear;
  exist.address = obj.address;
  exist.city = obj.city;
  exist.state = obj.state;
  exist.pinCode = obj.pinCode;
  exist.about = obj.about;
  exist.facilities = obj.facilities;
  await exist.save();
  user.hospitalId=exist._id;
  await user.save();
req.session.hospitalId=exist._id;
 
  }
 

   return res.status(201).json({
      success: true,
      message: "Successfully added hospital",
      
    });
    
    
   

   

  } catch (err) {
    console.error("Hospital creation error:", err);

    return res.status(500).json({
      success: false,
      message: "Hospital not added",
      error: err.message,
    });
  }
};
exports.hospitalGet=async(req,res,next)=>{
  const hospitalId=req.session.hospitalId;
  
  const hospital=await Hospital.findById(hospitalId);
  if(!hospital){
    return res.status(504).json({
      success:false,
      message:"Hospital now found",
    })
  }
  return res.status(200).json({
    success:true,
    message:"thhis is hospotal",
    hospital:hospital,
  })
}