import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import mainStyles from  "./MainOpenStudy.module.css";
import cardStyles from  "./OpenStudyRoomCard.module.css";
import OpenStudyModal from "./OpenStudyModal";
import OpenStudyRoomCard from "./OpenStudyRoomCard";

function MainOpenStudy() {
    const [studyModal, setStudyModal] = useState(false);
    const [addRoom, setAddRoom] = useState(false);
    const [openStudyTitle, setOpenStudyTitle] = useState('');
    const [participants, setParticipants] = useState(1);
    const [total, setTotal] = useState('0');

    const [room, setRoom] = useState({
        id: 0,
        title: "",
        totalPeople: "",
        partPeople: 0,
    });

     /*const [newRoom, setNewRoom] = useState({
        title: openStudyTitle,
        totalPeople: total,
        partPeople: participants,
    });

    const [room, setRoom] = useState('');
    const [roomList, setRoomList] = useState([]);
 
    

    //const [openRooms, setRooms] = useState([]);
    const [id, setId] = useState(0);
    const[openRooms, setOpenRooms] = useState({
        id: id,
        title: openStudyTitle,
        totalPeople: total,
        partPeople: participants,
    });
    

    

    useEffect(() => {
        localStorage.setItem('openRooms', JSON.stringify(openRooms));
        localStorage.setItem('id', id);
    }, [openRooms, id]);

   useEffect(() => {
        const openRoomList = localStorage.getItem('openRooms');
        console.log(openRoomList, JSON.parse(openRoomList));
        if(openRoomList) {
            setOpenRooms(JSON.parse(openRoomList));
        }
        const roomId = localStorage.getItem('id');
        if(roomId) {
            setId(parseInt(roomId));
        }
    }, []);*/

    const [ref, visible] = useInView()

    /*function roomPackage() {
        return (
            <>
            {
                Array.from(Array(100), item=>
                    
                )
            }
            </>
        );
    }*/

    /*function roomPack() {
        Array.from({length: 50}, (v, i) => {
            <OpenStudyRoomCard
                keyNum = {i}
                title = {openStudyTitle}
                total = {total}
                participants = {participants}
            />
            if(i%4===0) {
                <br />
            }
        });
    }*/

    function roomPack() {
        return(
            Array.from({length: 50}, (v, i) => (
                (i%4 === 0) ? (
                    <>
                        <div className={mainStyles.openStudyBlock}></div>
                        <OpenStudyRoomCard
                            keyNum = {i}
                            title = {openStudyTitle}
                            total = {total}
                            participants = {participants}
                        />  
                        <div className={mainStyles.openStudyBlank} />
                    </>
                ) : (
                    (i%4 === 3) ? (
                        <>
                            <OpenStudyRoomCard
                                keyNum = {i}
                                title = {openStudyTitle}
                                total = {total}
                                participants = {participants}
                            />
                        </> 
                    ) : (
                        <>
                            <OpenStudyRoomCard
                                keyNum = {i}
                                title = {openStudyTitle}
                                total = {total}
                                participants = {participants}
                            />
                            <div className={mainStyles.openStudyBlank} />
                        </>  
                    )  
                )      
            ))
        );
    }



    const viewStudyModal = () => {
        setStudyModal(studyModal => !studyModal);
    };

    return(
        <>
            <div id={mainStyles.body}>
                <div id={mainStyles.menu}>
                    <div id={mainStyles.select}>
                        <Link to="/"><button id={mainStyles.openStudy}>오픈스터디</button></Link>
                        <Link to="/study"><button id={mainStyles.study}>스터디</button></Link>
                        <Link to="/question"><button id={mainStyles.question}>질문</button></Link>
                    </div>

                    <form id={mainStyles.search}>
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
                { 
                    /*addRoom ? (
                        <>
                            <OpenStudyRoomCard 
                                title = {openStudyTitle}
                                total = {total}
                                participants = {participants}
                            />
                        </>
                    ) : null*/
                }
                <div className={cardStyles.container}>
                    {addRoom ? roomPack() : null}
                </div>
            </div>

            <OpenStudyModal
                open = {studyModal}
                close = {viewStudyModal}
                makeRoom = {setAddRoom}
                title = {openStudyTitle}
                setTitle = {setOpenStudyTitle}
                total = {total}
                setTotal = {setTotal}
                participants = {participants}
                room = {room}
                setRoom = {setRoom}
            />
        </>
    );
} 

export default MainOpenStudy;