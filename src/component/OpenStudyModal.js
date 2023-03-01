import { useState } from "react";
import PropTypes from "prop-types";

import "./OpenStudyModal.css";
import MainOpenStudy from "./MainOpenStudy";


function OpenStudyModal({ open, close, makeRoom, setTitle, setTotal }) {
    var numOfPeople = Array.from({length: 50}, (v, i) => i+1);

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
        makeRoom(true);
        close(false);
    };

    const decidePeople = (e) => {
        setTotal(e.currentTarget.value);
    };

    return(
        <div className = {open ? 'openStudyModal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        <a className="modalTitle">오픈 스터디 만들기</a>
                        <button className="close" onClick={() => {close(false)}}>
                            &times;
                        </button>
                    </header>
                    <hr />
                    <div>
                    <div className="under">
                        <div className="image">오픈 스터디 사진</div>
                        <a>방 제목</a> 
                        <input
                            //value = {title}
                            onChange = {changeTitle}
                        /><br />
                        <a>태그</a> <input /><br />
                        <a>인원수</a>
                        <select onChange={decidePeople}>
                            {numOfPeopleOption()}
                        </select>
                    </div>
                    <footer>
                        <button 
                            className="makeOpenStudy" 
                            onClick={() => makeOpenStudy()}
                        >
                            만들기
                        </button>
                        <button className="openStudyCancle" onClick={() => {close(false)}}>
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
    //title: PropTypes.string.isRequired,
    setTitle: PropTypes.func.isRequired,
    setTotal: PropTypes.func.isRequired,
};

export default OpenStudyModal;