import styles from "./MyGoal.module.css";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import MyGoalModal from "../modal/MyGoalModal";
import axios from "axios";
import userStore from "../../store/user.store";
import { useNavigate } from "react-router-dom";
import { TbClover2 } from "react-icons/tb";

const MyGoal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [styHour, setStyHour] = useState(0);
  const [styMinute, setStyMinute] = useState(0);
  const [dealt, setDealt] = useState();
  const user = userStore();
  const navigate = useNavigate();

  const [score, setScore] = useState([]);

  const setTime = (h, m) => {
    setHour(h);
    setMinute(m);
  };

  /* const saveHappinessIndex = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/saveHappinessIndex`, {
        happinessIndex : dealt,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch(error) {
      console.log(error);
    }
  }; */

  useEffect(() => {
    if(user.token !== null) {
      axios
        .get("http://localhost:8080/getHappinessIndex", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if(response.status === 200) {
            if(response.data.data !== null) {
              console.log(response.data.data);
              console.log(response.data.message);
              setDealt(response.data.data);
              //saveHappinessIndex();
            } else {
              setDealt(50);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          setDealt(50);
        });
    }
  }, []);

 /*  useEffect(() => {
    if (user.token !== null) {
      axios
        .get("http://localhost:8080/updateOrNot", { // 업데이트 여부
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            const updateOrNot = response.data.data;

            console.log("2: ", dealt);

            updateOrNot.forEach((value) => {
              console.log("starts", value.stars);
              if(value.stars === 0) {
                setDealt((prevDealt) => Math.round((prevDealt - 1) * 10) / 10);
              } else if(value.stars >= 1 && value.stars <= 5) {
                setDealt((prevDealt) => Math.round((prevDealt + value.stars * 0.2) * 10) / 10);           
              }
              if(dealt > 100) setDealt(100);
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    console.log("dealt: ", dealt);
    saveHappinessIndex();
  }, [dealt]); */

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.title}>내 행복지수</div>
        <div className={styles.content}>
          <div style={{ display: "flex", alignItems: "center" }}>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "0.8rem",
            }}
          >
            <label style={{ fontWeight: "500", fontSize: "1.2rem" }}>
              행복지수
                <TbClover2
                size="20"
                className={styles.clover}
              />
            </label>
            <label className={styles.progLabel1}>
              {user.token !== null ? dealt : `50`}%
            </label>
            &nbsp;
          </div>
          <div className={styles.progress}>
            <div
              style={{
                backgroundColor: "rgb(43, 209, 151)",
                height: "100%",
                width: user.token !== null ? `${dealt}%` : `50%`,
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