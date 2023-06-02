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

  const [postId, setPostId] = useState();

  const [pCount, setPCount] = useState(1);
  const [click, setClick] = useState(0);

  useEffect(() => {
    const fetchWrite = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getWrite/${id}`, {
          headers: { Authorization: `Bearer ${hook.user.token}` },
        });
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

      const response = await axios.post(
        `http://localhost:8080/selectedAlarm`,
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
    console.log("modal- ", !hook.recruit);
  };

  // 저장 버튼 클릭 시 서버로 데이터 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    setClick((click) => click + 1);

    try {
      if (selectedStudent.length === 1) {
        if (roomTitle !== "") {
          const res = await axios.post(`http://localhost:8080/selectionInfo`, {
            host: host,
            applicant: selectedStudent,
            roomTitle: roomTitle,
            runningTime: runningTime,
            startTime: startTime,
            date: date,
          });

          const res2 = await axios.post(`http://localhost:8080/recruitSave`, {
            _id: postId,
            recruit: !hook.recruit,
          });
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
    } catch (error) {
      console.log(error);
    }
  };

  const scheduleAdd = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/roomSchedule`, {
        host: host,
        applicant: selectedStudent,
        roomTitle: roomTitle,
        runningTime: runningTime,
        startTime: startTime,
        date: date,
      });
      if (res.data !== undefined) {
        hook.setEstimateAmount(res.data.result[0].estimateAmount);
        setStartTime(res.data.result[0].startTime);
        setRunningTime(res.data.result[0].runningTime);
        setDate(res.data.result[0].date);
      }
      console.log(res.data.message);
    } catch (err) {
      console.error("An error occurred:", err);
    }
  };

  const getRWriter = async () => {
    try {
      const res = await axios.get(
        `${BASE_API_URI}/getTApplicant/${id}`
      );

      if (res.data !== undefined) {
        console.log(res.data);
        setRWriterList(res.data.data);
        console.log(res.data.data);
        setPostId(res.data.postId);
        console.log(res.data.postId);
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
        <div className={styles.inputWrapper}>
          <form>
            <div className={styles.room_title}>
              <a>방 제목</a>
              <input
                type="text"
                name="title"
                onChange={(e) => setRoomTitle(e.target.value)}
                autoFocus
              />
              {click !== 0 && roomTitle === "" ? (
                <div id={styles.message}>방 제목을 입력하세요</div>
              ) : null}
            </div>

            <div className={styles.pick_teacher}>
              <a>강사 선택</a>
              <div className={styles.select_teacher}>
                {rWriterList.map((rWriter) => (
                  <div key={rWriter}>
                    <input
                      type="checkbox"
                      name={rWriter}
                      onChange={handleChechboxChange}
                    />
                    <label> {rWriter}</label>
                  </div>
                ))}
              </div>
              <div>
                {click !== 0 && pCount === 0 ? (
                  <div id={styles.message}>강사를 선택하세요.</div>
                ) : pCount > 1 ? (
                  <div id={styles.message}>강사는 1명만 선택 가능합니다.</div>
                ) : null}
              </div>
            </div>

            <div className={styles.start_time}>
              <a>예상시작시간</a>
              <input
                type="time"
                name="startTime"
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
              />
            </div>
            <div className={styles.running_time}>
              <a>예상진행시간 (분)</a>
              <input
                type="number"
                name="runningTime"
                min="0"
                max="1440"
                step="1"
                onChange={(e) => setRunningTime(e.target.value)}
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
export default SelectModal;
