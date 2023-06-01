import Header from "../main/Header";
import SideBar from "./SideBar";
import styles from "./MyPost.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import StudyRoomCard from "../main/StudyRoomCard";
import loadingImg from "../../images/loadingImg.gif";
import userStore from "../../store/user.store";
import QuestionRoomCard from "../main/QuestionRoomCard";
import { BASE_API_URI } from "../../util/common";

const MyAsk = ({ activeButton }) => {
  const navigate = useNavigate();
  const [renderQ, setRenderQ] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  const user = userStore();

  function LoaderImg() {
    return (
      <div className={styles.loadingPackage}>
        <img
          className={styles.loadingImg}
          src={loadingImg}
          alt="loadingImg"
        ></img>
        <div className={styles.loading}>loading....</div>
      </div>
    );
  }

  const moreStudies = () => {
    if (hasMore) {
      axios
        .get(
          `${BASE_API_URI}/myAsks?page=${
            Math.floor(renderQ.length / limit) + 1
          }&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
        .then((response) => {
          const { hasMore, studies } = response.data;
          const page = Math.floor(renderQ.length / limit) + 1;
          if (studies !== undefined) {
            if (page === 1) setRenderQ([...studies]);
            else setRenderQ((prev) => [...prev, ...studies]);
            setHasMore(hasMore);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    moreStudies();
  }, []);

  const clickHandler = (id) => {
    axios
      .post(
        `${BASE_API_URI}/view`,
        { id: id, postName: "question" } // 서버로 전달할 id
      )
      .then((response) => {
        navigate(`/askView/${id}`);

      })
      .catch((error) => {
        console.log(error);
      });
  };
  


  return (
    <div>
      <Header />
      <SideBar activeButton={activeButton} />
      <div className={styles.contentWrapper}>
        <button
        className={styles.sstudy2}
          onClick={() => {
            navigate("/myPost");
          }}
        >
          모집글
        </button>
        <button className={styles.aask2}>질문글</button>
        {renderQ.length !== 0 ? (
          <InfiniteScroll
            dataLength={renderQ.length}
            next={moreStudies}
            hasMore={hasMore}
            loader={<LoaderImg />}
            key={Math.random() + "&&"}
          >
            {renderQ.map((data, index) => {
              return (
                <QuestionRoomCard
                  title={data.title}
                  tags={Array.isArray(data.tag) ? [...data.tag] : []}
                  id={data._id}
                  key={Math.random()}
                  onClick={() => {
                    clickHandler(data._id);
                  }}
                />
              );
            })}
          </InfiniteScroll>
        ) : (
          <p>게시된 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyAsk;
