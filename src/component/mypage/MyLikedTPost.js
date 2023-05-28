import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

import SRecruitmentCard from "../main/SRecruitmentCard";
import "./MyLikedPost.css";
import styles from "./MyLikedTPost.module.css";
import SideBar from './SideBar';
import Header from "../main/Header";

import loadingImg from "../../images/loadingImg.gif";

function MyLikedTPost() {
    const navigate = useNavigate();

    const [likedPosts, setLikedPosts] = useState([]);
    const [likedPostIds, setLikedPostIds] = useState([]);

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

    const morePosts = async () => {
        const token = localStorage.getItem("token");

        axios
            .get(`http://localhost:8080/myLikedTPost?page=${page}&limit=6`,  {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            .then((response) => {
                    const newLikedPosts = response.data.likePosts;
                    console.log(newLikedPosts);
                    const isLastPage = newLikedPosts.length < 6;
        
                    if(isLastPage) {
                        setHasMore(false);
                    }
        
                    const prevLikedPosts = [...likedPosts];
                    console.log('Page: ', page);
                    setLikedPosts(prevLikedPosts => [...prevLikedPosts, ...newLikedPosts]);
                    console.log('Number of loaded LikedPosts: ' + (prevLikedPosts.length + newLikedPosts.length));
                    setPage(prevPage => prevPage + 1);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                })
    };

    useEffect(() => {
        morePosts();
    }, []);

    const clickHandler = (id) => {
        axios
          .post(
            `http://localhost:8080/View`,
            { id: id, postName: "srecruitment" } // 서버로 전달할 id
          )
          .then((response) => {
            navigate(`/tView/${id}`);
          })
          .catch((error) => {
            console.log(error);
          });
    };

    return(
        <div>
            <Header />
            <SideBar/>
            <div className="likedPost">
                <Link to="/myLikedPost"><button className={styles.likedStudy}>강사모집</button></Link>
                <Link to="/myLikedTPost"><button className={styles.likedSRecruitment}>학생모집</button></Link>
                <Link to="/myLikedQuestion"><button className={styles.likedQuestion}>질문글</button></Link>
                <InfiniteScroll
                    dataLength = {likedPosts.length}
                    next = { morePosts }
                    hasMore = {hasMore}
                    loader = {loaderImg()}
                >
                {
                likedPosts.length > 0 ? ( likedPosts.map((post, index) => {
                        return (
                            <SRecruitmentCard 
                                title={post.title}
                                tags={Array.isArray(post.tag) ? [...post.tag] : []} 
                                id={post._id}
                                key={post._id}
                                onClick={() => {
                                    clickHandler(post._id);
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

            {/* <div className="likedPost">
                <button><Link to="/myLikedPost">Study</Link></button>
                <button>Question</button>
                { likedPosts.length > 0 ? (likedPosts.map(post => {
                    console.log("post: "+ post);
                    return(
                        <StudyRoomCard 
                            title={post.title}
                            tags={Array.isArray(post.tag) ? [...post.tag] : []} 
                            id={post._id}
                            key={post._id}
                        />
                    );
                })
                ) : (<p>관심글이 아직 없습니다.</p>)}
            </div> */}
        </div>
    );
} export default MyLikedTPost;