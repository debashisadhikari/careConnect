exports.userProtected=async(req,res,next)=>{
    const user=req.session;
    if(!user){
      return res.status(404).json({
        success:false,
        message:"First login!",
      })
      
    }
    next();
}