import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
   export const StoreContext=createContext();
   export const StoreProvider=({children})=>{
    const addTestController=async(formdata)=>{
      const res=await fetch("http://localhost:4800/api/addTest",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formdata),

      })
      const data=await res.json();
       return data;


    }
    const getAllTests=async()=>{
      const res=await fetch("http://localhost:4800/api/getAllTests",{
        method:"GET",
        credentials:"include",
      })
      const data=await res.json();
      console.log(data);
      return data.allData;
    }
    const getTest=async()=>{
      const res=await fetch("http://localhost:4800/api/fetchTest",{
        method:"GET",
        credentials:"include",
      })
      const data=await res.json();
      console.log(data);
      const Test=data.test;
      
      console.log(Test);
      return Test;
    }
    const editTest=async(formdata)=>{
      console.log("this is change");
      const res = await fetch("http://localhost:4800/api/editTest",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formdata),
      })
      const data=await res.json();
      console.log(data);
    }
    const deleteTest=async(id)=>{
      const res=await fetch(`http://localhost:4800/api/delete/${id}`,{
        method:"DELETE",
        credentials:"include",
      });
      const data=await res.json();
      console.log("thisis data",data);
    }

    const manageHospital=async(formdata)=>{
      const res=await fetch("http://localhost:4800/api/addHospital",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formdata),

      })
      const data=await res.json();
      console.log(data);
    }
    const getHospital=async()=>{
      const res=await fetch("http://localhost:4800/api/getHospital",{
        method:"GET",
        credentials:"include",
      })
      const data=await res.json();
      console.log(data);
      return data.hospital;
    }
    const addDoctor=async(formdata)=>{
      const res=await fetch("http://localhost:4800/api/addDoctor",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formdata),
      })
      const data=await res.json();
      console.log(data);
    }
    const getDoctor=async()=>{
      console.log("this is get doctor api");
      const res=await fetch("http://localhost:4800/api/getDoctor",{
        method:"GET",
        credentials:"include",

      })
      const data=await res.json();
      console.log(data);
      return data.doctor;

    }
    const editDoctor=async(formdata)=>{
      console.log("this is works1",formdata);
      const res=await fetch("http://localhost:4800/api/editDoctor",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formdata),

      })
      const data=await res.json();
      console.log(data);
    }

    const getAllDoctor=async()=>{
       const res=await fetch("http://localhost:4800/api/allDoctor",{
        method:"GET",
        credentials:"include",
       })
       const data=await res.json();
       console.log(data);
       return data.doctor;
    }
    const deleteDoctor=async(id)=>{
      const res=await fetch(`http://localhost:4800/api/deleteDoctor/${id}`,{
        method:"DELETE",
        credentials:"include",
      })
      const data=await res.json();
      console.log(data);
      return data.message;

    }
    const postBook=async(formdata)=>{
      console.log("this si rokae");
     
      const res=await fetch("http://localhost:4800/api/postBook",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formdata),
      
      })
      const data=await res.json();
      if(data.success==true){
        alert("booked!");
      }
    }
    const getBook=async()=>{
      const res=await fetch("http://localhost:4800/api/getBook",{
        method:"GET",
        credentials:"include",
      })
      const data=await res.json();
      console.log(data);
      return data.book;
    }
      const getBookAll=async()=>{
      const res=await fetch("http://localhost:4800/api/getBooks",{
        method:"GET",
        credentials:"include",
      })
      const data=await res.json();
      console.log(data);
      return data.book;
    }
    const editBook=async(data)=>{
       const res=await fetch("http://localhost:4800/api/editBook",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
       })
      //  const data=await res.json();
      //  console.log(data);
    }
    const getCount=async()=>{
      const res=await fetch("http://localhost:4800/api/count",{
        method:"GET",
        credentials:"include",
      })
      const data=await res.json();
      return data.count;
    }
    return <StoreContext.Provider
    value={{addTestController,manageHospital,editTest, deleteTest,getTest, addDoctor,getAllTests,getDoctor, editDoctor,postBook,getBook,getBookAll,getHospital,getCount,editBook,deleteDoctor,getAllDoctor}}
    >
      {children}

    </StoreContext.Provider>

   }
   export const useStore=()=>{
    return useContext(StoreContext);
   }
