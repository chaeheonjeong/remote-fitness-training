import { useEffect, useState } from "react";
//import { noti } from "../util/dummy";
import axios from "axios";
import userStore from "../store/user.store";

export default function useNoti() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [rendData, setRendData] = useState([]);
  const perPage = 5;
  const [notiData, setNotiData] = useState([]);
  //const notiData = noti;
  const [readComm, setReadComm] = useState(false);

  const user = userStore();
  
  const getNotiData = async () => {
    try {
      const res = await axios
        .get(`http://localhost:8080/getAlarm`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        if(res.data !== undefined) {
          setNotiData(res.data.data);

          console.log(res.data.data);
        }
    } catch(error) {
      console.log(error);
    }
  } 
  useEffect(() => {
    getNotiData();
  }, []);

  const nextPage = () => {
    if (currentPage < totalPage) setCurrentPage(currentPage + 1);
  };
  const beforePage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    setTotalPage(Math.ceil(notiData.length / perPage));
    setCurrentPage(1);
  }, [notiData]);

  useEffect(() => {
    const arr = notiData.slice((currentPage - 1) * perPage, perPage * currentPage);
    setRendData(arr);
  }, [currentPage, notiData]);
  
  return {
    currentPage,
    setCurrentPage,
    totalPage,
    nextPage,
    beforePage,
    rendData,
    readComm,
    setReadComm
  };
}