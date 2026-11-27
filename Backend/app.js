const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const app=express();
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
//local files
const  {signupRoute}=require("./routes/auth/registerRoute");
const {loginRoute}=require("./routes/auth/loginRoute");
const {logoutRoute}=require("./routes/auth/logoutRoute");
const {sessionRoute}=require("./routes/session/sessionRoute");
const {addTestRoute}=require("./routes/other/addTest");
const {hospitalRoute}=require("./routes/other/addHospital");
const {doctorRoute}=require("./routes/other/doctor")
const {bookRoute}=require("./routes/other/book")
const {countRoute}=require("./routes/other/count")

dotenv.config();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
  methods:["GET","POST","PUT","DELETE","PATCH"],
  allowedHeaders:["Content-Type","Authorization"],
}))
app.use(express.json());
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 60 * 60 * 24
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: store,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false
    }
  })
)
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "The server is running"
    });
});
app.use(signupRoute);
app.use(loginRoute);
app.use(logoutRoute);
app.use(sessionRoute);
app.use(addTestRoute);
app.use(hospitalRoute);
app.use(doctorRoute);
app.use(bookRoute);
app.use(countRoute);

const PORT=process.env.PORT;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("The database connected successfully");
  app.listen(PORT,()=>{
  console.log("The server running on the PORT", PORT);
})

}).catch((err)=>{
    console.log("database are not connected error: ",err);
})
