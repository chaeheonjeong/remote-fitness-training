import styles from "./StudyRanking.module.css";
import SwiperCore, { Pagination, Autoplay, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import userStore from "../../store/user.store";
import axios from "axios";
import { useState, useEffect } from "react";

const StudyRanking = () => {
  const today = new Date();
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayOfWeek = daysOfWeek[today.getDay()];
  const formattedDate = `${year}.${month}.${date}(${dayOfWeek})`;
  const user = userStore();
  const [rankers, setRankers] = useState([]);
  const [rankLabel, setRankLabel] = useState("순위가 존재하지 않습니다.");

  SwiperCore.use([Autoplay]);
  const rankRender = (data, index) => {
    return (
      <>
        <SwiperSlide key={index}>
          <div className={styles.swiperContent}>
            <span>{index + 1}위</span>
            <span>{data.userName}</span>
            <span>
              {data.timeH} : {data.timeM} : {data.timeS}
            </span>
          </div>
        </SwiperSlide>
      </>
    );
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/ranking")
      .then((response) => {
        if (response.status === 200) {
          setRankers(response.data.rankTime);
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
        <span className={styles.title}>공부 시간 랭킹</span>
        <span className={styles.date}>{formattedDate} 오전 12:00 기준</span>
      </div>
      <div className={styles.content}>
        {rankers.length > 0 && (
          <Swiper
            className={styles.swiper}
            direction="vertical"
            freeMode={true}
            slidesPerView={1}
            spaceBetween={8}
            loop={true}
            autoplay={{ delay: 1000 }}
            preventInteractionOnTransition={true}
            modules={[Pagination, FreeMode, Autoplay]}
            speed={950}
          >
            {rankers.map((data, index) => {
              if (index < 10) {
                return rankRender(data, index);
              } else return false;
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default StudyRanking;
