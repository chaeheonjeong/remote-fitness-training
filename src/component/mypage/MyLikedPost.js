import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import StudyRoomCard from "../main/StudyRoomCard";
import "./MyLikedPost.css";
import styles from "./MyLikedPost.module.css";
import SideBar from "./SideBar";
import Header from "../main/Header";

import loadingImg from "../../images/loadingImg.gif";
import { BASE_API_URI } from "../../util/common";

function MyLikedPost() {
  const [likedPosts, setLikedPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loaderImg = () => {
    return (
      <div className={styles.loadingPackage}>
        <img className={styles.loadingImg} src={loadingImg} alt="loadingImg" />
        <div className={styles.loading}>loading...</div>
      </div>
    );
  };

  /* const morePosts = () => {
        
            
        //fetchLikedPosts();
    }; */

  const morePosts = async () => {
    const token = localStorage.getItem("token");

    axios
      .get(`${BASE_API_URI}/myLikedPost?page=${page}&limit=6`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const newLikedPosts = response.data.likePosts;
        console.log(newLikedPosts);
        const isLastPage = newLikedPosts.length < 6;

        if (isLastPage) {
          setHasMore(false);
        }

        /* console.log("글: " +  getPosts.data.likedPosts);
                    setLikedPosts(getPosts.data.likedPosts); */

        const prevLikedPosts = [...likedPosts];
        console.log("Page: ", page);
        setLikedPosts((prevLikedPosts) => [
          ...prevLikedPosts,
          ...newLikedPosts,
        ]);
        console.log(
          "Number of loaded LikedPosts: " +
            (prevLikedPosts.length + newLikedPosts.length)
        );
        setPage((prevPage) => prevPage + 1);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });

    //const getPosts = await axios

    //try {
    /* if(Array.isArray(getPosts.data.likedPosts)) {
                setLikedPosts(getPosts.data.likedPosts);
                console.log(getPosts.data.likedPosts);
                console.log('관심글을 불러왔습니다');
            } else {
                console.log('서버 응답이 올바르지 않습니다.');
            } */

    /* } catch (error) {
            console.log(error);
        } */
  };

  useEffect(() => {
    morePosts();
  }, []);

  return (
    <div>
      <Header />
      <SideBar />
      <div className="likedPost">
        <Link to="/myLikedPost">
          <button className={styles.likedStudy}>Study</button>
        </Link>
        <Link to="/myLikedQuestion">
          <button className={styles.likedQuestion}>Question</button>
        </Link>
        <InfiniteScroll
          dataLength={likedPosts.length}
          next={morePosts}
          hasMore={hasMore}
          loader={loaderImg()}
        >
          {likedPosts.length > 0 ? (
            likedPosts.map((post, index) => {
              return (
                <StudyRoomCard
                  title={post.title}
                  tags={Array.isArray(post.tag) ? [...post.tag] : []}
                  id={post._id}
                  key={post._id}
                />
              );
            })
          ) : (
            <p>관심글이 아직 없습니다.</p>
          )}
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
}
export default MyLikedPost;
