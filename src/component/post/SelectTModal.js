import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./SelectModal.module.css";
import usePost from "../../hooks/useTPost";

import userStore from "../../store/user.store";
import { BASE_API_URI } from "../../util/common";

// 학생모집
const SelectTModal = ({ modal, setModal, onRecruitChange, participate }) => {
  const { id } = useParams();
  const user = userStore();
  const [rWriterList, setRWriterList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [ok, setOk] = useState(false);
  const hook = usePost();

  const host = user.name;
  const [roomTitle, setRoomTitle] = useState("");
  const [startTime, setStartTime] = useState("");

  const [pCount, setPCount] = useState(1);

  const [postId, setPostId] = useState();
  const [hostId, setHostId] = useState();
  const [click, setClick] = useState(0);
  const [runningTime, setRunningTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchWrite = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/getTWrite/${id}`, {
          headers: { Authorization: `Bearer ${hook.user.token}` },
        });
        if (res.data !== undefined) {
          setStartTime(res.data.result[0].startTime);
          setRunningTime(res.data.result[0].runningTime);
          hook.setEstimateAmount(res.data.result[0].estimateAmount);
          setDate(res.data.result[0].date);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWrite();
  }, []);

  // checkbox 변경 시 상태 업데이트
  const handleChechboxChange = (e) => {
    const applicant = e.target.name;
    const isChecked = e.target.checked;

    if (isChecked) {
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

      const response = await axios.post(`${BASE_API_URI}/selectedTAlarm`, data);

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecruitChange = () => {
    onRecruitChange(!hook.recruit);
    hook.setRecruit(!hook.recruit);
    console.log("modal- ", !hook.recruit);
  };

  // 저장 버튼 클릭 시 서버로 데이터 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    setClick((click) => click + 1);

    try {
      if (selectedStudent.length === Number(participate.charAt())) {
        if (roomTitle !== "" && startTime !== "") {
          const res = await axios.post(`${BASE_API_URI}/selectionTInfo`, {
            hostId: hostId,
            host: host,
            applicant: selectedStudent,
            roomTitle: roomTitle,
            runningTime: runningTime,
            startTime: startTime,
            date: date,
          });

          const res2 = await axios.post(`${BASE_API_URI}/recruitTSave`, {
            _id: postId,
            recruit: !hook.recruit,
          });

          console.log("before-", ok);
          setOk(true);

          // 알림
          createAlarm(host, selectedStudent, roomTitle);
          handleRecruitChange();
          scheduleAdd();

          setModal(false);
        }
      } else {
        setPCount(selectedStudent.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scheduleAdd = async () => {
    try {
      const res = await axios.post(`${BASE_API_URI}/TRoomSchedule`, {
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

  // 신청자 불러오기
  const getRWriter = async () => {
    try {
      const res = await axios.get(
        `${BASE_API_URI}/getSApplicant/${id}`
      );

      if (res.data !== undefined) {
        console.log(res.data.data);
        setRWriterList(res.data.data);
        setPostId(res.data.postId);
        setHostId(res.data.hostId);
      } else {
        console.log("아직 댓글작성자가 없습니다");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        {/* <button
          className={styles.ModalClose}
          onClick={() => setModal(false)}
        >
          &times;
        </button> */}
        <div className={styles.inputWrapper}>
          <form>
            <div className={styles.room_title}>
                <a>방 제목</a>
                <input
                    type="text"
                    name="title"
                    onChange={ (e) => setRoomTitle(e.target.value) }
                    autoFocus
                />
                { 
                  click !== 0 && roomTitle === "" ? (
                    <div id={styles.message}>방 제목을 입력하세요</div>
                  ) : null 
                }
            </div>
            
            <div className={styles.pick_teacher}>
                <a>수강생 선택</a>
                <div className={styles.select_teacher}>
                    {rWriterList.map((rWriter) => (
                        <div key={rWriter}>
                            <input
                                type="checkbox"
                                name={rWriter}
                                onChange={handleChechboxChange}  
                            />
                            console.log(rWriter);
                            <label>{rWriter}</label>
                        </div>
                    ))}
                    <div>
                      {click !== 0 && pCount === 0 ? (
                        <div id={styles.message}>수강생을 선택하세요.</div>
                      ) : (
                        selectedStudent.length !== Number(participate.charAt()) ? (
                          <div id={styles.message}>{`${participate}`} 선택 가능합니다.</div>
                        ) : null
                      )}
                    </div>
                </div>
            </div>
            
            <div className={styles.start_time}>
                <a>예상시작시간</a>
                <input  
                    type="time"
                    name="startTime"
                    onChange={ (e) => setStartTime(e.target.value) }
                    value={startTime}
                />
                { 
                  click !== 0 && startTime === "" ? (
                    <div id={styles.message}>예상시작시간을 설정하세요</div>
                  ) : null 
                }
            </div>
            <div className={styles.running_time}>
                <a>예상진행시간 (분)</a>
                <input  
                    type="number" 
                    min="0" 
                    max="1440" 
                    step="1"
                    name="runningTime"
                    onChange={ (e) => setRunningTime(e.target.value) }
                    value={runningTime}
                />
            </div>
            <div className={styles.start_date}>
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
          </form>

          <footer>
            <button
              className={styles.cancle}
              onClick={() => {
                setModal(false);
              }}
            >
              취소
            </button>
            <button
              className={styles.make}
              type="submit"
              onClick={handleSubmit}
            >
              만들기
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};
export default SelectTModal;
