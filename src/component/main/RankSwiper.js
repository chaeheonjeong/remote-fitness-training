import { useEffect } from "react";
import SwiperCore, { Pagination, Autoplay, FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import styles from "./RankSwiper.module.css";
import { BiMedal } from "react-icons/bi";
import { HiUserCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Portfolio from "../mypage/Portfolio";

const medalColor = [
  "rgba(247, 247, 35, 0.99)",
  "rgb(190, 190, 182)",
  "rgb(177, 148, 31)",
];

const RankRender = ({ ranker, index }) => {
  return (
    <div className={styles.swiperContent}>
      <div className={styles.medalWrapper}>
        <BiMedal size="30" color={index < 3 && medalColor[index]} />
      </div>
      <span>
        {ranker.profileImage === null ? (
          <HiUserCircle
            size="40"
            color="#5a5a5a"
            style={{ cursor: "pointer" }}
          />
        ) : (
          <img
            className={styles.profile}
            src={ranker.profileImage}
            alt="프로필 이미지"
          />
        )}
      </span>
      <span>
        {ranker.name.length > 8
          ? ranker.name.substring(0, 8) + "..."
          : ranker.name}
      </span>
      <span>{ranker.happiness}</span>
      {ranker.portfolio.length !== 0 && (
        <div>
          <span>성별: {ranker.portfolio.gender}</span>
          <span>경력: {ranker.portfolio.career}</span>
          <span>가격대: {ranker.portfolio.price}</span>
          {Array.isArray(ranker.portfolio.sports) && (
            <span>
              종목:{" "}
              {ranker.portfolio.sports.map((sport, index) => (
                <span key={index + "#$"}>{sport}</span>
              ))}
            </span>
          )}
          {Array.isArray(ranker.portfolio.paymentMethods) && (
            <span>
              결제수단:{" "}
              {ranker.portfolio.paymentMethods.map((payment, index) => (
                <span key={index + "&*"}>{payment}</span>
              ))}
            </span>
          )}
          <span>제목: {ranker.portfolio.title}</span>
        </div>
      )}
    </div>
  );
};

function RankSwiper({ rankers }) {
  const navigate = useNavigate();
  useEffect(() => {
    SwiperCore.use([Pagination, FreeMode, Autoplay, Navigation]);
  }, []);

  return (
    <>
      {rankers.length > 0 && (
        <Swiper
          style={{
            "--swiper-navigation-color": "#16C79A",
            "--swiper-pagination-color": "#16C79A",
            "--swiper-navigation-size": "30px"
          }}
          className={styles.swiper} // 수정된 부분
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop={true}
        >
          {rankers.map((ranker, index) => {
            if (index < 3) {
              return (
                <SwiperSlide
                  key={index + "&&"}
                  onClick={() => {
                    navigate(`/PortfolioView/${ranker.userId}`);
                  }}
                >
                  <RankRender ranker={ranker} index={index} />
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
