import { useEffect, useState, useRef } from "react";
import styles from "./TimeoutModal.module.css";
import axios from "axios";
import userStore from "../../store/user.store";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function TimeoutModal({ onConfirm }) {
  return (
    <div className={`${styles.container} ${styles.ModalOpen}`}>
      <div className={styles.modalWrapper}>
        <AiOutlineClockCircle size="40" className={styles.clock} />
        <div className={styles.contentWrapper}>
          <div style={{ fontWeight: "700" }}>
            화상미팅 시간을 모두 사용하셨습니다!
          </div>
          <button onClick={onConfirm} className={styles.btnOk}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
