import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import "./InfiniteScroll.css";
import styles from  "./MainQuestion.module.css";
import QuestionRoomCard from "./QuestionRoomCard";

import loadingImg from "../../images/loadingImg.gif";
import axios from "axios";

function MainQuestion() {
    const [questionTitle, setQuestionTitle] = useState('');

    const [questions, setQuestions] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [selected, setSelected] = useState('title');
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [noResult, setNoResult] = useState(false);
    
    function loaderImg() {
        return(
             <div className={styles.loadingPackage}>
                <img className={styles.loadingImg} src={loadingImg} alt="loadingImg"></img>
                <div className={styles.loading}>loading...</div>
            </div>
        );
    }

    const changeSelectHandler = (event) => {
        setSelected(event.target.value);
    };

    const searchResult = () => {
        console.log('btn click!!!!!!!!');
        console.log(selected);

        setSearching(true);
        setNoResult(false);

        axios
            .get(`http://localhost:8080/searchQuestion?selected=${selected}&value=${encodeURIComponent(searchInput)}&page=${page}&limit=6`)
            .then((response) => {
                console.log('검색결과를 가져오겠습니다.');
                const newSearchQuestion = response.data.questions;
                const isLastPage = newSearchQuestion.length < 6;

                try {
                    if(isLastPage) {
                        setHasMore(false);
                    }

                    const prevSearchQuestion = [...questions];
                    setSearchResults(prevSearchQuestion => [...prevSearchQuestion, ...newSearchQuestion]);
                    setPage(prevSearchPage => prevSearchPage + 1);

                    console.log(response.data.questions.length);
                    if(response.data.questions.length === 0) {
                        setNoResult(true);
                    }
                } catch(error) {
                    console.log('검색결과: ', error);
                    setHasMore(false);
                    setIsLoading(false);
                } finally {
                }
            })
        
    };
    
    const searchHandler = (event) => {
        event.preventDefault();
        searchResult();
        setSearchResults([]);
    };

    useEffect(() => {
        setQuestions([]);
        setPage(1);
        setHasMore(true);
    }, [searchInput]);



    const moreQuestions = () => {
        console.log('데이터를 불러옵니다');

        axios 
            .get(`http://localhost:8080/questions?page=${page}&limit=6`)
            .then((response) => {
                const newQuestions = response.data.questions;
                const isLastPage = newQuestions.length < 6;

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

                    <div className={styles.searchAndMake} onSubmit={searchHandler}>
                        <form className={styles.search}>
                            <select onChange={changeSelectHandler}>
                                <option value="title">제목</option>
                                <option value="tags">태그</option>
                                <option value="writer">작성자</option>
                            </select>
                            <input className="searchInput" name="searchInput" onChange = { (e) => setSearchInput(e.target.value) }/>
                            <button type="submit">검색</button>
                        </form>
                        <button className={styles.makeBtn}>글쓰기</button>
                    </div>
                </div>
                    
                <h1>Question</h1>

                {searching && !noResult && (
                    <InfiniteScroll
                        dataLength = {questions.length}
                        next = { page !== 1 ? searchResult : null }
                        hasMore = {hasMore}
                        loader = {loaderImg()}
                    >
                    {
                        searchResults.map((data, index) => {
                            return (
                                <QuestionRoomCard 
                                    title={data.title}
                                    tags={Array.isArray(data.tag) ? [...data.tag] : []} 
                                    id={data._id}
                                    key={data._id}
                                />
                            );
                        })
                    }
                    </InfiniteScroll>
                )}

                {
                    noResult ? (
                        <div className={styles.noResult}>
                            <a>⚠️ 검색결과가 없습니다 ⚠️{noResult}</a>
                        </div>
                    ) : null
                }
                
                {!searching && (
                    <InfiniteScroll
                        dataLength = {questions.length}
                        next = { page !== 1 ? moreQuestions : null }
                        hasMore = {hasMore}
                        loader = {loaderImg()}
                    >
                        { questions && questions.map((data, index) => {
                            return (
                                <QuestionRoomCard 
                                    title={data.title}
                                    tags={Array.isArray(data.tag) ? [...data.tag] : []} 
                                    id={data._id}
                                    key={data._id}
                                />
                            );
                        })}
                    </InfiniteScroll>
                )}
                { !hasMore && !noResult && (
                        <div className={styles.noData}>
                        <a>✅ 모든 오픈스터디를 보여드렸습니다 ✅</a>
                    </div>
                )}
            </div> 
        </>
    );
} export default MainQuestion;