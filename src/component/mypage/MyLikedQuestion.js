import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

import QuestionRoomCard from "../main/QuestionRoomCard";
import "./MyLikedQuestion.css";
import styles from "./MyLikedQuestion.module.css";
import SideBar from './SideBar';
import Header from "../main/Header";

import loadingImg from "../../images/loadingImg.gif";

function MyLikedQuestion() {
    const navigate = useNavigate();

    const [likedQuestions, setLikedQuestions] = useState([]);
    const [likedQuestionIds, setLikedQuestionIds] = useState([]);

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const loaderImg = () => {
        return(
            <div className={styles.loadingPackage}>
                <img className={styles.loadingImg} src={loadingImg} alt="loadingImg" />
                <div className={styles.loading}>loading...</div>
            </div>
        );
    }

    /* const moreQuestions = () => {
        
            
        //fetchLikedQuestions();
    }; */

    const moreQuestions = async () => {
        const token = localStorage.getItem("token");

        axios
            .get(`http://localhost:8080/myLikedQuestion?page=${page}&limit=6`,  {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            .then((response) => {
                    const newLikedQuestions = response.data.likeQuestions;
                    console.log(newLikedQuestions);
                    const isLastPage = newLikedQuestions.length < 6;
        
                    if(isLastPage) {
                        setHasMore(false);
                    }
        
                    /* console.log("글: " +  getQuestions.data.likedQuestions);
                    setLikedQuestions(getQuestions.data.likedQuestions); */
        
                    const prevLikedQuestions = [...likedQuestions];
                    console.log('Page: ', page);
                    setLikedQuestions(prevLikedQuestions => [...prevLikedQuestions, ...newLikedQuestions]);
                    console.log('Number of loaded LikedQuestions: ' + (prevLikedQuestions.length + newLikedQuestions.length));
                    setPage(prevPage => prevPage + 1);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                })

        //const getQuestions = await axios
            

        //try {
            /* if(Array.isArray(getQuestions.data.likedQuestions)) {
                setLikedQuestions(getQuestions.data.likedQuestions);
                console.log(getQuestions.data.likedQuestions);
                console.log('관심글을 불러왔습니다');
            } else {
                console.log('서버 응답이 올바르지 않습니다.');
            } */
            
        /* } catch (error) {
            console.log(error);
        } */
    };

    useEffect(() => {
        moreQuestions();
    }, []);

    const clickHandler = (id) => {
        axios
          .post(
            `http://localhost:8080/View`,
            { id: id, postName: "question" } // 서버로 전달할 id
          )
          .then((response) => {
            navigate(`/AskView/${id}`);
          })
          .catch((error) => {
            console.log(error);
          });
    };

    return(
        <div>
            <Header />
            <SideBar/>
            <div className="likedQuestion">
                <Link to="/myLikedPost"><button className={styles.likedStudy}>강사모집</button></Link>
                <Link to="/myLikedTPost"><button className={styles.likedSRecruitment}>학생모집</button></Link>
                <Link to="/myLikedQuestion"><button className={styles.likedQuestion}>질문글</button></Link>
                <InfiniteScroll
                    dataLength = {likedQuestions.length}
                    next = { moreQuestions }
                    hasMore = {hasMore}
                    loader = {loaderImg()}
                >
                {
                likedQuestions.length > 0 ? ( likedQuestions.map((Question, index) => {
                        return (
                            <QuestionRoomCard 
                                title={Question.title}
                                tags={Array.isArray(Question.tag) ? [...Question.tag] : []} 
                                id={Question._id}
                                key={Question._id}
                                onClick={() => {
                                    clickHandler(Question._id);
                                }}
                            />
                        );
                    })) : (<p>관심글이 아직 없습니다.</p>)
                }
                </InfiniteScroll>

                {/* { !hasMore && (
                        <div className={styles.noData}>
                        <a>✅ 모든 오픈스터디를 보여드렸습니다 ✅</a>
                    </div>
                )} */}
            </div>

            {/* <div className="likedQuestion">
                <button><Link to="/myLikedQuestion">Study</Link></button>
                <button>Question</button>
                { likedQuestions.length > 0 ? (likedQuestions.map(Question => {
                    console.log("Question: "+ Question);
                    return(
                        <StudyRoomCard 
                            title={Question.title}
                            tags={Array.isArray(Question.tag) ? [...Question.tag] : []} 
                            id={Question._id}
                            key={Question._id}
                        />
                    );
                })
                ) : (<p>관심글이 아직 없습니다.</p>)}
            </div> */}
        </div>
    );
} export default MyLikedQuestion;