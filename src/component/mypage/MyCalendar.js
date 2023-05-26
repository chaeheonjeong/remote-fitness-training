import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import './MyCalendar.css';
import moment from 'moment';
import Modal from 'react-modal';
import axios from 'axios';
import SideBar from './SideBar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../main/Header";

function MyCalendar() {
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
    const navigate = useNavigate();

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

    const handleScheduleClick = (roomSchedule) => {

        const {startTime, runningTime, date} = roomSchedule;
        const scheduleStartTime = new Date(`${date} ${startTime}`);
        const scheduleEndTime = new Date(scheduleStartTime.getTime() + runningTime * 60000);

        console.log(scheduleStartTime);
        console.log(scheduleEndTime);
        
        const currentDateTime = new Date();
        const currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());

        if(currentDateTime < scheduleStartTime){
            window.alert('입장 시간이 아직 되지 않았습니다.');
        }else if(currentDateTime > scheduleEndTime){
            window.alert('입장 시간이 초과되었습니다.');
        }else if(currentDate.getTime() > scheduleStartTime.getTime()){
            window.alert('이미 지난 방 일정입니다.');
        }else{
            navigate('/');
        }
    }

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
                    {filteredRoomSchedules.map((roomSchedule) => {
                        return roomSchedule.userType === 'Student' && roomSchedule.prepaymentBtn === true ? (
                            <div className='showRoomSchedule' 
                                key={roomSchedule.roomTitle}
                                onClick={() => {handleScheduleClick(roomSchedule); setAddModalIsOpen(false);}}>
                                    {roomSchedule.roomTitle}
                            </div>
                        ):null
                    })}
                </div>
                <div>
                    {filteredRoomSchedules.map((roomSchedule) => {
                        return roomSchedule.userType === 'Teacher' ? (
                            <div className='showRoomSchedule' 
                                key={roomSchedule.roomTitle} 
                                onClick={() => {handleScheduleClick(roomSchedule); setAddModalIsOpen(false)}}>
                                    {roomSchedule.roomTitle}
                            </div>
                        ):null
                    })}
                </div>
            </div> 
        );
    };



    return(
        <div>
        <Header />
        <SideBar/>
        <div className='reviewBtn'>
            <button type="submit" onClick={() => setReviewModalIsOpen(true)}>후기 작성</button>
            <Modal className='Modal' ariaHideApp={false} isOpen={reviewModalIsOpen} onRequestClose={() => setReviewModalIsOpen(false)} overlayClassName='Overlay'>
            <button type="submit" onClick={() => setReviewModalIsOpen(false)} className='ModalButton'>X</button>
            <h2>
                후기 작성
            </h2>
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