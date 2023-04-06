import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import "./InfiniteScroll.css";
import styles from "./MainQuestion.module.css";
//import cardStyles from  "./QuestionRoomCard.module.css";
import QuestionRoomCard from "./QuestionRoomCard";

import loadingImg from "../../images/loadingImg.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbCircleArrowUpFilled } from "react-icons/tb";
import { scrollToTop } from "../../util/common";

function MainQuestion() {
  const navigate = useNavigate();

  const [renderQ, setRenderQ] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [searchInput, setSearchInput] = useState("");

  const limit = 12;
  function LoaderImg() {
    return (
      <div className={styles.loadingPackage}>
        <img
          className={styles.loadingImg}
          src={loadingImg}
          alt="loadingImg"
        ></img>
        <div className={styles.loading}>loading...</div>
      </div>
    );
  }

  const moreQuestions = () => {
    if (hasMore)
      axios
        .get(
          `http://localhost:8080/questions?page=${
            Math.floor(renderQ.length / limit) + 1
          }&limit=${limit}`
        )
        .then((response) => {
          const { hasMore, questions } = response.data;
          const page = Math.floor(renderQ.length / limit) + 1;
          if (page === 1) setRenderQ([...questions]);
          else setRenderQ((prev) => [...prev, ...questions]);
          setHasMore(hasMore);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  useEffect(() => {
    moreQuestions();
  }, []);

  const clickHandler = (id) => {
    axios
      .post(
        "http://localhost:8080/view",
        { id: id, postName: "question" } // 서버로 전달할 id
      )
      .then((response) => {
        console.log(response.data.message);
        navigate(`/AskView/${id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className={styles.upCircle}>
        <TbCircleArrowUpFilled
          size="50"
          color="gray"
          onClick={() => {
            scrollToTop();
          }}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.menu}>
          <div className={styles.select}>
            <Link to="/">
              <button className={styles.openStudy}>오픈스터디</button>
            </Link>
            <Link to="/study">
              <button className={styles.study}>스터디</button>
            </Link>
            <Link to="/question">
              <button className={styles.question}>질문</button>
            </Link>
          </div>

          <div className={styles.searchAndMake}>
            <form className={styles.search}>
              <select>
                <option value="title">제목</option>
                <option value="tags">태그</option>
                <option value="writer">작성자</option>
              </select>
              <input
                className="searchInput"
                name="searchInput"
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button>검색</button>
            </form>
            <button
              className={styles.makeBtn}
              onClick={() => {
                navigate("/Ask");
              }}
            >
              글쓰기
            </button>
          </div>
        </div>

        <h1>Question</h1>

        <InfiniteScroll
          dataLength={renderQ.length}
          next={moreQuestions}
          hasMore={hasMore}
          loader={<LoaderImg />}
          key={Math.random()}
        >
          {renderQ &&
            renderQ.map((data, index) => {
              return (
                <QuestionRoomCard
                  title={data.title}
                  tags={Array.isArray(data.tag) ? [...data.tag] : []}
                  id={data._id}
                  key={data._id}
                  onClick={() => {
                    clickHandler(data._id);
                  }}
                />
              );
            })}
        </InfiniteScroll>
      </div>
    </>
  );
}
export default MainQuestion;
