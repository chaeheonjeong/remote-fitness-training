import { Link } from "react-router-dom";
import { useState } from "react";

import OpenStudyModal from "./OpenStudyModal";
import "./MainOpenStudy.css";

import emptyHeart from "../images/emptyHeart.png";
import fullHeart from "../images/heart.png";

function MainOpenStudy() {
    const tag = "태그";

    const [heart, setHeart] = useState(false);
    const [studyModal, setStudyModal] = useState(false);
    const [addRoom, setAddRoom] = useState(false);
    const [openStudyTitle, setOpenStudyTitle] = useState('');
    const [participants, setParticipants] = useState(1);
    const [total, setTotal] = useState(0);

    const changeHeart = () => {
        setHeart(heart => !heart);
    };

    const viewStudyModal = () => {
        setStudyModal(studyModal => !studyModal);
    };

    function heartBtn() {
        if(!heart) {
            return <img id="heart" src={emptyHeart} alt="emptyHeart" onClick={() => changeHeart()}></img>;
        }
        else {
            return <img id="heart" src={fullHeart} alt="fullHeart" onClick={() => changeHeart()}></img>;
        }
    };

    function newRoom() {
        if(addRoom) {
            return (
                <div className="openStudyBox">
                    {heartBtn()}
                    <a className="participants">{participants}/{total}</a>

                    <div className="openStudyImg">스터디 사진</div>
                    <h3 className="roomTitle">{openStudyTitle}</h3>
                    <a className="openStudyTag">#{tag}</a>
                </div>
            );
        }
    }

    return(
        <>
            <div id="body">
                <div id="menu">
                    <div id="select">
                        <Link to="/"><button id="openStudy">오픈스터디</button></Link>
                        <Link to="/study"><button id="study">스터디</button></Link>
                        <Link to="/question"><button id="question">질문</button></Link>
                    </div>

                    <form id="search">
                        <select>
                            <option>제목</option>
                            <option>태그</option>
                            <option>작성자</option>
                        </select>
                        <input />
                        <button>검색</button>
                    </form>
                <button onClick={() => viewStudyModal()}>만들기</button>
                </div>
                
                
                <h2>Open Study</h2>
                { newRoom() }
                <div>

                </div>
            </div>

            <OpenStudyModal
                open = {studyModal}
                close = {viewStudyModal}
                makeRoom = {setAddRoom}
                title = {openStudyTitle}
                setTitle = {setOpenStudyTitle}
                setTotal = {setTotal}
            />
        </>
    );
} 

export default MainOpenStudy;