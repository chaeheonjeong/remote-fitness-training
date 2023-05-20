import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./SelectModal.module.css";
import usePost from "../../hooks/usePost";

import userStore from "../../store/user.store";

const SelectModal = ({ modal, setModal, onRecruitChange }) => { 
    const { id } = useParams();
    const user = userStore();
    const [rWriterList, setRWriterList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState([]);
    const [ok, setOk] = useState(false);

    const host = user.name;
    const [roomTitle, setRoomTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [date, setDate] = useState("");

    console.log(host);

    const hook = usePost();

    // checkbox 변경 시 상태 업데이트
    const handleChechboxChange = (e) => {
        const applicant = e.target.name;
        const isChecked = e.target.checked;
        
        if(isChecked) {
            setSelectedStudent([...selectedStudent, applicant]);
        } else {
            setSelectedStudent(selectedStudent.filter((name) => name !== applicant));
        }
    };

    const createAlarm = async (host, selectedStudent, roomTitle) => {
      try {
        const data = {
          host: host,
          selectedStudent: selectedStudent,
          roomTitle: roomTitle
        }

        const response = await axios
          .post(`http://localhost:8080/selectedAlarm`, data);

          console.log(response.data);
      } catch(error) {
        console.error(error);
      }
    };

    

    const handleRecruitChange = () => {
      onRecruitChange(!hook.recruit);
      hook.setRecruit(!hook.recruit);
    }

    // 저장 버튼 클릭 시 서버로 데이터 전송
    const handleSubmit = async (e) => {
        e.preventDefault();
        setModal(false);

        try {
            const res = await axios
            .post(`http://localhost:8080/selectionInfo`,  {
               host: host,
               applicant: selectedStudent,
               roomTitle: roomTitle,
               startTime: startTime,
               date: date
            });

            console.log("before-", ok);
            setOk(true);

            console.log(res.data.message);

            // 알림
            createAlarm(host, selectedStudent, roomTitle);
            handleRecruitChange();

        } catch(error) {
            console.log(error);
        }
    }

    // 댓글작성자 불러오기
    const getRWriter = async () => {
        try {
            const res = await axios
            .get(`http://localhost:8080/getRWriter/${id}/${user.name}`)

            console.log(user.name);

            if(res.data !== undefined) {
                console.log(res.data.data);
                setRWriterList(res.data.data);
            } else {
                console.log("아직 댓글작성자가 없습니다");
            }
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRWriter();
    }, [])

    return (
        /* 
          원하는 유저 고르기
          화상캠 방 제목 예상 시간 적을 수 있도록
          수강생이면 선금 내는
        */
          <div
          className={`${styles.container} ${
            modal ? styles.ModalOpen : styles.ModalClose
          }`}
        >
          <div className={styles.closeBox} onClick={() => setModal(false)} />
          <div className={styles.modalWrapper}>
            <strong>채택</strong>
            <button
              className={styles.ModalClose}
              onClick={() => setModal(false)}
            >
              &times;
            </button>
            <div className={styles.inputWrapper}>
              <form>
                <div>
                    <a>선생님</a>
                    <div className={styles.selectStudent}>
                        {rWriterList.map((rWriter) => (
                            <div key={rWriter}>
                                <input
                                    type="checkbox"
                                    name={rWriter}
                                    onChange={handleChechboxChange}  
                                />
                                <label>{rWriter}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <a>방 제목</a>
                    <input
                        type="text"
                        name="title"
                        onChange={ (e) => setRoomTitle(e.target.value) }
                        autoFocus
                    />
                </div>
                <div>
                    <a>예상시작시간</a>
                    <input  
                        type="time"
                        name="startTime"
                        onChange={ (e) => setStartTime(e.target.value) }
                    />
                </div>
                <div>
                  <a>시작예정일</a>
                  <input
                    type="date"
                    id="date"
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                  />
                </div>

                {/* 이 부분은 수강생이 선생님 모집하는 경우에만 보이기 */}
                <div>
                    <a className={styles.amount}>
                        선금 결제 금액 : 
                    </a>
                    <button>선금 결제하러 가기</button>
                </div>

              </form>
    
              <footer>
                <button
                  className={styles.makeOpenStudy}
                  type="submit"
                  onClick={handleSubmit}
                >
                  만들기
                </button>
                <button
                  className={styles.openStudyCancle}
                  onClick={() => {
                    setModal(false);
                  }}
                >
                  취소
                </button>
              </footer>
            </div>
          </div>
        </div>
    );
};
export default SelectModal;