import { useEffect, useState, useRef } from "react";
import styles from "./ReviewModal.module.css";
import axios from "axios";
import userStore from "../../store/user.store";
import { HiStar } from "react-icons/hi";
import { BsFillPencilFill } from "react-icons/bs";
import { BASE_API_URI } from "../../util/common";

export default function ReviewModal({ visible, setVisible }) {
  const [teacherRoomSchedules, setTeacherRoomSchedules] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null); // 선택된 항목의 index
  const [star, setStar] = useState(0);
  const starIcons = [];
  const [reviewContent, setReviewContent] = useState("");
  const today = new Date();
  const formatDate = (today) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dateW = today.getDate();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const formattedDate = `${year}.${month}.${dateW}(${dayOfWeek})`;

    return formattedDate;
  };

  const user = userStore();

  useEffect(() => {
    axios
      .get(`${BASE_API_URI}/get-reviews`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          const { result } = response.data;
          setTeacherRoomSchedules(result);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [visible]);

  const handleStarClick = (selectedStar) => {
    setStar(selectedStar === star ? 0 : selectedStar);
  };

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const backClickHandler = () => {
    setVisible(false);
    setSelectedItemIndex(null);
    setStar(5);
  };

  const sendReviewHandler =
    (teacherId, sendStar, reviewWrittenId) => async (e) => {
      setVisible(false);
      setSelectedItemIndex(null);
      setStar(5);

      const formatToday = formatDate(today);

      try {
        const response = await axios.post(`${BASE_API_URI}/send-review`, {
          teacherId: teacherId,
          sendStar: sendStar,
          reviewWrittenId: reviewWrittenId,
          reviewContent: reviewContent,
          writerName: user.name,
          date: formatToday,
        });
        if (response.status === 200) {
          alert("리뷰를 보냈습니다.");
        }
      } catch (error) {
        console.error("리뷰 보내기 실패", error);
      }
    };

    for (let i = 0; i < 5; i++) {
      const starColor = i < star ? "#ffc107" : "#e4e5e9";
      starIcons.push(
        <HiStar
          key={i}
          color={starColor}
          onClick={() => handleStarClick(i + 1)}
        />
      );
    }

  return (
    <div
      className={`${styles.container} ${
        visible ? styles.ModalOpen : styles.ModalClose
      }`}
    >
      <div className={styles.closeBox} onClick={backClickHandler} />
      <div className={styles.modalWrapper}>
        <BsFillPencilFill size="40" className={styles.clock} />
        <div style={{ fontWeight: "700" }}>리뷰작성</div>
        <div className={styles.contentWrapper}>
          <div className={styles.inputWrapper}></div>
          {selectedItemIndex === null ? (
            teacherRoomSchedules !== undefined &&
            teacherRoomSchedules.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(index)}
                className={
                  selectedItemIndex === index ? styles.selectedItem : ""
                }
              >
                <div>강사 이름 : {item.userName}</div>
                <div>방 이름 : {item.roomTitle}</div>
                <div>날짜 : {item.date}</div>
                <div>시작 시간: {item.startTime}</div>
                -----------------------------------
              </div>
            ))
          ) : (
            <div>
              <div>
                강사 이름 : {teacherRoomSchedules[selectedItemIndex]?.userName}
              </div>
              <div>
                방 이름 : {teacherRoomSchedules[selectedItemIndex]?.roomTitle}
              </div>
              <div>날짜 : {teacherRoomSchedules[selectedItemIndex]?.date}</div>
              <div>
                시작 시간: {teacherRoomSchedules[selectedItemIndex]?.startTime}
              </div>
              <div>
                미팅 시간:
                {teacherRoomSchedules[selectedItemIndex]?.runningTime}분
              </div>
              <div>별점</div>
              <div style={{ display: "flex" }}>
                {starIcons}
              </div>
              <div> 선택한 별점 {star}</div>
              <input
                placeholder="input태그에요 리뷰를 작성해주세요"
                onChange={(e) => setReviewContent(e.target.value)}
              ></input>
              <button
                className={styles.btnOk}
                onClick={sendReviewHandler(
                  teacherRoomSchedules[selectedItemIndex]?.userId,
                  star,
                  teacherRoomSchedules[selectedItemIndex]?._id,
                  reviewContent
                )}
              >
                리뷰 보내며 잔금 결제하러가기
              </button>
              {/* 추가적인 내용 표시 */}
            </div>
          )}
          <div className={styles.buttonWrapper}>
            {/* <button
                onClick={() => setVisible(false)}
                className={styles.btnCancle}
              >
                취소
              </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
