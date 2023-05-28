import styles from "./StudyRanking.module.css";
import SwiperCore, { Pagination, Autoplay, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import userStore from "../../store/user.store";
import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { BiMedal } from "react-icons/bi";
import { BsCaretDownSquare } from "react-icons/bs";
import { CgCloseR } from "react-icons/cg";
import RankSwiper from "./RankSwiper";
import { BASE_API_URI } from "../../util/common";
import TestSwiper from "./TestSwiper";

const StudyRanking = () => {
  const today = new Date();
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayOfWeek = daysOfWeek[today.getDay()];
  const formattedDate = `${year}.${month}.${date}(${dayOfWeek})`;
  const [topHappiness, setTopHappiness] = useState([]);
  const medalColor = [
    "rgba(247, 247, 35, 0.99)",
    "rgb(190, 190, 182)",
    "rgb(177, 148, 31)",
    "rgb(65, 61, 33)",
  ];

  useEffect(() => {
    axios
      .get(`${BASE_API_URI}/recommend`)
      .then((response) => {
        if (response.status === 200) {
          setTopHappiness(response.data.topHappiness);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span className={styles.title}>행복지수왕 강사님</span>
        <span className={styles.date}>{formattedDate} 오전 12:00 기준</span>
      </div>
      <div className={styles.content}>
        {topHappiness.length > 0 && <RankSwiper rankers={topHappiness} />}
      </div>
    </div>
  );
};

export default StudyRanking;
