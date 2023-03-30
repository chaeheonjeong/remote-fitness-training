import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import styles from  "./MainStudy.module.css";
import "./InfiniteScroll.css";
import StudyRoomCard from "./StudyRoomCard";

import loadingImg from "../images/loadingImg.gif";
import axios from "axios";

function MainStudy() {
    const [studyTitle, setStudyTitle] = useState('');

    const [studies, setStudies] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [searchInput, setSearchInput] = useState('');


    //const [cards, setCards] = useState(Array.from({length: 6}))
/*     const fetchData = () => {
        setTimeout(() => {
            setCards(cards.concat(Array.from({ length: 12 })))
        }, 1500);
    };

    function studyCard() {
        <StudyRoomCard
            title = {studyTitle}
        />
    } */

  /*   function studyPack() {
        return (
            

            Array.from({length: 50}, (v, i) => (
                (i%3 === 0) ? (
                    <>
                        <div className={styles.block}></div>
                        <StudyRoomCard
                            key = {i}
                            title = {studyTitle}
                        />
                        <div className={styles.blank} />
                    </>
                ) : (
                    (i%3 === 2) ? (
                        <>
                            <StudyRoomCard
                                key = {i}
                                title = {studyTitle}
                            />
                        </>
                    ) : (
                        <>
                            <StudyRoomCard
                                key = {i}
                                title = {studyTitle}
                            />
                            <div className={styles.blank} />
                        </>
                    )
                )
            ))
        );
    } */

    function loaderImg() {
        return(
             <div className={styles.loadingPackage}>
                <img className={styles.loadingImg} src={loadingImg} alt="loadingImg"></img>
                <div className={styles.loading}>loading...</div>
            </div>
        );
    }

    /* function studyScroll() {
        return(
            <>
                <InfiniteScroll
                    dataLength = {cards.length}
                    next = {fetchData}
                    hasMore = {true}
                    loader = {loaderImg()}
                >
                    {studyPack()}
                </InfiniteScroll>
            </>
        );
    } */

    const moreStudies = () => {
        console.log('데이터를 불러옵니다');

        axios 
            .get(`http://localhost:8080/studies?page=${page}&limit=12`)
            .then((response) => {
                const newStudies = response.data.studies;
                const isLastPage = newStudies.length < 12;

                if(isLastPage) {
                    setHasMore(false);
                }

                const prevStudies = [...studies];
                console.log('Page: ', page);
                setStudies(prevStudies => [...prevStudies, ...newStudies]);
                console.log('Number of loaded studies: ' + (prevStudies.length + newStudies.length));
                setPage(prevPage => prevPage + 1);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        moreStudies();
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
                        <button className={styles.makeBtn}>만들기</button>
                    </div>
                </div>
                    
                <h1>Study</h1>
                
                <InfiniteScroll
                    dataLength = {studies.length}
                    next = {moreStudies}
                    hasMore = {hasMore}
                    loader = {loaderImg()}
                >
                    { studies && studies.map((data, index) => {
                        return (
                            <StudyRoomCard 
                                title={data.title}
                                tags={Array.isArray(data.tag) ? [...data.tag] : []} 
                                id={data._id}
                                key={data._id}
                            />
                        );
                    })}
                </InfiniteScroll>
            </div> 
        </>

    );
} export default MainStudy;