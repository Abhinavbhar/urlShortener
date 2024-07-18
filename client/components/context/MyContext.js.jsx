'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Header from '../ui/header';
const MyContext = createContext();
export const MyProvider = () => {
  const [data, setData] = useState({});

  useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authcheck`,{withCredentials:true}
          );
          console.log(res.data,"hello")
          setData(res.data);
        } catch (error) {
          setData(null);
        }
      };
      fetchData();
    }
  , []);

  return (
    <MyContext.Provider value={{ data, setData }}>
<Header></Header>
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
