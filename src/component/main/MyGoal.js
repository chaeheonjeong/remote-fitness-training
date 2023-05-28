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
  const [isLoading, setIsLoading] = useState(true);

  const setTime = (h, m) => {
    setHour(h);
    setMinute(m);
  };

  const saveHappinessIndex = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/saveHappinessIndex`, {
        happinessIndex : dealt,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(user.token !== null) {
      setIsLoading(true);
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
              setIsLoading(false);
            } else {
              setDealt(50);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          setDealt(50);
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get("http://localhost:8080/updateOrNot", { // 업데이트 여부
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            const updateOrNot = response.data.data;

            updateOrNot.forEach((value) => {
              console.log(value.stars);
              console.log("2: ", dealt);
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
  }, [dealt]);

  /* const changeCalculated = async () => {
    try {
      const response = await axios.post("http://localhost:8080/changeCalculated", {
        calculated: true,
      });
    } catch(error) {
      console.log(error);
    }
  } */

/*   useEffect(() => {
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
          setDealt(50);
          setHour(0);
          setMinute(0);
        });
    }
  }, []); */

  /* useEffect(() => {
    let per =
      Math.floor(((styHour * 60 + styMinute) / (hour * 60 + minute)) * 10000) /
      100;
    if (per > 100) per = 100;
    setDealt(per);
  }, [styHour, styMinute, hour, minute]); */

/*   useEffect(() => {
    let per = 50;

    switch(score) {
      case 0: 
        per = dealt - 1;
        break;
      case 1:
        per = dealt + 0.2;
        break;
      case 2:
        per = dealt + 0.4;
        break;
      case 3:
        per = dealt + 0.6;
        break;
      case 4:
        per = dealt + 0.8;
        break;
      case 5:
        per = dealt + 1;
        break;
    }

    if(per > 100) per = 100;
    setDealt(per);
  }, [dealt, score]); */

  return (
    <>
      {/* <MyGoalModal
        visible={modalIsOpen}
        setVisible={setModalIsOpen}
        originMinute={minute}
        originHour={hour}
        setOriginTime={setTime}
      /> */}
      <div className={styles.wrapper}>
        <div className={styles.title}>내 행복지수</div>
        <div className={styles.content}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <button
              className={styles.studyBtn}
              onClick={() => {
                user.token !== null ? setModalIsOpen(true) : navigate("/login");
              }}
            >
              설정
            </button> */}
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
            {/* <label className={styles.progLabel2}>달성</label> */}
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
