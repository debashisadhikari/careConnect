const express=require("express");
const bookRoute=express.Router();
const {bookPost,getBookAll,getBook,editBook}=require("../../controller/bookingCotroller")
const {adminProtected}=require("../../middleWire/adminProtected");
const {userProtected}=require("../../middleWire/userProtected");
bookRoute.post("/api/postBook",userProtected,bookPost);
bookRoute.get("/api/getBook",userProtected,getBookAll);
bookRoute.get("/api/getBooks",adminProtected,getBook);
bookRoute.post("/api/editBook",adminProtected,editBook);
exports.bookRoute=bookRoute;