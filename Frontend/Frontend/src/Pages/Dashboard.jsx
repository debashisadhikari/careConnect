import { Navigate, Outlet, useNavigate } from "react-router-dom";
import AddTest from "./AddTest";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../Context/AuthContext";






const Dashboard=()=>{
  const navigate=useNavigate();
  const {User}=useAuth();
   if (!User) {
    alert("First yout should login as a Admin!")
    return <Navigate to="/login" replace />;
  }

  // If normal user tries to access admin dashboard
  if (User.AccountType === "user") {
    return <Navigate to="/" replace />;
  }

  // Only admin can access
  
  return <div className="min-h-screen w-full min-w-0 flex flex-col bg-slate-100 text-[14px] sm:text-[15px] lg:flex-row lg:text-[16px]">

  {/* Floating Sidebar */}
  <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-32px)] lg:ml-4 lg:my-4 lg:shrink-0">
    <div className="h-full overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-200">
      <AdminSidebar />
    </div>
  </div>

  {/* Main Content */}
  <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 xl:p-8">
    <Outlet />
  </main>

</div>
}
export default Dashboard;