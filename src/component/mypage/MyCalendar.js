import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import './MyCalendar.css';
import moment from 'moment';
import axios from "axios";
//import styles from "./SelectModal.module.css";
import usePost from "../../hooks/usePost";
import Modal from 'react-modal';
import userStore from "../../store/user.store";
import SideBar from './SideBar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../main/Header";
import useNoti from "../../hooks/useNoti";
//import ReviewList from './ReviewList'; // 수정: 후기 목록 컴포넌트 추가
//import ReviewModal from './ReviewModal'; // 수정: 후기 모달 컴포넌트 추가

function MyCalendar() {
    const { id } = useParams();
    const user = userStore();
    const navigate = useNavigate();

    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const token = localStorage.getItem('token');
    const [scheduleList, setScheduleList] = useState([]);
    const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);
    const [roomSchedules, setRoomSchedules] = useState([]);
    const [notiData, setNotiData] = useState([]);
    const hook = useNoti();


    const [selectedRoom, setSelectedRoom] = useState(null); // 선택한 방
    const [roomList, setRoomList] = useState([]); // 방 목록
    const [selectedStars, setSelectedStars] = useState(0); // 추가: 선택한 별점

    useEffect(() =>{
        const fetchRoomSchedules = async () => {
            try{
                const res = await axios.get("http://localhost:8080/roomSchedules",{
                    headers : {Authorization: `Bearer ${token}`}
                });
                setRoomSchedules(res.data);
                console.log(res.data);
            }catch(err){
                console.error(err);
            }
        }
        fetchRoomSchedules();
    }, []);

    useEffect(() => {
        const fetchSchedules = async () => {
            try{
                const res = await axios.get("http://localhost:8080/schedules",{
                    headers : {Authorization: `Bearer ${token}`}
                });
                setSchedules(res.data);
                console.log(res.data);
            }catch(err){
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
    }

    const handleSelectDate = (date) => {
        const filteredSchedules = schedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.date);
            return(
                scheduleDate.getDate() === date.getDate() &&
                scheduleDate.getMonth() === date.getMonth() &&
                scheduleDate.getFullYear() === date.getFullYear()
            );
        });

        if(filteredSchedules.length === 1){
            setSelectedSchedule(filteredSchedules[0]);
            setDetailModalIsOpen(true);
        }
        else if(filteredSchedules.length > 1){
            setScheduleList(filteredSchedules);
            setDetailModalIsOpen(true);
        }
        else{
            setDate(date);
            setAddModalIsOpen(true);
        }
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
    }

    const handleDelete = () => {
        if(selectedSchedule){
        axios.delete(`http://localhost:8080/schedules/${selectedSchedule._id}`)
            .then((res) => {
                console.log('delete success: ', res.data);
                console.log(schedules);
                const updatedSchedules = schedules.filter(schedule => schedule._id !== selectedSchedule._id);
                setSchedules(updatedSchedules);
                setSelectedSchedule(null);
                setDetailModalIsOpen(false);
            })
            .catch(err => {
                console.error(err);
            });
        }
    };

    const handleModify = () => {
        axios.put(`http://localhost:8080/schedules/${selectedSchedule._id}`, selectedSchedule)
            .then(res => {
                console.log('update success: ', res.data);
                const updatedScheudles = schedules.map(schedule => {
                    if(schedule._id === selectedSchedule._id){
                        return selectedSchedule;
                    }else{
                        return schedule;
                    }
                });
                setSchedules(updatedScheudles);
                setSelectedSchedule(null);
                setDetailModalIsOpen(false);
            })
            .catch(err => {
                console.error(err);
            });    
    }

    const handleFormSubmit = async (e) => {
        try{
            e.preventDefault();
            const res = await axios.post("http://localhost:8080/schedules",{
                title : title,
                date : date,
                contents : contents
            },{
                headers : {Authorization: `Bearer ${token}`}
            });
            const newSchedule = {
                _id : res.data._id,
                title : title,
                contents : contents,
                date : date
            }
            console.log('Success: ', res.data);
            setSelectedSchedule(newSchedule);
            setSchedules([...schedules, newSchedule]);
            handleAddModalClose();
        }catch(err){
            console.error(err);
        }
           
    };

    const formatDate = (today) => {
        const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const dateW = today.getDate();
        const dayOfWeek = daysOfWeek[today.getDay()];
        const formattedDate = `${year}.${month}.${dateW}(${dayOfWeek})`;
        
        return formattedDate;
    };

    const today = new Date();

    const tileContent = ({date,view}) => {
        const filteredSchedules = schedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.date);
            return(
                scheduleDate.getDate() === date.getDate() &&
                scheduleDate.getMonth() === date.getMonth() &&
                scheduleDate.getFullYear() === date.getFullYear() &&
                (view === 'month' || (view === 'week' && scheduleDate.getDay() === date.getDay()))
            );
        });

        const filteredRoomSchedules = roomSchedules.filter((roomSchedule) => {
            const roomScheduleDate = new Date(roomSchedule.date);
            return(
                roomScheduleDate.getDate() === date.getDate() &&
                roomScheduleDate.getMonth() === date.getMonth() &&
                roomScheduleDate.getFullYear() === date.getFullYear() &&
                (view === 'month' || (view === 'week' && roomScheduleDate.getDay() === date.getDay()))
            );
        })

        return(
            <div>
                <div>
                    {filteredSchedules.map((schedule) => (
                        <div className='showSchedule' key={schedule.title} onClick={() => handleSelectSchedule(schedule)}> 
                            {schedule.title}
                        </div>
                    ))}
                </div>
                <div>
                    {filteredRoomSchedules.map((roomSchedule) => (
                        hook.rendData !== null ? (
                            hook.rendData.map((x, i) => {
                                return x.prepaymentBtn === true && roomSchedule.userType === 'Student' ? (
                                    <div className='showRoomSchedule' key={roomSchedule.roomTitle}>
                                        {roomSchedule.roomTitle}
                                    </div>
                                ) : null
                            })
                        ) : null
                    ))}
                </div>
                <div>
                    {filteredRoomSchedules.map((roomSchedule) => {
                        return roomSchedule.userType === 'Teacher' ? (
                            <div className='showRoomSchedule' key={roomSchedule.roomTitle}>
                                    {roomSchedule.roomTitle}
                            </div>
                        ):null
                    })}
                </div>
            </div> 
        );
    };

    //////후기 작성 구현

    // 후기 작성 모달 내에서 방 목록을 관리할 상태 추가
    const [roomListModal, setRoomListModal] = useState([]);


    // 방 선택 시 후기 작성 모달 열기
    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        setReviewModalIsOpen(true);
    };

    // 방 목록 가져오기
    const fetchRoomList = async () => {
        try {
          const response = await axios.get('http://localhost:8080/rooms');
          const rooms = response.data.map((room, index) => ({
            id: index, // 간단하게 인덱스를 사용하여 id 설정
            name: room,
            description: "", // 빈 설명 추가
          }));
          setRoomListModal(rooms);
        } catch (error) {
          console.error(error);
        }
      };
    
    useEffect(() => {
        fetchRoomList();
    }, []);
    
  
    


    //////// 별점 기능
    const handleReviewModalClose = () => {
        setSelectedRoom(null);
        setReviewModalIsOpen(false);
        setSelectedStars(0); // 추가: 별점 선택 초기화
      };

      const handleReviewModalOpen = () => {
        setReviewModalIsOpen(true);
        fetchRoomList(); // 방 목록 가져오기
        
      };
      const handleStarClick = (stars) => {
        setSelectedStars(stars);
      };
    
      const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
          // 별점과 사용자 ID를 DB에 저장하는 요청을 보냄
          const res = await axios.post("http://localhost:8080/reviews", {
            stars: selectedStars,
            swriter: user.name,
            swriteDate: today,
            roomName: selectedRoom.name, // 선택된 방의 이름 전달
        },{
            headers : {Authorization: `Bearer ${token}`}
        });

          console.log('Review submitted:', res.data);

          setSelectedStars(0);
          handleReviewModalClose();
          navigate("/MyCalendar");
        } catch (err) {
          console.error(err);
        }
      };

      



    return(
        <div>
    <Header />
    <SideBar />
    <div className="reviewBtn">
      <button
        className="starsub"
        type="submit"
        onClick={handleReviewModalOpen}
      >
        후기 작성
      </button>
      <Modal
        className="Modal"
        ariaHideApp={false}
        isOpen={reviewModalIsOpen}
        onRequestClose={handleReviewModalClose}
        overlayClassName="Overlay"
      >
        <h2 className='starwrite'>후기 작성</h2>
        <button
          type="submit"
          onClick={handleReviewModalClose}
          className="ModalButton"
        >
          X
        </button>
        
        {selectedRoom && (
        <div>
        <p>선택한 방: {selectedRoom.name}</p>
        {selectedStars >= 0 && <p>선택한 별점: {selectedStars}</p>}
        <div className="starContainer">
            {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((star) => (
            <span
                key={star}
                className={selectedStars >= star ? 'selected' : ''}
                onClick={() => handleStarClick(star)}
                style={{ cursor: 'pointer' }}
            >
                {star}{' '}
            </span>
            ))}
        </div>
        <button type="submit" onClick={handleReviewSubmit}>
            등록
        </button>
        </div>
    )}
    {!selectedRoom && (
        <div className="roomListContainer">
        {roomListModal.length > 0 ? (
            <div>
            {roomListModal.map((room) => (
                <div
                key={room.id}
                className="roomItem"
                onClick={() => handleRoomSelect(room)}
                >
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                </div>
            ))}
            </div>
        ) : (
            <p>Loading...</p>
        )}
        </div>
    )}
    </Modal>
      </div>
        <div className = "MyCalendar">
            <Calendar onClickDay={handleSelectDate} value={date}
                formatDay={(locale, date) => moment(date).format("DD")}
                tileContent={tileContent} 
            />
            <Modal className='Modal' ariaHideApp={false} isOpen={addModalIsOpen} onRequestClose={handleAddModalClose} overlayClassName='Overlay'>
                <button type="submit" onClick={() => setAddModalIsOpen(false)} className='ModalButton'>X</button>
                <h2>
                    <DatePicker selected={date} onChange={handleDateChange} />
                </h2>
                <form onSubmit={handleFormSubmit}>
                    <label className='scheduleName'>
                        제목 :
                        <input className='input' type="text" placeholder='제목을 입력해주세요' value={title} onChange={handleTitleChange} />
                    </label>
                    <br/>
                    <label className='schedlueContents'>
                        내용 : 
                        <input className='Contents' type="text" placeholder='내용을 입력해주세요' value={contents} onChange={handleContentsChange} />
                    </label>
                    <div>
                        <button type="submit" className='add'>추가</button>
                    </div>
                </form>
            </Modal>
            
            <Modal className='Modal' ariaHideApp={false} isOpen={detailModalIsOpen} onRequestClose={() => setDetailModalIsOpen(false)} overlayClassName='Overlay'>
                <button type="button" onClick={() => {setSelectedSchedule(null); setDetailModalIsOpen(false);}} className='ModalButton'>X</button>
                {selectedSchedule ? (
                    <div>
                        <button type="button" onClick={() => {
                            setSelectedSchedule(null);
                            setDetailModalIsOpen(false);
                            setAddModalIsOpen(true);
                        }} className="addBtn">새 일정 추가</button>
                        <p> 날짜 : {moment(selectedSchedule.date).format("YYYY-MM-DD")} </p>
                        <p className='scheduleName'>제목 : <input className='input' type="text" value={selectedSchedule.title} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, title: e.target.value })} /></p>
                        <p className='schedlueContents'>내용 : <input className='Contents' type="text" value={selectedSchedule.contents} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, contents: e.target.value })} /></p>
                        <button type="submit" onClick={handleModify} className='modify'>수정</button>
                        <button type="submit" onClick={handleDelete} className="delete">삭제</button>
                    </div>
                ) : null} 
            </Modal>
        </div>
        </div>
    )
}

export default MyCalendar;