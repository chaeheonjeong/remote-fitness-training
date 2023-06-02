import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import './MyCalendar.css';
import moment from 'moment';
import { IconName } from "react-icons/go";
import axios from "axios";
import { FcPlus } from "react-icons/fc";
//import styles from "./SelectModal.module.css";
import usePost from "../../hooks/usePost";
import Modal from "react-modal";
import userStore from "../../store/user.store";
import SideBar from "./SideBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../main/Header";
import useNoti from "../../hooks/useNoti";
//import ReviewList from './ReviewList'; // 수정: 후기 목록 컴포넌트 추가
//import ReviewModal from './ReviewModal'; // 수정: 후기 모달 컴포넌트 추가

import { BASE_API_URI } from "../../util/common";
import MyGoal from "../main/MyGoal";
import ReviewModal from "./ReviewModal";

function MyCalendar() {
  const { id } = useParams();
  const user = userStore();
  const navigate = useNavigate();
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const token = localStorage.getItem("token");
  const [scheduleList, setScheduleList] = useState([]);
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);
  const [roomSchedules, setRoomSchedules] = useState([]);

  const [TaddModalIsOpen, setTAddModalIsOpen] = useState(false);
  const [TdetailModalIsOpen, setTDetailModalIsOpen] = useState(false);
  const [TreviewModalIsOpen, setTReviewModalIsOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null); // 선택한 방
  const [roomList, setRoomList] = useState([]); // 방 목록
  const [selectedStars, setSelectedStars] = useState(0); // 추가: 선택한 별점

  const [review, setReview] = useState("");

  //강사모집의 경우
  const [TselectedRoom, setTSelectedRoom] = useState(null); // 선택한 방
  const [TroomList, setTRoomList] = useState([]); // 방 목록
  const [TselectedStars, setTSelectedStars] = useState(0); // 추가: 선택한 별점
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchRoomSchedules = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/roomSchedules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoomSchedules(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoomSchedules();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/schedules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchedules();
  }, []);

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleSelectSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setDetailModalIsOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalIsOpen(false);
    setTitle("");
    setContents("");
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentsChange = (e) => {
    setContents(e.target.value);
  };

  const handleDelete = () => {
    if (selectedSchedule) {
      axios
        .delete(`${BASE_API_URI}/schedules/${selectedSchedule._id}`)
        .then((res) => {
          console.log("delete success: ", res.data);
          console.log(schedules);
          const updatedSchedules = schedules.filter(
            (schedule) => schedule._id !== selectedSchedule._id
          );
          setSchedules(updatedSchedules);
          setSelectedSchedule(null);
          setDetailModalIsOpen(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleModify = () => {
    axios
      .put(
        `${BASE_API_URI}/schedules/${selectedSchedule._id}`,
        selectedSchedule
      )
      .then((res) => {
        console.log("update success: ", res.data);
        const updatedScheudles = schedules.map((schedule) => {
          if (schedule._id === selectedSchedule._id) {
            return selectedSchedule;
          } else {
            return schedule;
          }
        });
        setSchedules(updatedScheudles);
        setSelectedSchedule(null);
        setDetailModalIsOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        `${BASE_API_URI}/schedules`,
        {
          title: title,
          date: date,
          contents: contents,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newSchedule = {
        _id: res.data._id,
        title: title,
        contents: contents,
        date: date,
      };
      console.log("Success: ", res.data);
      setSelectedSchedule(newSchedule);
      setSchedules([...schedules, newSchedule]);
      handleAddModalClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleClick = (roomSchedule) => {
    const { startTime, runningTime, date } = roomSchedule;
    const scheduleStartTime = new Date(`${date} ${startTime}`);
    const scheduleEndTime = new Date(
      scheduleStartTime.getTime() + runningTime * 60000
    );
    const roomTitle = roomSchedule.roomTitle;

    console.log(scheduleStartTime);
    console.log(scheduleEndTime);

    const currentDateTime = new Date();
    const currentDate = new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth(),
      currentDateTime.getDate()
    );

    if (currentDateTime < scheduleStartTime) {
      window.alert("입장 시간이 아직 되지 않았습니다.");
    } else if (currentDateTime > scheduleEndTime) {
      window.alert("입장 시간이 초과되었습니다.");
    } else if (currentDate.getTime() > scheduleStartTime.getTime()) {
      window.alert("이미 지난 방 일정입니다.");
    } else {
      navigate(`/class/chat/${roomTitle}`);
    }
  };

  const tileContent = ({ date, view }) => {
    const filteredSchedules = schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return (
        scheduleDate.getDate() === date.getDate() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getFullYear() === date.getFullYear() &&
        (view === "month" ||
          (view === "week" && scheduleDate.getDay() === date.getDay()))
      );
    });

    const filteredRoomSchedules = roomSchedules.filter((roomSchedule) => {
      const roomScheduleDate = new Date(roomSchedule.date);
      return (
        roomScheduleDate.getDate() === date.getDate() &&
        roomScheduleDate.getMonth() === date.getMonth() &&
        roomScheduleDate.getFullYear() === date.getFullYear() &&
        (view === "month" ||
          (view === "week" && roomScheduleDate.getDay() === date.getDay()))
      );
    });

    return (
      <div>
        <div>
          {filteredSchedules.map((schedule) => (
            <div
              className="showSchedule"
              key={schedule.title}
              onClick={() => handleSelectSchedule(schedule)}
            >
              {schedule.title}
            </div>
          ))}
        </div>
        <div>
          {filteredRoomSchedules.map((roomSchedule) => {
            return roomSchedule.userType === "Student" &&
              roomSchedule.prepaymentBtn === true ? (
              <div
                className="showRoomSchedule"
                key={roomSchedule.roomTitle}
                onClick={() => {
                  handleScheduleClick(roomSchedule);
                  setAddModalIsOpen(false);
                }}
              >
                {roomSchedule.roomTitle}
              </div>
            ) : null;
          })}
        </div>
        <div>
          {filteredRoomSchedules.map((roomSchedule) => {
            return roomSchedule.userType === "Teacher" ? (
              <div
                className="showRoomSchedule"
                key={roomSchedule.roomTitle}
                onClick={() => {
                  handleScheduleClick(roomSchedule);
                  setAddModalIsOpen(false);
                }}
              >
                {roomSchedule.roomTitle}
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  };

  //////후기 작성 구현

  // 후기 작성 모달 내에서 방 목록을 관리할 상태 추가
  const [roomListModal, setRoomListModal] = useState([]);
  const [participatedRooms, setParticipatedRooms] = useState([]);
  const [selectedHost, setSelectedHost] = useState(null);
  const [selectedHostId, setSelectedHostId] = useState(null);

  //강사모집의 경우
  const [TroomListModal, setTRoomListModal] = useState([]);
  const [TparticipatedRooms, setTParticipatedRooms] = useState([]);
  const [TselectedApplicant, setTSelectedApplicant] = useState(null);
  //const [TselectedApplicant, setTSelectedApplicant] = useState([null, null]); // 수정: 강사 이름을 배열로 변경
  const [TselectedApplicantId, setTSelectedApplicantId] = useState(null);
  //const [TselectedApplicantId, setTSelectedApplicantId] = useState([null, null]); // 수정: 강사 ID를 배열로 변경
  //const [TselectedStars, setTSelectedStars] = useState([0, 0]); // 수정: 강사별 별점을 배열로 변경

  // 방 선택 시 후기 작성 모달 열기
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setSelectedHost(room.host); // 호스트 정보 저장
    setSelectedHostId(room.hostId);
    setReviewModalIsOpen(true);
  };

  //강사모집의 경우
  // 방 선택 시 후기 작성 모달 열기
  const ThandleRoomSelect = (room) => {
    setTSelectedRoom(room);
    setTSelectedApplicant(room.applicant); // 호스트 정보 저장
    setTSelectedApplicantId(room.applicantId);
    setTReviewModalIsOpen(true);
  };

  const handleSelectDate = (date) => {
    const filteredSchedules = schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return (
        scheduleDate.getDate() === date.getDate() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getFullYear() === date.getFullYear()
      );
    });

    const filteredRoomSchedules = roomSchedules.filter((roomSchedule) => {
      const roomScheduleDate = new Date(roomSchedule.date);
      return (
        roomScheduleDate.getDate() === date.getDate() &&
        roomScheduleDate.getMonth() === date.getMonth() &&
        roomScheduleDate.getFullYear() === date.getFullYear()
      );
    });

    if (filteredRoomSchedules.length > 0) {
      return;
    }

    if (filteredSchedules.length === 1) {
      setSelectedSchedule(filteredSchedules[0]);
      setDetailModalIsOpen(true);
    } else if (filteredSchedules.length > 1) {
      setScheduleList(filteredSchedules);
      setDetailModalIsOpen(true);
    } else {
      setDate(date);
      setAddModalIsOpen(true);
    }
  };

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

  // 방 목록 가져오기
  const fetchRoomList = async () => {
    try {
      const response = await axios.get(`${BASE_API_URI}/rooms`);
      const rooms = response.data.map((room, index) => ({
        id: index + "*&*&*&*", // 간단하게 인덱스를 사용하여 id 설정
        name: room,
        description: "", // 빈 설명 추가
      }));
      // 후기가 작성된 방 필터링
      const filteredRooms = rooms.filter(
        (room) =>
          !participatedRooms.some(
            (participatedRoom) => participatedRoom.name === room.name
          )
      );
      /* const filteredRooms = rooms.filter((room) => {
                // 후기 작성 여부 확인
                const reviewed = isRoomReviewed(room.name);
                // 후기가 작성되지 않은 방만 필터링
                return !reviewed;
              }); */

      setRoomListModal(filteredRooms);
    } catch (error) {
      console.error(error);
    }
  };

  //강사모집의 경우
  // 방 목록 가져오기
  const TfetchRoomList = async () => {
    try {
      const response = await axios.get(`${BASE_API_URI}/Trooms`);
      const Trooms = response.data.map((room, index) => ({
        id: index + "*(*(*(*(", // 간단하게 인덱스를 사용하여 id 설정
        name: room,
        description: "", // 빈 설명 추가
      }));

      // 후기가 작성된 방 필터링
      const TfilteredRooms = Trooms.filter(
        (room) =>
          !TparticipatedRooms.some(
            (TparticipatedRoom) => TparticipatedRoom.name === room.name
          )
      );
      /* const TfilteredRooms = Trooms.filter((room) => {
                // 후기 작성 여부 확인
                const Treviewed = TisRoomReviewed(room.name);
                // 후기가 작성되지 않은 방만 필터링
                return !Treviewed;
              }); */

      setTRoomListModal(TfilteredRooms);
    } catch (error) {
      console.error(error);
    }
  };

  // 후기를 작성한 방인지 확인하는 함수
  const isRoomReviewed = async (roomName) => {
    try {
      const response = await axios.get(`${BASE_API_URI}/reviews`);
      const reviews = response.data;

      // 방 이름과 현재 사용자를 기준으로 후기 데이터를 필터링
      const filteredReviews = reviews.filter(
        (review) =>
          review.roomName === roomName && review.studentName === user.name
      );

      // 후기가 존재하면 true, 존재하지 않으면 false 반환
      return filteredReviews.length > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  //강사 모집의 경우
  // 호스트가 후기를 작성한 방인지 확인하는 함수
  const TisRoomReviewed = async (roomName) => {
    try {
      const response = await axios.get(`${BASE_API_URI}/Treviews`);
      const Treviews = response.data;

      // 방 이름을 기준으로 후기 데이터를 필터링
      const TfilteredReviews = Treviews.filter(
        (review) =>
          review.roomName === roomName && review.studentName === user.name
      );

      // 후기가 존재하면 true, 존재하지 않으면 false 반환
      return TfilteredReviews.length > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const fetchParticipatedRooms = async () => {
    try {
      const response = await axios.get(`${BASE_API_URI}/selectionTInfo`);
      const participatedRooms = response.data
        .filter((room) => room.applicant.includes(user.name))
        .map((room) => ({
          id: room._id + "^&^&^&^",
          hostId: room.hostId,
          name: `방 이름 : ${room.roomTitle}`,
          description: `강사: ${room.host} - 시작시간: ${room.startTime}`,
          host: room.host, // 호스트의 이름 추가
        }));
      setParticipatedRooms(participatedRooms);
    } catch (error) {
      console.error(error);
    }
  };

  //강사 모집의 경우
  const TfetchParticipatedRooms = async () => {
    try {
      const response = await axios.get(`${BASE_API_URI}/selectionInfo`);
      const TparticipatedRooms = response.data
        .filter((room) => room.host.includes(user.name))
        .map((room) => ({
          id: room._id + "{}{}",
          applicantId: room.applicantId,
          name: `방 이름 : ${room.roomTitle}`,
          description: `강사: ${room.applicant} - 시작시간: ${room.startTime}`,
          applicant: room.applicant, // 호스트의 이름 추가
        }));
      setTParticipatedRooms(TparticipatedRooms);
    } catch (error) {
      console.error(error);
    }
  };

    
  useEffect(() => {
    fetchRoomList();
  }, [participatedRooms]);

  //강사모집
  useEffect(() => {
    TfetchRoomList();
  }, [TparticipatedRooms]);



  //////// 별점 기능
  const handleReviewModalClose = () => {
    setSelectedRoom(null);
    setReviewModalIsOpen(false);
    setSelectedStars(0); // 추가: 별점 선택 초기화
  };

  //강사 모집의 경우
  const ThandleReviewModalClose = () => {
    setTSelectedRoom(null);
    setTReviewModalIsOpen(false);
    //setTSelectedStars([0, 0]);
    setTSelectedStars(0); // 추가: 별점 선택 초기화
  };

  const handleReviewModalOpen = async () => {
    await fetchRoomList(); // Fetch room list before opening the modal
    setReviewModalIsOpen(true);
  };

  //강사 모집
  const ThandleReviewModalOpen = async () => {
    await TfetchRoomList(); // Fetch room list before opening the modal
    setTReviewModalIsOpen(true);
  };

  const handleStarClick = (stars) => {
    setSelectedStars(stars);
  };

  //강사 모집
  const ThandleStarClick = (stars) => {
    setTSelectedStars(stars);
  };
  /*  const ThandleStarClick = (star, index) => {
        setTSelectedStars((prevStars) => {
          const updatedStars = [...prevStars]; // 이전의 별점 배열을 복사
          updatedStars[index] = star; // 해당 인덱스에 새로운 별점 설정
          return updatedStars; // 업데이트된 별점 배열 반환
        });
      }; */

  //console.log(selectedSchedule);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      // 별점과 사용자 ID를 DB에 저장하는 요청을 보냄
      const res = await axios.post(
        `${BASE_API_URI}/reviews`,
        {
          stars: selectedStars,
          studentName: user.name,
          writeDate: today,
          roomName: selectedRoom.name, // 선택된 방의 이름 전달
          teacherId: selectedHostId, // 선택된 호스트의 이름 전달
          teacherName: selectedHost, // 선택된 호스트의 이름 전달
          review: review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Review submitted:", res.data);
      console.log(selectedHostId);

      setSelectedStars(0);
      handleReviewModalClose();
      navigate("/MyCalendar");

      //후기 작성된 방 방목록에서 제거하기
      // 작성된 방 제거하기
      setParticipatedRooms((prevRooms) =>
        prevRooms.filter((room) => room.name !== selectedRoom.name)
      );
      setRoomListModal((prevRooms) =>
        prevRooms.filter((room) => room.id !== selectedRoom.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  //강사 모집
  const ThandleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      // 별점과 사용자 ID를 DB에 저장하는 요청을 보냄
      const res = await axios.post(
        `${BASE_API_URI}/Treviews`,
        {
          //stars: [TselectedStars[0], TselectedStars[1]],
          stars: TselectedStars,
          studentName: user.name,
          writeDate: today,
          roomName: TselectedRoom.name, // 선택된 방의 이름 전달
          teacherId: TselectedApplicantId, // 선택된 호스트의 이름 전달
          teacherName: TselectedApplicant, // 선택된 호스트의 이름 전달
          review: review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Review submitted:", res.data);
      console.log(TselectedApplicantId);
    } catch (err) {
      console.error(err);
    }
  };

    return(
      
        <div className="mycalendar-container">
        
        <ReviewModal visible={visible} setVisible={setVisible} />
        <Header />
        <SideBar />
        <div className="reviewBtn" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}>
        <button
          className="starsub"
          type="submit"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          후기 작성
        </button>
      </div>
        
        
        <div className = "MyCalendar">
            <Calendar onClickDay={handleSelectDate} value={date}
                formatDay={(locale, date) => moment(date).format("DD")}
                tileContent={tileContent}
            />
            <Modal className='Modal' ariaHideApp={false} isOpen={addModalIsOpen} onRequestClose={handleAddModalClose} overlayClassName='Overlay'>
                <button type="submit" onClick={() => setAddModalIsOpen(false)} className='ModalButton'>X</button>
                <div className="addadd">
                    <DatePicker selected={date} onChange={handleDateChange} className="mmmdd"/>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className='writewrite'>
                    <label className='scheduleName'>
                        <div className='ttt'>제목</div>
                        <input type="text" placeholder='제목을 입력해주세요' className='writewrite3' value={title} onChange={handleTitleChange} />
                    </label>
                    <br/>
                    <label className='schedlueContents'>
                        <div className='tttt'>내용</div>
                        <input type="text" placeholder='내용을 입력해주세요' value={contents} className='writewrite2' onChange={handleContentsChange} />
                    </label>
                    <div> 
                    </div>
                    </div>
                </form>
            </Modal>
            
            <Modal className='Modal' ariaHideApp={false} isOpen={detailModalIsOpen} onRequestClose={() => setDetailModalIsOpen(false)} overlayClassName='Overlay'>
                <button type="button" onClick={() => {setSelectedSchedule(null); setDetailModalIsOpen(false);}} className='ModalButton'>X</button>
                {selectedSchedule ? (
                    <div className='writewrite'>

                        <button type="button" className="addadd2" onClick={() => {
                            setSelectedSchedule(null);
                            setDetailModalIsOpen(false);
                            setAddModalIsOpen(true);
                        }} ><FcPlus size="30px"/></button>
                        <div className='ttt2'>{moment(selectedSchedule.date).format("YYYY-MM-DD")} </div>
                        <div className='ttt5'>제목</div>
                        <input className='writewrite4' type="text" value={selectedSchedule.title} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, title: e.target.value })} />
                        <div className='ttt4'>내용</div> 
                        <input className='writewrite5' type="text" value={selectedSchedule.contents} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, contents: e.target.value })} />
                        <div className='writewrite6'>
                            <button type="submit" onClick={handleModify} className='modify'>수정</button>
                            <button type="submit" onClick={handleDelete} className="delete">삭제</button>
                        

                        </div>
                    </div>
                ) : null} 
            </Modal>
        </div>
        </div>
    )
}

export default MyCalendar;
