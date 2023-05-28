import { useEffect, useState, useRef } from "react";
import styles from "./MyGoalModal.module.css";
import axios from "axios";
import userStore from "../../store/user.store";
import { AiOutlineClockCircle } from "react-icons/ai";

export default function MyGoalModal({
  visible,
  setVisible,
  originMinute,
  originHour,
  setOriginTime,
}) {
  const [min, setMin] = useState(0);
  const [hour, setHour] = useState(0);
  const user = userStore();

  const goalModalHandelr = () => {
    setOriginTime(Number(hour), Number(min));
    setVisible(false);

    axios
      .post(
        "http://localhost:8080/goal-time",
        { hour: Number(hour), min: Number(min) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (hour > 24) {
      setHour(24);
    } else if (hour === 24) {
      setMin(0);
    } else if (min > 60) {
      setMin(59);
    }
  }, [hour, min]);

  useEffect(() => {
    setMin(originMinute ?? 0);
    setHour(originHour ?? 0);
  }, [originMinute, originHour]);

  return (
    <div
      className={`${styles.container} ${
        visible ? styles.ModalOpen : styles.ModalClose
      }`}
    >
      <div className={styles.closeBox} onClick={() => setVisible(false)} />
      <div className={styles.modalWrapper}>
        <AiOutlineClockCircle size="25" className={styles.clock} />
        <div className={styles.contentWrapper}>
          <div style={{ fontWeight: "700" }}>
            하루 목표 공부시간을 설정해보세요!
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              value={hour === "" ? 0 : hour}
              min="0"
              onChange={(e) => {
                setHour(e.target.value.replace(/(^0+)/, ""));
              }}
              className={styles.inputStyle}
            />{" "}
            시간
            <input
              type="number"
              value={min === "" ? 0 : min}
              min="0"
              onChange={(e) => {
                setMin(e.target.value.replace(/(^0+)/, ""));
              }}
              className={styles.inputStyle}
            />{" "}
            분
          </div>
          <div className={styles.buttonWrapper}>
            <button
              onClick={() => setVisible(false)}
              className={styles.btnCancle}
            >
              취소
            </button>
            <button onClick={goalModalHandelr} className={styles.btnOk}>
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}