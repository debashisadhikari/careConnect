const Doctor=require("../modules/doctor");
const Hospital=require("../modules/hostpital")
const Count=require("../modules/counting");
const doctor = require("../modules/doctor");
exports.addDoctor=async(req,res,next)=>{
          const obj=req.body;
          const hospitalId=req.session.hospitalId;
          console.log("this is doctor sesction");
         
        
          const hospital=await Hospital.findById(hospitalId);
          console.log(hospital);
         
          if(!hospital){
             return res.status(404).json({
              success:false,
              message:"this is not works",
             })
          }
          console.log(obj);
          const doctor = new Doctor({
              HospitalId: hospital._id,
              HospitalName:hospital.name,
              doctorName:obj.doctorName,
              specialization:obj.specialization,
              qualification:obj.qualification,
              experience:obj.experience,
              registrationNumber:obj.registrationNumber,
              email:obj.email,
              phone:obj.phone,
              room:obj.room,
               consultationFee:obj.consultationFee,
               duration:obj.duration,
               startTime:obj.startTime,
               endTime:obj.endTime,
               availableDays:obj.availableDays,
               languages:obj.languages,
               about:obj.about,
               status:obj.status,

    
});
             console.log(doctor);
          await doctor.save();
          const count=await Count.findOne({
            hospitalId:hospitalId,
          })
          count.doctorCnt++;
          await count.save();
          

          return res.status(200).json({
            success:true,
            message:"successfu;;y added",
          })
}
 exports.getDoctor=async(req,res,next)=>{
       const hospitalId=req.session.hospitalId;
       const doctor=await Doctor.find({
          HospitalId:hospitalId,
       })
       if(!doctor){
         return res.status(400).json({
            success:false,
            message:"not fountDoctor",
         })
       }
       return res.status(200).json({
         success:true,
         doctor:doctor,
       })
 }
 exports.editDoctor=async(req,res,next)=>{
      const hospitalId=req.session.hospitalId;
      const obj=req.body;
      console.log("this is rorjfrkfjr");
      console.log(obj.registrationNumber);
      const doctor=await Doctor.findOne({
            HospitalId:hospitalId,
            registrationNumber:obj.registrationNumber,
      })
      console.log("this is doctor", doctor);
              doctor.qualification=obj.qualification;
               doctor.experience=obj.experience;
              doctor.email=obj.email;
              doctor.phone=obj.phone;
              doctor.room=obj.room;
               doctor.consultationFee=obj.consultationFee;
               doctor.duration=obj.duration;
               doctor.startTime=obj.startTime;
               doctor.endTime=obj.endTime;
               doctor.availableDays=obj.availableDays;
               doctor.languages=obj.languages;
               doctor.about=obj.about;
               doctor.status=obj.status;
               await doctor.save();
      return res.status(200).json({
         success:true,
         message:"this is wroks",
      })
 }
 exports.getAllDoctor=async(req,res,next)=>{
   const doctor=await Doctor.find();
   if(!doctor){
      return res.status(404).json({
         success:false,
         message:"doctor is not found!",
      })
   }
   return res.status(200).json({
      success:true,
      message:"succefully fetch all doctor!",
      doctor:doctor,
   })
 }
 exports.deleteDoctor=async(req,res,next)=>{
   const hospitalId=req.session.hospitalId;
   try{
    const { id } = req.params;
    const deleteDoctor=await Doctor.findByIdAndDelete(id);
    if(!deleteDoctor){
      return res.status(404).json({
         seuccess:false,
         message:"not delete doctor!",
      })
    }
    const count=await Count.findOne({
      hospitalId:hospitalId,
    })
    count.doctorCnt--;
    count.save();
    return res.status(200).json({
      success:true,
      message:"Doctor is deleted",
   
    })
    i
   }catch(err){
   return res.status(500).json({
      success:false,
      message:"Internal err",
   })
   }
 }