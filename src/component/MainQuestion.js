import { Link } from "react-router-dom";
import { useState } from "react";

import "./InfiniteScroll.css";
import styles from  "./MainQuestion.module.css";
import cardStyles from  "./QuestionRoomCard.module.css";
import QuestionRoomCard from "./QuestionRoomCard";

import InfiniteScroll from "react-infinite-scroll-component";

import loadingImg from "../images/loadingImg.gif";

function MainQuestion() {
    const [questionTitle, setQuestionTitle] = useState('');

    const [cards, setCards] = useState(Array.from({length: 6}))
    const fetchData = () => {
        setTimeout(() => {
            setCards(cards.concat(Array.from({ length: 12 })))
        }, 1500);
    };
    
    function questionCard({ keyNum }) {
        <QuestionRoomCard

            title = {questionTitle}
        />
    }

    function questionPack() {
        return (
            /*Array.from({length: 50}, (v, i) => (
                (i%3 === 0) ? (
                    <>
                        <QuestionRoomCard
                            key = {i}
                            title = {openStudyTitle}
                            total = {total}
                            participants = {participants}
                        />
                    </>
                ) : (
                    <QuestionRoomCard
                        key = {i}
                        title = {openStudyTitle}
                        total = {total}
                        participants = {participants}
                    />
                )
            ))*/

            Array.from({length: 50}, (v, i) => (
                /*<div className="aRowOfCard">
                    <h3>br</h3>
                    {
                    Array.from({length: 3}, (v, j) => (
                        <QuestionRoomCard
                            key = {i}
                            title = {openStudyTitle}
                            total = {total}
                            participants = {participants}
                        />
                    ))
                    }
                </div>*/

                (i%3 === 0) ? (
                    <>
                        <div className={styles.block}></div>
                        <QuestionRoomCard
                            keyNum = {i}
                            title = {questionTitle}
                        />
                        <div className={styles.blank} />
                    </>
                ) : (
                    (i%3 === 2) ? (
                        <>
                            <QuestionRoomCard
                                keyNum = {i}
                                title = {questionTitle}
                            />
                        </>
                    ) : (
                        <>
                            <QuestionRoomCard
                                keyNum = {i}
                                title = {questionTitle}
                            />
                            <div className={styles.blank} />
                        </>
                    )
                )
            ))
        );
    }

    function loaderImg() {
        return(
            <div className={styles.loadingPackage}>
                <img className={styles.loadingImg} src={loadingImg} alt="loadingImg"></img>
                <div className={styles.loading}>loading...</div>
            </div>
        );
    }

    function questionScroll() {
        return(
            <>
                <InfiniteScroll
                    dataLength = {cards.length}
                    next = {fetchData}
                    hasMore = {true}
                    loader = {loaderImg()}
                >
                    {questionPack()}
                </InfiniteScroll>  
            </>
        );
    }

    return(
        <>
            <div id={styles.body}>
                <div id={styles.menu}>
                    <div id={styles.select}>
                        <Link to="/"><button id={styles.openStudy}>오픈스터디</button></Link>
                        <Link to="/study"><button id={styles.study}>스터디</button></Link>
                        <Link to="/question"><button id={styles.question}>질문</button></Link>
                    </div>

                    <form id={styles.search}>
                        <select>
                            <option>제목</option>
                            <option>태그</option>
                            <option>작성자</option>
                        </select>
                        <input />
                        <button>검색</button>
                    </form>
                    <button>글쓰기</button>
                </div>
                    
                <h1>Question</h1>
                <div className={cardStyles.container}>
                    {questionScroll()}
                </div>
            </div>

            
        </>



    );
} export default MainQuestion;