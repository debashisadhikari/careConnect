exports.adminProtected=async(req,res,next)=>{
    const user=req.session;
    if(!user){
      return res.status(404).json({
        success:false,
        message:"First login!",
      })
      
    }
    if(user.UserType=="user"){
        return res.status(404).json({
        success:false,
        message:"First login as admin",
      })
      }
    if(!user.hospitalId){
      return res.status(404).json({
        success:false,
        flag:"hos",
        message:"add hospital first!",
      })
    }
    next();
}