const Count=require("../modules/counting");
exports.countGet=async(req,res,next)=>{
  const hospitalId=req.session.hospitalId;
  const count=await Count.findOne({
    hospitalId:hospitalId,
  })
  if(!count){
    return res.status(504).json({
      success:false,
      message:"count is not found!",
    })
  }
  return res.status(200).json({
    success:true,
    message:"found!",
    count,
  })
}