const User=require("../modules/user")
const Book=require("../modules/booking");
const Count=require("../modules/counting")


exports.bookPost=async(req,res,next)=>{
      const userId=req.session.UserId;
      
      const obj=req.body;
  console.log(obj);
      const user=await User.findById(userId);

      
      const book=await new Book({
          HospitalId:obj.HospitalId,
          HospitalName:obj.hospitalName,
          TestId:obj.TestId,
          UserId:userId,
          UserName:user.Name,
          UserPhone:user.Phone,
          Testcategory:obj.category,
          TestName:obj.testName,
           Prices:obj.price,
            AppointmentDate:obj.appointmentDate,
          status:"pending",
      })
      await book.save();
      const count=await Count.findOne({
        hospitalId:obj.HospitalId,
      })
      count.appointmentCnt++;
      count.save();
      return res.status(200).json({
        success:true,
        message:"Booked",
      })
      // user.Name,
      // user.Phone,
      
}
exports.getBookAll=async(req,res,next)=>{
  const userId=req.session.UserId;
  const book=await Book.find({
    UserId:userId,
  })
  if(!book){
    return res.status(504).json({
      success:false,
      message:"you are not booked any appointment yet!",
    })
  }
  return res.status(200).json({
    success:true,
    book:book,
  })
}
exports.getBook=async(req,res,next)=>{
   const hospitalId=req.session.hospitalId;
   const book=await Book.find({
      HospitalId:hospitalId,
   })
   console.log(book);
   if(!book){
    return res.status(404).json({
      success:false,
      message:"not found!",
    })
   }
   return res.status(200).json({
    success:true,
    messahe:"all booked!",
    book,
   })
}

exports.editBook=async(req,res,next)=>{
    const obj=req.body;
    console.log(obj);
    const book=await Book.findById(obj._id);
    if(!book){
      return res.status(504).json({
        success:false,
        message:"slote is not found!",
      }
      )
    }
    if(obj.status=="pending"){
      return res.status(404).json({
        success:false,
        message:"not possible to change"
      })
    }
     if((book.status=="completed"||book.status=="cancelled")&&obj.status=="confirm"){
      return res.status(404).json({
        success:false,
        message:"not possible to change"
      })
     }
      if((book.status=="cancelled")&&obj.status=="completed"){
      return res.status(404).json({
        success:false,
        message:"not possible to change"
      })
     }

    book.status=obj.status;
    await book.save();
    return res.status(200).json({
      success:true,
      message:"update is successfull!",
    })
   
}