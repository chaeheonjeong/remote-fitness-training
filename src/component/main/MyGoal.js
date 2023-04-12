import styles from "./MyGoal.module.css";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import MyGoalModal from "../modal/MyGoalModal";
import axios from "axios";
import userStore from "../../store/user.store";
import { useNavigate } from "react-router-dom";

const MyGoal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [styHour, setStyHour] = useState(0);
  const [styMinute, setStyMinute] = useState(0);
  const [dealt, setDealt] = useState(0);
  const user = userStore();
  const navigate = useNavigate();

  const setTime = (h, m) => {
    setHour(h);
    setMinute(m);
  };

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get("http://localhost:8080/study-time", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setStyHour(Number(response.data.timeH));
            setStyMinute(Number(response.data.timeM));
          }
        })
        .catch((error) => {
          setStyHour(0);
          setStyMinute(0);
        });
    }
  }, []);

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get("http://localhost:8080/ggoal-time", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setHour(Number(response.data.goalTimeH));
            setMinute(Number(response.data.goalTimeM));
          }
        })
        .catch((error) => {
          console.log(error);
          setDealt(0);
          setHour(0);
          setMinute(0);
        });
    }
  }, []);

  useEffect(() => {
    let per =
      Math.floor(((styHour * 60 + styMinute) / (hour * 60 + minute)) * 10000) /
      100;
    if (per > 100) per = 100;
    setDealt(per);
  }, [styHour, styMinute, hour, minute]);

  return (
    <>
      <MyGoalModal
        visible={modalIsOpen}
        setVisible={setModalIsOpen}
        originMinute={minute}
        originHour={hour}
        setOriginTime={setTime}
      />
      <div className={styles.wrapper}>
        <div className={styles.title}>내 목표</div>
        <div className={styles.content}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ fontWeight: "570", fontSize: "0.85rem" }}>
              오늘 공부한 시간
            </label>
            <label
              style={{ fontWeight: "570", fontSize: "0.85rem", color: "gray" }}
            >
              &nbsp;/ 내 목표시간
            </label>
            <button
              className={styles.studyBtn}
              onClick={() => {
                user.token !== null ? setModalIsOpen(true) : navigate("/login");
              }}
            >
              설정
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <label style={{ fontWeight: "500", fontSize: "1.2rem" }}>
              {user.token !== null
                ? `${styHour}시간 ${styMinute}분`
                : `0시간 0분`}
            </label>
            <label
              style={{ fontWeight: "500", fontSize: "1.2rem", color: "gray" }}
            >
              &nbsp;/{" "}
              {user.token !== null
                ? `${String(hour)}시간 ${String(minute)}분`
                : `0시간 0분`}
            </label>
            <label className={styles.progLabel1}>
              {user.token !== null ? dealt : `0`}%
            </label>
            &nbsp;
            <label className={styles.progLabel2}>달성</label>
          </div>
          <div className={styles.progress}>
            <div
              style={{
                backgroundColor: "rgb(43, 209, 151)",
                height: "100%",
                width: user.token !== null ? `${dealt}%` : `0%`,
                borderRadius: "1rem",
                transition: "width 0.7s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyGoal;