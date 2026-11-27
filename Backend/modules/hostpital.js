
const mongoose=require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    hospitalType: {
      type: String,
      required: true,
      enum: [
        "Private Multispeciality Hospital",
        "Government Hospital",
        "Private Hospital",
        "Clinic",
        "Diagnostic Center",
        "Nursing Home",
      ],
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    establishedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pinCode: {
      type: String,
      required: true,
      trim: true,
    },

    about: {
      type: String,
      default: "",
      trim: true,
    },

    facilities: [],
  },
);

module.exports=mongoose.model("Hospital",hospitalSchema);
