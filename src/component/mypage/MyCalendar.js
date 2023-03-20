import React, {useState} from 'react';
import Calendar from 'react-calendar';
import './MyCalendar.css';
import moment from 'moment';
import Modal from 'react-modal';
import axios from 'axios';

function MyCalendar() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pickDate, setPickDate] = useState(new Date());

    const handlePickDate = async (value) => {
        setPickDate(value);
        setModalIsOpen(true);
    };

    return(
        <div className = "MyCalendar">
            <Calendar onChange={handlePickDate} value={pickDate}
                formatDay={(locale, date) => moment(date).format("DD")} 
            />
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="Modal" overlayClassName="Overlay">
                <div className='AddModal'>
                <div className='scheduleName'>일정 제목<input className="input" placeholder="Please Enter Text" type="text"/></div>
                <div className='scheduleContent'>
                    일정 내용<input className='Content' placeholder='Please Enter here' type="text"/>
                </div>
                <button type="submit" className='add'>추가</button>
                <button onClick={()=> setModalIsOpen(false)} className="ModalButton">X</button>
                </div>
            </Modal>
        </div>
    )
}

export default MyCalendar;