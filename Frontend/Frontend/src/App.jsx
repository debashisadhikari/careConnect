import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Header from "./Pages/Header";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import AddTest from "./Pages/AddTest";
import ManageTests from "./Pages/ManageTest";
import AddDoctor from "./Pages/AddDoctor";
import ManageDoctors from "./Pages/ManageDoctor";

import HospitalProfile from "./Pages/ManageHospitalProfile";
import AdminHome from "./Pages/AdminDashboard";
import TestsPage from "./Pages/Home";
import MyBookings from "./Pages/Booking";
import BookingPage from "./Pages/AdminBookingPage";
import { useAuth } from "./Context/AuthContext";
import Doctor from "./Pages/DoctorPage";

 



















const App=()=>{
  const {User}=useAuth();

 
  return<>
  <Header></Header>
  
  <Routes>
     <Route path="" element={  <TestsPage/>}/>
    <Route path="/signup" element={<Signup/>}/>
     <Route path="/doctors" element={<Doctor/>}/>
    <Route path="/login" element={<Login/>}/>
    
   <Route path="/bookings" element={<MyBookings/>}/>
    
    <Route path="/admin/dashboard" element={<Dashboard/>}>
    <Route path="" element={<AdminHome/>}/>
     <Route path="add-test" element={<AddTest/>}/>
     <Route path="tests" element={<ManageTests/>}/>
     <Route path="add-doctor" element={<AddDoctor/>}/>
      <Route path="doctors" element={<ManageDoctors/>}/>
      
       <Route path="profile" element={<HospitalProfile/>}/>
       <Route path="bookings" element={<BookingPage/>}/>
      
    </Route>
   

  </Routes>
  </>
}
export default App;