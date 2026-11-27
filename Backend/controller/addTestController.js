

const Hospital = require("../modules/hostpital");
const Test=require("../modules/test");
const Count=require("../modules/counting")


exports.addTestPoast=async(req,res,next)=>{
   const obj=req.body;
   console.log(obj);
   const hospitalId=req.session.hospitalId;
   if(!hospitalId){
    return res.status(504).json({
      success:false,
      message:"First you should cerate hospitl profile!",
    })
   }
   const hospital=await Hospital.findById(hospitalId);
  const test= await new Test({
    HospitalId:hospitalId,
    hospitalName:hospital.name,
    testName:obj.testName,
    category:obj.category,
    describtion:obj.describtion,
    price:obj.price,
    discountprice:obj.discountprice,
    duration:obj.duration,
    startTime:obj.startTime,
    endTime:obj.endTime,
    availableDays:obj.availableDays,
  })
  await test.save();
  const count=await Count.findOne({
    hospitalId:hospitalId,
  })
  count.testCnt++;
  await count.save();
 
  return res.status(200).json({
    success:true,
    message:"test is successfully added!",
  })

}
exports.editTestPost=async(req,res,next)=>{
  const obj=req.body;
  console.log(obj);
  const testId=obj._id;
  if(testId){
   const test= await Test.findById(testId);
   if(test){
    test.testName=obj.testName,
    test.category=obj.category,
    test.describtion=obj.describtion,
    test.price=obj.price,
    test.discountprice=obj.discountprice,
    test.duration=obj.duration,
    test.startTime=obj.startTime,
    test.endTime=obj.endTime,
    test.availableDays=obj.availableDays,
    await test.save();
    return res.status(200).json({
      success:true,
      message:"Change update!"
    })
   }
    }
    return res.status(504).json({
      success:false,
      message:"not updated",
    })
}
exports.testGetAdmin=async(req,res,next)=>{
    const hospitalId=req.session.hospitalId;
    console.log(hospitalId);
    const test=await Test.find({
       HospitalId:hospitalId,
    })
    if(test.length==0){
      return res.status(504).json({
        success:false,
        message:"Tests not found!",
      })
    }
    return res.status(200).json({
      success:true,
      message:"fetch successfull!",
      test,
    })

}
exports.testGetAll=async(req,res,next)=>{
   ;
    const test=await Test.find()
    const hospital= await Hospital.find();
    if(test.length==0){
      return res.status(504).json({
        success:false,
        message:"Tests not found!",
      })
    }
    
    return res.status(200).json({
      success:true,
      message:"fetch successfull!",
      allData:{ test,
      hospital,}
     
    })

}
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTest = await Test.findByIdAndDelete(id);
    const hospitalId=req.session.hospitalId;
    if(!hospitalId){
       return res.status(504).json({
      success:false,
      message:"First you should cerate hospitl profile!",
    })
    }

    if (!deletedTest) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }
 const count=await Count.findOne({
    hospitalId:hospitalId,
 })
 count.testCnt--;
   await count.save();
    return res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};