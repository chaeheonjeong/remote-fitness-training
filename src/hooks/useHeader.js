import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser } from "react-icons/hi";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { BsPostcardHeart } from "react-icons/bs";
import { BsPostcard } from "react-icons/bs";
import { BsCalendarCheck } from "react-icons/bs";
import userStore from "../store/user.store";
import axios from "axios";

export default function useHeader() {
  const user = userStore();
  const navigate = useNavigate();
  const [dropVisible, setDropVisible] = useState(false);
  const [notiCount, setNotiCount] = useState(0);
  const popupWidth = 500;
  const popupHeight = 580;
  const popupX = window.screen.width / 1.5 - popupWidth / 2;
  const popupY = window.screen.height / 2.5 - popupHeight / 2;
  const popUrl = "/notification";
  const popTarget = "notification";
  const popFeat =
    "status=no, scrollbars=yes, location=no, height=" +
    popupHeight +
    ", width=" +
    popupWidth +
    ", left=" +
    popupX +
    ", top=" +
    popupY;
  const profileDrop = [
    {
      title: "내 정보",
      url: "/MyInfo",
      emo: <HiOutlineUser />,
    },
    { title: "포트폴리오", url: "/Portfolio", emo: <RiArchiveDrawerLine /> },
    { title: "관심글", url: "/myLikedPost", emo: <BsPostcardHeart /> },
    { title: "내가 쓴 글", url: "/myPost", emo: <BsPostcard /> },
    {
      title: "캘린더",
      url: "/MyCalendar",
      emo: <BsCalendarCheck />,
    },
  ];

  const el = useRef();

  useEffect(() => {
    const handleCloseDrop = (e) => {
      if (el.current && !el.current.contains(e.target)) {
        setDropVisible(false);
      }
    };
    window.addEventListener("click", handleCloseDrop);
    return () => {
      window.removeEventListener("click", handleCloseDrop);
    };
  }, [el]);

  useEffect(() => {
    const handleCloseDrop = (e) => {
      if (el.current && !el.current.contains(e.target)) {
        setDropVisible(false);
      }
    };
    window.addEventListener("click", handleCloseDrop);
    return () => {
      window.removeEventListener("click", handleCloseDrop);
    };
  }, [el]);

  useEffect(() => {
    if(user.token !== null) {
      axios
        .get("http://localhost:8080/getNotiCount", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setNotiCount(response.data.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  })

  return {
    popUrl,
    popTarget,
    popFeat,
    profileDrop,
    navigate,
    el,
    dropVisible,
    setDropVisible,
    notiCount
  };
}