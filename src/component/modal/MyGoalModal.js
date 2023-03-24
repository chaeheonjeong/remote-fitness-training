import { useEffect, useState, useRef } from "react";
import styles from "./MyGoalModal.module.css";

export default function MyGoalModal({
  visible,
  setVisible,
  originMinute,
  originHour,
  setOriginTime,
}) {
  const [min, setMin] = useState(originMinute ?? 0);
  const [hour, setHour] = useState(originHour ?? 0);

  useEffect(() => {
    if (hour > 24) {
      setHour(24);
    } else if (hour === 24) {
      setMin(0);
    } else if (min > 60) {
      setMin(59);
    }
  }, [hour, min]);

  return (
      (
      <div className={`${styles.container} ${visible? styles.ModalOpen : styles.ModalClose}`}>
        <div className={styles.closeBox} onClick={() => setVisible(false)} />
        <div className={styles.modalWrapper}>
          하루 목표 공부시간을 설정해보세요!
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
            <button
              onClick={() => {
                setOriginTime(Number(hour), Number(min));
                setVisible(false);
              }}
              className={styles.btnOk}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    )
  );
}
