const mongoose=require("mongoose");
const doctorSchema=mongoose.Schema({
  HospitalId:String,
   doctorName: {
      type: String,
      required: true,
      trim: true,
    },
HospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    room: {
      type: String,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      default: 30,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    availableDays: {
      type: [String],
      default: [],
    },

    languages: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
})
module.exports=mongoose.model("Doctor",doctorSchema);