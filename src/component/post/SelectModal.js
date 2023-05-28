import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./SelectModal.module.css";
import usePost from "../../hooks/usePost";

import userStore from "../../store/user.store";
import { BASE_API_URI } from "../../util/common";

const SelectModal = ({ modal, setModal, onRecruitChange }) => {
  const { id } = useParams();
  const user = userStore();
  const [rWriterList, setRWriterList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [ok, setOk] = useState(false);
  const hook = usePost();

  const host = user.name;
  const [roomTitle, setRoomTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchWrite = async () => {
      try {
        const res = await axios.get(
          `${BASE_API_URI}/getWrite/${hook.id}`,
          {
            headers: { Authorization: `Bearer ${hook.user.token}` },
          }
        );
        if (res.data !== undefined) {
          hook.setEstimateAmount(res.data.result[0].estimateAmount);
          setStartTime(res.data.result[0].startTime);
          setRunningTime(res.data.result[0].runningTime);
          setDate(res.data.result[0].date);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWrite();
  }, []);

    const [preBtn, setPreBtn] = useState(false);
    const [postId, setPostId] = useState();

    const [pCount, setPCount] = useState(1);

    

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
        roomTitle: roomTitle,
      };

      const response = await axios.post(
        `${BASE_API_URI}/selectedAlarm`,
        data
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecruitChange = () => {
    onRecruitChange(!hook.recruit);
    hook.setRecruit(!hook.recruit);
  };

    // 저장 버튼 클릭 시 서버로 데이터 전송
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          if(selectedStudent.length === 1) {
            if(preBtn === true && roomTitle !== "" && startTime !== "") {
              const res = await axios
              .post(`${BASE_API_URI}/selectionInfo`,  {
                host: host,
                applicant: selectedStudent,
                roomTitle: roomTitle,
                runningTime: runningTime,
                startTime: startTime,
                date: date
              });

              const res2 = await axios
              .post(`${BASE_API_URI}/recruitSave`, {
                _id: postId,
                recruit: !hook.recruit,
              });

              console.log("before-", ok);
              setOk(true);

              console.log(res.data.message);

            // 알림
            createAlarm(host, selectedStudent, roomTitle);
            handleRecruitChange();
            scheduleAdd();

              
              setModal(false);
            }
          } else {
            setPCount(selectedStudent.length);
          }
        } catch(error) {
            console.log(error);
        }
    }

  const scheduleAdd = async () => {
    try {
      const res = await axios.post(`${BASE_API_URI}/roomSchedule`, {
        host: host,
        applicant: selectedStudent,
        roomTitle: roomTitle,
        runningTime: runningTime,
        startTime: startTime,
        date: date,
      });
      console.log(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // 댓글작성자 불러오기
  const getRWriter = async () => {
    try {
      const res = await axios.get(
        `${BASE_API_URI}/getRWriter/${id}/${user.name}`
      );

      console.log(user.name);

            if(res.data !== undefined) {
                console.log("hi ", res.data.data);
                setRWriterList(res.data.data);
                setPostId(res.data.postId);
            } else {
                console.log("아직 댓글작성자가 없습니다");
            }
        } catch(error) {
            console.log(error);
        }
    }

  useEffect(() => {
    getRWriter();
  }, []);

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
                    <a>강사</a>
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
                        <div>
                          {pCount === 0 ? (
                            <div>강사를 채택하세요.</div>
                          ) : (
                            pCount > 1 ? (
                              <div>강사는 1명만 채택 가능합니다.</div>
                            ) : null
                          )}
                        </div>
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
                    { 
                      roomTitle === "" ? (
                        <div>방 제목을 입력하세요</div>
                      ) : null 
                    }
                </div>
                <div>
                    <a>예상시작시간</a>
                    <input  
                        type="time"
                        name="startTime"
                        onChange={ (e) => setStartTime(e.target.value) }
                        value={startTime}
                    />
                </div>
                <div>
                    <a>예상진행시간</a>
                    <input  
                        type="number"
                        name="runningTime"
                        min="0" 
                        max="1440" 
                        step="1"
                        onChange={ (e) => setRunningTime(e.target.value) }
                        value={runningTime}
                    /> 분
                </div>
                <div>
                  <a>시작예정일</a>
                  <input
                    type="date"
                    id="date"
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                    value={date}
                  />
                </div>

                {/* 이 부분은 수강생이 선생님 모집하는 경우에만 보이기 */}
                <div>
                    <a className={styles.amount}>
                        선금 결제 금액 : {hook.estimateAmount}
                    </a>
                    <button onClick={(e) => {
                      e.preventDefault();
                      setPreBtn(true);
                    }}>
                      선금 결제하러 가기
                    </button>
                </div>

              </form>
    
              <footer>
                <button
                  className={styles.makeOpenStudy}
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!preBtn} // 선금 버튼 눌렀을 때만 버튼 활성화
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
