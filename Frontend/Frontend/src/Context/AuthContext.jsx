
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate=useNavigate();

  const [User,setUser]=useState(null);
  const [err,setErr]=useState(null);

  
const signup = async (formData) => {
  const res = await fetch("http://localhost:4800/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (data.success === true) {
    navigate("/login");
  }

  return data;
};

  const checkLogin=async()=>{
    const res=await fetch("http://localhost:4800/api/me",{
      method:"GET",
      credentials:"include",
    })
    if(!res.ok){
      return;
    }
    const data=await res.json();
    console.log("account types",data.User.AccountType);
    setUser(data.User);
    navigate("/admin/dashboard");
  }

  const login = async(formData) => {
    console.log(formData);
     const res=await fetch("http://localhost:4800/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
       credentials: "include",
      body: JSON.stringify(formData),

     })
     const data=await res.json();
     console.log(data);
     if(data.success===true){
     setUser(data.User)
      return navigate("/");
     }
     return data;
     

   
     
  };

  const logout = async () => {
     const res=await fetch("http://localhost:4800/api/logout",{
      method:"GET",
      credentials:"include",
     })
     if(!res.ok){
      return;
     }
     setUser(null);
     
    
    };
   
   
    useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signup, login, logout, User}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
