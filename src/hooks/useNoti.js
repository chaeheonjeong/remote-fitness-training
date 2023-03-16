import { useEffect, useState } from "react";
import { noti } from "../util/dummy";

export default function useNoti() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [rendData, setRendData] = useState([]);
  const perPage = 5;
  const notiData = noti;
  const [readComm, setReadComm] = useState(false);

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
    const arr = noti.slice((currentPage - 1) * perPage, perPage * currentPage);
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
