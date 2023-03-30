import React, {useState, useEffect} from 'react';
import Calendar from 'react-calendar';
import './MyCalendar.css';
import moment from 'moment';
import Modal from 'react-modal';
import axios from 'axios';
import SideBar from './SideBar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MyCalendar() {
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [listModalIsOpen, setListModalIsOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const token = localStorage.getItem('token');

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
        setListModalIsOpen(true);
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

        if(filteredSchedules.length > 0){
            setSelectedSchedule(filteredSchedules[0]);
            setListModalIsOpen(true);
        }else{
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
                setListModalIsOpen(false);
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
            console.log('Success: ', res.data);
            setSchedules([...schedules, {title, date, contents}]);
            handleAddModalClose();
        }catch(err){
            console.error(err);
        }
           
    };

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

        return(
            <ul className="showSchedule">
                {filteredSchedules.map((schedule) => (
                    <li key={schedule.title} onClick={() => handleSelectSchedule(schedule)}>
                        {schedule.title}
                    </li>
                ))}
            </ul>
        );
    };



    return(
        <div>
        <SideBar/>
        <div className = "MyCalendar">
            <Calendar onClickDay={handleSelectDate} value={date}
                formatDay={(locale, date) => moment(date).format("DD")}
                tileContent={tileContent} 
            />
            <Modal className='Modal' isOpen={addModalIsOpen} onRequestClose={handleAddModalClose} overlayClassName='Overlay'>
                <button type="submit" className='ModalButton'>X</button>
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
            
            <Modal className='Modal' isOpen={listModalIsOpen} onRequestClose={() => setListModalIsOpen(false)} overlayClassName='Overlay'>
                <button type="submit" onClick={() => setSelectedSchedule(null)} className='ModalButton'>X</button>
                {selectedSchedule ? (
                    <div>
                        <p> 날짜 : {moment(selectedSchedule.date).format("YYYY-MM-DD")} </p>
                        <p className='scheduleName'>제목 : <input className='input' type="text" value={selectedSchedule.title} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, title: e.target.value })} /></p>
                        <p className='schedlueContents'>내용 : <input className='Contents' type="text" value={selectedSchedule.contents} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, contents: e.target.value })} /></p>
                        <button type="submit" onClick={handleModify} className='modify'>수정</button>
                    </div>
                ) : null}
            </Modal>
        </div>
        </div>
    )
}

export default MyCalendar;