const { check, validationResult } = require("express-validator");
const User=require("../modules/user");
const bcrypt=require("bcrypt");
const session = require("express-session");


exports.signupPost=[
   check("name")
   .notEmpty()
   .withMessage("Name is required")
   .isLength({ min: 2 })
   .withMessage("Name should be 2 or more character!")
   .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
   .withMessage("Name should only contains letters"),
   check("phone")
   .trim()
   .isMobilePhone("en-IN")
   .withMessage("Enter the valid phone number"),
   check("password")
   .isStrongPassword({
    minLength:8,
    minLowercase:1,
    minUppercase:1,
    minSymbols:1,
    minNumbers:1,
   })
   .withMessage("Password length must be 8 and contain uppercase, lowercase, number and special character"),
   check("confirmpassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password must be same");
      }

      return true;
    }),
    check("userType")
    .notEmpty()
    .withMessage("User type must be selected")
   
  ,async (req,res,next)=>{
  const name=req.body.name;
  const phone=req.body.phone;
  const password=req.body.password;
  const confirmPassword=req.body.confirmPassword || req.body.confirmpassword;
  const userType=req.body.accountType || req.body.userType;

  req.body.confirmPassword=confirmPassword;
  req.body.userType=userType;
 
  const err=validationResult(req);
  if(!err.isEmpty()){
    return res.status(400).json({
      success:false,
      error:err.array(),
      oldData:{
        name,
        phone,
      }
    })
  }
  try{
    const existingUser = await User.findOne({
    Phone: phone,
    AccountType: userType,
});

if (existingUser) {
    return res.status(409).json({
        success: false,
        message: "This phone number already exists",
    });
}
    const hashPass=await bcrypt.hash(password,12);
    const user= await new User({
      Name:name,
      Phone:phone,
      Password:hashPass,
      AccountType:userType,
    })

    await user.save();
    return res.status(200).json({
      success:true,
      message:"Sign up successfull!",
    })


  }catch(err){
    console.log(err);
    return res.status(400).json({
      success:false,
      message:"Sign up successfull!",
    })


  }
  
 
}]
exports.loginPost=[
  check("phone")
  .trim()
  .isMobilePhone("en-IN")
  .withMessage("Enter your valid mobile no: "),
  check("password")
  .isStrongPassword({
    minLength:8,
    minLowercase:1,
    minUppercase:1,
    minSymbols:1,
    minNumbers:1,
   }),
     check("userType")
    .notEmpty()
    .withMessage("User type must be selected")
  ,async(req,res,next)=>{
    const phone=req.body.phone;
    const password=req.body.password;
    const userType=req.body.accountType || req.body.userType;
    const err=validationResult(req);
    if(!err.isEmpty()){
      return res.status(400).json({
        success:false,
        error:err.array(),
        oldData:{
          phone,
        }

      })
    }
    console.log("this is before: ", phone,userType);
    const user=await User.findOne({
      Phone:phone,
      AccountType:userType,
      })
      console.log("user: ",user)
    if(!user){
      return res.status(400).json({
        success:false,
        message:"Enter correct phone number and Password",
      })
    }
    const isMacth=await bcrypt.compare(
      password,
      user.Password

    )
    
    if(!isMacth){
       return res.status(400).json({
        success:false,
        message:"Enter correct phone number and Password",
      })

    }
    req.session.UserId=user._id.toString();
    req.session.UserType=user.AccountType;
    if(user.hospitalId){
      req.session.hospitalId=user.hospitalId;
    }

    req.session.save((err)=>{
      if(err){
        return res.status(400).json({
          success:false,
          message:"Session is not create",
        })
      }
    })
    return res.status(200).json({
      success:true,
      message:"Succefully login!",
      User:user,
    })


}
]
exports.sessionGet=async(req,res,next)=>{
     if(!req.session) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }
    const UserId=req.session.UserId;
    

   const user=await User.findById(UserId);
   if(!user){
    return res.status(401).json({
      success:false,
      message:"User not found!",
    })
   }
   return res.status(200).json({
    success:true,
    message:"User is found",
    User:user,
   })
}
exports.logoutPost = (req, res) => {
  console.log("this is works");
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }

    res.clearCookie("connect.sid");

    return res.json({
      success: true,
      message: "Logout successful"
    });
  });
};
