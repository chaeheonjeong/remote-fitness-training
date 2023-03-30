import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import "./InfiniteScroll.css";
import styles from  "./MainQuestion.module.css";
//import cardStyles from  "./QuestionRoomCard.module.css";
import QuestionRoomCard from "./QuestionRoomCard";

import loadingImg from "../images/loadingImg.gif";
import axios from "axios";

function MainQuestion() {
    const [questionTitle, setQuestionTitle] = useState('');

    const [questions, setQuestions] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [searchInput, setSearchInput] = useState('');
    
    function loaderImg() {
        return(
             <div className={styles.loadingPackage}>
                <img className={styles.loadingImg} src={loadingImg} alt="loadingImg"></img>
                <div className={styles.loading}>loading...</div>
            </div>
        );
    }

    const moreQuestions = () => {
        console.log('데이터를 불러옵니다');

        axios 
            .get(`http://localhost:8080/questions?page=${page}&limit=12`)
            .then((response) => {
                const newQuestions = response.data.questions;
                const isLastPage = newQuestions.length < 12;

                if(isLastPage) {
                    setHasMore(false);
                }

                const prevStudies = [...questions];
                console.log('Page: ', page);
                setQuestions(prevStudies => [...prevStudies, ...newQuestions]);
                console.log('Number of loaded studies: ' + (prevStudies.length + newQuestions.length));
                setPage(prevPage => prevPage + 1);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        moreQuestions();
    }, []);

    return(
        <>
            <div className={styles.body}>
                <div className={styles.menu}>
                    <div className={styles.select}>
                        <Link to="/"><button className={styles.openStudy}>오픈스터디</button></Link>
                        <Link to="/study"><button className={styles.study}>스터디</button></Link>
                        <Link to="/question"><button className={styles.question}>질문</button></Link>
                    </div>

                    <div className={styles.searchAndMake}>
                        <form className={styles.search}>
                            <select>
                                <option value="title">제목</option>
                                <option value="tags">태그</option>
                                <option value="writer">작성자</option>
                            </select>
                            <input className="searchInput" name="searchInput" onChange = { (e) => setSearchInput(e.target.value) }/>
                            <button>검색</button>
                        </form>
                        <button className={styles.makeBtn}>글쓰기</button>
                    </div>
                </div>
                    
                <h1>Question</h1>
                
                <InfiniteScroll
                    dataLength = {questions.length}
                    next = {moreQuestions}
                    hasMore = {hasMore}
                    loader = {loaderImg()}
                >
                    { questions && questions.map((data, index) => {
                        return (
                            <QuestionRoomCard 
                                title={data.title}
                                //tags={Array.isArray(data.tag) ? [...data.tag] : []} 
                                id={data._id}
                                key={data._id}
                            />
                        );
                    })}
                </InfiniteScroll>
            </div> 
        </>
    );
} export default MainQuestion;