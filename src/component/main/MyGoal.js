import styles from "./MyGoal.module.css";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import MyGoalModal from "../modal/MyGoalModal";
import axios from "axios";
import userStore from "../../store/user.store";
import { useNavigate } from "react-router-dom";
import { TbClover2 } from "react-icons/tb";
import { BASE_API_URI } from "../../util/common";

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
        .get(`${BASE_API_URI}/study-time`, {
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
        .get(`${BASE_API_URI}/ggoal-time`, {
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
        <div className={styles.title}>내 행복지수</div>
        <div className={styles.content}>
          <div style={{ display: "flex", alignItems: "center" }}>
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
              행복지수 달성도
              <TbClover2 size="20" className={styles.clover} />
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
