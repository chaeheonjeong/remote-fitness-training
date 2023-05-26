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
  const [preBtnClick, setPreBtnClick] = useState(false);

  const user = userStore();
  
  const getNotiData = async () => {
    try {
      const res = await axios
        .get(`http://localhost:8080/getAlarm`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        if(res.data !== undefined) {
          setNotiData(res.data.data[0]);
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
    if(notiData && notiData.content) {
      console.log("@@: ", notiData);
      setTotalPage(Math.ceil(notiData.content.length / perPage));
      setCurrentPage(1);
    }
  }, [notiData]);

  useEffect(() => {
    if(notiData && notiData.content) {
      const arr = notiData.content.slice((currentPage - 1) * perPage, perPage * currentPage);
      console.log(arr);
      setRendData(arr);
    } else {
      console.log("알림이없습니다.");
      setRendData(null);
    }
  }, [currentPage, notiData]);

  const handlePreBtn = async (id) => {
    console.log('id: ', id);
    try{
      const res = await axios.patch(
        `http://localhost:8080/updateRoomSchedule/${id}`,
        {
          prepaymentBtn: true
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      if(res.data.success) {
        setPreBtnClick(!preBtnClick);
        console.log('성공', id);
      }
    }catch(err){
      console.error(err);
    }
  }
  const handleReadComm = async (id) => {
    console.log('id: ', id);
    try {
      const res = await axios.patch(
        `http://localhost:8080/updateAlarm/${id}`,
        {
          read: true,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      
      if(res.data.success) {
        setReadComm(!readComm);
        console.log('성공', id);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  return {
    currentPage,
    setCurrentPage,
    totalPage,
    nextPage,
    beforePage,
    rendData,
    readComm,
    setReadComm,
    handleReadComm,
    handlePreBtn
  };
}