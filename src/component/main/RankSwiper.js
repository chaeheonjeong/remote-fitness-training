import { useEffect } from "react";
import SwiperCore, { Pagination, Autoplay, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import styles from "./RankSwiper.module.css";
import { BiMedal } from "react-icons/bi";
const medalColor = [
  "rgba(247, 247, 35, 0.99)",
  "rgb(190, 190, 182)",
  "rgb(177, 148, 31)",
  "rgb(65, 61, 33)",
];

const rankRender = (data, index) => {
  return (
    <div className={styles.swiperContent}>
      <div className={styles.medalWrapper}>
        <BiMedal
          size="30"
          color={index < 3 ? medalColor[index] : medalColor[3]}
        />
        <span>{index + 1}위</span>
      </div>
      <span>
        {data.userName.length >= 8
          ? data.userName.substring(0, 8) + "..."
          : data.userName}
      </span>
      <span>
        {data.timeH.toString().padStart(2, "0")} :{" "}
        {data.timeM.toString().padStart(2, "0")} :{" "}
        {data.timeS.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

function RankSwiper({ rankers }) {
  useEffect(() => {
    SwiperCore.use([Pagination, FreeMode, Autoplay]);
  }, []);

  return (
    <>
      {rankers.length > 0 && (
        <Swiper
          className={styles.swiper}
          direction="vertical"
          freeMode={true}
          slidesPerView={1}
          spaceBetween={8}
          loop={true}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          preventInteractionOnTransition={true}
          speed={950}
          touchRatio={0}
        >
          {rankers.map((data, index) => {
            if (index < 10) {
              return (
                <SwiperSlide key={index + data}>
                  {rankRender(data, index)}
                </SwiperSlide>
              );
            }
          })}
        </Swiper>
      )}
    </>
  );
}

export default RankSwiper;