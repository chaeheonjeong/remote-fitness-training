import { Link } from "react-router-dom";
import { useState } from "react";

import styles from "./MainStudy.module.css";
import cardStyles from "./StudyRoomCard.module.css";
import "./InfiniteScroll.css";

import StudyRoomCard from "./StudyRoomCard";
import InfiniteScroll from "react-infinite-scroll-component";

import loadingImg from "../../images/loadingImg.gif";
import { useNavigate } from "react-router-dom";

function MainStudy() {
  const [studyTitle, setStudyTitle] = useState("");

  const [cards, setCards] = useState(Array.from({ length: 6 }));
  const fetchData = () => {
    setTimeout(() => {
      setCards(cards.concat(Array.from({ length: 12 })));
    }, 1500);
  };
  const navigate = useNavigate();

  function studyCard() {
    <StudyRoomCard title={studyTitle} />;
  }

  function studyPack() {
    return Array.from({ length: 50 }, (v, i) =>
      i % 3 === 0 ? (
        <>
          <div className={styles.block}></div>
          <StudyRoomCard key={i} title={studyTitle} />
          <div className={styles.blank} />
        </>
      ) : i % 3 === 2 ? (
        <>
          <StudyRoomCard key={i} title={studyTitle} />
        </>
      ) : (
        <>
          <StudyRoomCard key={i} title={studyTitle} />
          <div className={styles.blank} />
        </>
      )
    );
  }

  function loaderImg() {
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

  function studyScroll() {
    return (
      <>
        <InfiniteScroll
          dataLength={cards.length}
          next={fetchData}
          hasMore={true}
          loader={loaderImg()}
        >
          {studyPack()}
        </InfiniteScroll>
      </>
    );
  }

  return (
    <>
      <div id={styles.body}>
        <div id={styles.menu}>
          <div id={styles.select}>
            <Link to="/">
              <button id={styles.openStudy}>오픈스터디</button>
            </Link>
            <Link to="/study">
              <button id={styles.study}>스터디</button>
            </Link>
            <Link to="/question">
              <button id={styles.question}>질문</button>
            </Link>
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
          <button
            onClick={() => {
              navigate("/writePost");
            }}
          >
            만들기
          </button>
        </div>

        <h1>Study</h1>
        <div className={cardStyles.container}>{studyScroll()}</div>
      </div>
    </>
  );
}
export default MainStudy;
