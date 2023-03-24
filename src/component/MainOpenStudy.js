import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import mainStyles from  "./MainOpenStudy.module.css";
import "./InfiniteScroll.css";
import OpenStudyModal from "./OpenStudyModal";
import OpenStudyRoomCard from "./OpenStudyRoomCard";

import loadingImg from "../images/loadingImg.gif";

function MainOpenStudy() {
    const [studyModal, setStudyModal] = useState(false);

    const [totalOpenStudies, setTotalOpenStudies] = useState([]);
    const [openStudies, setOpenStudies] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const loaderImg = () => {
        return(
            <div className={mainStyles.loadingPackage}>
                <img className={mainStyles.loadingImg} src={loadingImg} alt="loadingImg" />
                <div className={mainStyles.loading}>loading...</div>
            </div>
        );
    }

    const addModal = (img, title, tags, personNum) => {
        const newOpenStudies = [...openStudies, {img, title, tags, personNum}]
        setOpenStudies(newOpenStudies);
    }

    const moreOpenStudies = () => {
        console.log('데이터를 불러옵니다');
      
        axios
          .get(`http://localhost:8080/openStudies?page=${page}&limit=12`)
          .then((response) => {
            const newOpenStudies = response.data.openStudies;
            const isLastPage = newOpenStudies.length < 12;
      
            if (isLastPage) {
              setHasMore(false);
            }
            
      
            const prevOpenStudies = [...openStudies];
            console.log('Page: ', page);
            setOpenStudies(prevOpenStudies => [...prevOpenStudies, ...newOpenStudies]);
            console.log('Number of loaded studies: ' + (prevOpenStudies.length + newOpenStudies.length));
            setPage(prevPage => prevPage + 1);
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
          });
      };
      
      useEffect(() => {
        moreOpenStudies();
      }, []);


    /* useEffect(() => {
        axios
        .get("http://localhost:8080/openStudies")
        .then((response) => {
            //console.log(response.data.message);
            if (response.status === 200) {
                setOpenStudies([...response.data.openStudies]);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }); */


    return(
        <>
        {
                <OpenStudyModal
                  studyModal={studyModal}
                  setStudyModal={setStudyModal}
                  addModalHandler = {addModal}
                />
            
        }
             <div className={mainStyles.body}>
                <div className={mainStyles.menu}>
                    <div className={mainStyles.select}>
                        <Link to="/"><button className={mainStyles.openStudy}>오픈스터디</button></Link>
                        <Link to="/study"><button className={mainStyles.study}>스터디</button></Link>
                        <Link to="/question"><button className={mainStyles.question}>질문</button></Link>
                    </div>

                    <form className={mainStyles.search}>
                        <select>
                            <option>제목</option>
                            <option>태그</option>
                            <option>작성자</option>
                        </select>
                        <input />
                        <button>검색</button>
                    </form>
                    <button onClick={() => {setStudyModal(!studyModal)}}>만들기</button>
                </div>

        
                <h1>Open Study</h1>


                <InfiniteScroll
                    dataLength = {openStudies.length}
                    next = {moreOpenStudies}
                    hasMore = {hasMore}
                    loader = {loaderImg()}
                >
                    { openStudies && openStudies.map((data, index) => {
                        return (
                            <OpenStudyRoomCard 
                                img={data.img}
                                title={data.title} 
                                personNum={data.personNum} 
                                tags={Array.isArray(data.tags) ? [...data.tags] : []} 
                                id={data.id}
                                key={data.id}
                            />
                        );
                    })}
                </InfiniteScroll>
            </div>
        </>
    );
} 

export default MainOpenStudy;