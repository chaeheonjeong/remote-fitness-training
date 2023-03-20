import styles from "./MyGoal.module.css";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import MyGoalModal from "../modal/MyGoalModal";
import axios from "axios";

const MyGoal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [styHour, setStyHour] = useState(3);
  const [styMinute, setStyMinute] = useState(45);
  const [dealt, setDealt] = useState(0);

  const setTime = (h, m) => {
    setHour(h);
    setMinute(m);
  };

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
              onClick={() => setModalIsOpen(true)}
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
              {styHour}시간 {styMinute}분
            </label>
            <label
              style={{ fontWeight: "500", fontSize: "1.2rem", color: "gray" }}
            >
              &nbsp;/ {String(hour)}시간 {String(minute)}분
            </label>
            <label className={styles.progLabel1}>{dealt}%</label>&nbsp;
            <label className={styles.progLabel2}>달성</label>
          </div>
          <div className={styles.progress}>
            <div
              style={{
                backgroundColor: "rgb(43, 209, 151)",
                height: "100%",
                width: `${dealt}%`,
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
