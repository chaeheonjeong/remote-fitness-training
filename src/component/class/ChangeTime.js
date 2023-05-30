import { useEffect, useState, useRef } from "react";
import styles from "./ChangeTime.module.css";
import axios from "axios";
import userStore from "../../store/user.store";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BASE_API_URI } from "../../util/common";

const ChangeTime = ({
  originMinute,
  originHour,
  handleDropdownToggle,
  setOriginTime,
  roomTitle,
}) => {
  const [min, setMin] = useState(originMinute);
  const [hour, setHour] = useState(originHour);

  const changeTimeHandelr = () => {
    setOriginTime(Number(hour), Number(min));
    handleDropdownToggle();

    const timeData = {
      hour: hour,
      min: min,
    };

    axios
      .post(`${BASE_API_URI}/change-time`, {
        hour: Number(hour),
        minute: Number(min),
        roomTitle: roomTitle,
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (hour > 24) {
      setHour(24);
    } else if (hour === 24) {
      setMin(0);
    } else if (min > 59) {
      setMin(59);
    }
  }, [hour, min]);

  useEffect(() => {
    setMin(originMinute ?? 0);
    setHour(originHour ?? 0);
  }, [originMinute, originHour]);

  return (
    <>
      <div className={styles.contentWrapper}>
        <div style={{ fontWeight: "700" }}>남은 시간</div>
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
          <button onClick={handleDropdownToggle} className={styles.btnCancle}>
            취소
          </button>
          <button onClick={changeTimeHandelr} className={styles.btnOk}>
            적용
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangeTime;
