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
  const [myRank, setMyRank] = useState([]);
  const [styHour, setStyHour] = useState(0);
  const [styMinute, setStyMinute] = useState(0);
  const [stySecond, setStySecond] = useState(0);
  const [dropVisible, setDropVisible] = useState(false);
  const [aniVisible, setAniVisible] = useState(false);
  const medalColor = [
    "rgba(247, 247, 35, 0.99)",
    "rgb(190, 190, 182)",
    "rgb(177, 148, 31)",
    "rgb(65, 61, 33)",
  ];

  /*   useEffect(() => {
    SwiperCore.use([Pagination, FreeMode, Autoplay]);
  }, []); */

  /*   SwiperCore.use([Pagination, FreeMode, Autoplay]); */

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

  /*   const mySwiper = new Swiper('.swiper-container', {
    className= {styles.swiper},
    direction="vertical",
    freeMode={true},
    slidesPerView={1},
    spaceBetween={8},
    loop={true}
    autoplay={{
      delay: 1000,
      disableOnInteraction: false,
    }}
    preventInteractionOnTransition={true}
    modules={[Pagination, FreeMode, Autoplay]}
    speed={950}
    touchRatio={0}
  }); */

  /* useEffect(() => {
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
  }, []); */

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

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get("http://localhost:8080/myRanking", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setStyHour(response.data.studyTimeH);
            setStyMinute(response.data.studyTimeM);
            setStySecond(response.data.studyTimeS);
            setMyRank(response.data.myRank);
          } else if (response.status === 204) {
            setMyRank(0);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (dropVisible) setAniVisible(dropVisible);
    else
      setTimeout(() => {
        setAniVisible(dropVisible);
      }, 200);
  }, [dropVisible]);

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
      <div
        className={styles.contentWrapper}
        onClick={() => {
          rankers.length > 1 && setDropVisible(!dropVisible);
        }}
      >
        {rankers.length > 1 && (
          <div className={styles.arrow}>
            {aniVisible ? (
              <CgCloseR
                size="19"
                color="rgb(170, 170, 170)"
                onClick={() => {
                  setDropVisible(!dropVisible);
                }}
              />
            ) : (
              <BsCaretDownSquare
                size="18"
                color="rgb(170, 170, 170)"
                onClick={() => {
                  setDropVisible(!dropVisible);
                }}
              />
            )}
          </div>
        )}
        {aniVisible && (
          <div
            className={`${styles.rankersDropdown} ${
              dropVisible ? styles.dropOpen : styles.dropClose
            }`}
          >
            {rankers.map((data, index) => {
              if (index < 10) {
                return (
                  <div
                    style={{
                      backgroundColor: `${
                        index % 2 === 0 ? "white" : "rgb(245, 245, 245)"
                      }`,
                      padding: "1.37rem 0rem",
                    }}
                    key={index + data + "&"}
                  >
                    {rankRender(data, index)}
                  </div>
                );
              } else return false;
            })}
          </div>
        )}
        <div className={styles.content}>
          {rankers.length === 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "50%",
              }}
            >
              <div className={styles.noRanking}>
                공부 랭킹이 존재하지 않습니다
              </div>
            </div>
          )}
          {rankers.length > 0 && (
            <RankSwiper rankers={rankers} />
            /*             <Swiper
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
              modules={[Pagination, FreeMode, Autoplay]}
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
                } else return false;
              })}
            </Swiper> */
          )}
          <div
            style={{
              height: "50%",
              backgroundColor: "rgb(245, 245, 245)",
              borderTop: "1px solid rgb(226, 226, 226)",
              borderRadius: "0 0 0.5rem 0.5rem",
            }}
          >
            {user.token !== null ? (
              <div className={styles.myRankContent}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <span
                    style={{
                      marginLeft: "0.2rem",
                      width: "1.4rem",
                      backgroundColor: "rgb(109, 210, 126)",
                      position: "relative",
                      borderRadius: "0.3rem",
                    }}
                  ></span>
                  <span
                    style={{
                      marginLeft: "0.45rem",
                      marginTop: "0.05rem",
                      borderRadius: "0.3rem",
                      color: "white",
                      fontSize: "0.9rem",
                      position: "absolute",
                    }}
                  >
                    나
                  </span>
                  <span style={{ marginLeft: "0.3rem" }}>{myRank}위</span>
                </div>
                <span>
                  {user.name.length >= 7
                    ? user.name.substring(0, 7) + "..."
                    : user.name}
                </span>
                <span>
                  {styHour.toString().padStart(2, "0")} :{" "}
                  {styMinute.toString().padStart(2, "0")} :{" "}
                  {stySecond.toString().padStart(2, "0")}
                </span>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className={styles.loginMyRanking}>
                  로그인 후 내 공부시간을 확인해주세요
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRanking;
