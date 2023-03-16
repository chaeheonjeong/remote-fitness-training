import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

import styles from  "./OpenStudyModal.module.css";

function OpenStudyModal(
    { open, close, makeRoom, title, setTitle, total, setTotal, participants, room, setRoom }) {
    var numOfPeople = Array.from({length: 50}, (v, i) => i+1);

    //const [hashtag, setHashtag] = useState<string | ''>('');
    const [tags, setTags] = useState([]);

    const numOfPeopleOption = () => {
        const numArray = [];
        for(var i=1; i<=numOfPeople.length; i++) {
            numArray.push(<option key={i} value={i}>{i}</option>);     
        }
        return numArray;  
    };

    const changeTitle = (e) => {
        setTitle(e.target.value);
    }

    const makeOpenStudy = () => {
        alert("오픈스터디가 생성되었습니다.");
        close(false);
        makeRoom(true);
        /*setId(openRooms.length + 1);
        setNewRoom({title: title, total: total, participants: participants});
        setOpenRooms([...openRooms, newRoom]);
        localStorage.setItem('openRooms', JSON.stringify(openRooms));
        localStorage.setItem('openRooms', JSON.stringify([...openRooms, newRoom]));
        */

    };

    const decidePeople = (e) => {
        setTotal(e.currentTarget.value);
    };



    return(
        <div className = {open ? 'openStudyModal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        <a className={styles.modalTitle}>오픈 스터디 만들기</a>
                        <button className={styles.close} onClick={() => {close(false)}}>
                            &times;
                        </button>
                    </header>
                    <hr />
                    <div>
                    <div className={styles.under}>
                        <div className={styles.image}>오픈 스터디 사진</div>
                        <div>
                            <a>방 제목</a> 
                            <input
                                onChange = {changeTitle}
                                autoFocus
                            />
                        </div>
                        <div>
                            <a>태그</a> 
                            <textarea
                                className={styles.tagInput}
                                name="tag"
                                type="text"
                                placeholder="해시태그 입력(최대 5개)"
                            />
                        <div/>
                        <div>
                            <a>인원수</a>
                            <select onChange={decidePeople}>
                                {numOfPeopleOption()}
                            </select>
                        </div>
                    </div>
                    </div>
                    <footer>
                        <button 
                            className={styles.makeOpenStudy} 
                            onClick={() => makeOpenStudy()}
                        >
                            만들기
                        </button>
                        <button className={styles.openStudyCancle} onClick={() => {close(false)}}>
                            취소
                        </button>
                    </footer>
                    </div>
                </section>
            ) : null}
        </div>
    );
} 

OpenStudyModal.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    makeRoom: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    setTitle: PropTypes.func.isRequired,
    total: PropTypes.string.isRequired,
    setTotal: PropTypes.func.isRequired,
    participants: PropTypes.number.isRequired,
};

export default OpenStudyModal;