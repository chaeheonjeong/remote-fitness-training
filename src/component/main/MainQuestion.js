import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import "./InfiniteScroll.css";
import styles from "./MainQuestion.module.css";
import QuestionRoomCard from "./QuestionRoomCard";

import loadingImg from "../../images/loadingImg.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbCircleArrowUpFilled } from "react-icons/tb";
import { scrollToTop } from "../../util/common";
import { BASE_API_URI } from "../../util/common";

function MainQuestion() {
  const navigate = useNavigate();

  const [renderQ, setRenderQ] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [searchInput, setSearchInput] = useState("");

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState("title");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [noResult, setNoResult] = useState(false);

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

  // 검색
  const changeSelectHandler = (event) => {
    setSelected(event.target.value);
  };

  const searchResult = () => {
    console.log("btn click!!!!!!!!");
    console.log(selected);

    setSearching(true);
    setNoResult(false);

    if (searchInput === "") {
    }

    axios
      .get(
        `${BASE_API_URI}/searchQuestion?selected=${selected}&value=${encodeURIComponent(
          searchInput
        )}&page=${page}&limit=6`
      )
      .then((response) => {
        console.log("검색결과를 가져오겠습니다.");
        const newSearchQuestion = response.data.questions;
        const isLastPage = newSearchQuestion.length < 6;

        try {
          if (isLastPage) {
            setHasMore(false);
          }

          const prevSearchQuestion = [...questions];
          setSearchResults((prevSearchQuestion) => [
            ...prevSearchQuestion,
            ...newSearchQuestion,
          ]);
          setPage((prevSearchPage) => prevSearchPage + 1);

          console.log(response.data.questions.length);
          if (response.data.questions.length === 0) {
            setNoResult(true);
          }
        } catch (error) {
          console.log("검색결과: ", error);
          setHasMore(false);
          setIsLoading(false);
        } finally {
        }
      });
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
    if (hasMore)
      axios
        .get(
          `${BASE_API_URI}/questions?page=${
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
        `${BASE_API_URI}/view`,
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
              <button className={styles.tRecruitment}>강사모집</button>
            </Link>
            <Link to="/sRecruitment">
              <button className={styles.sRecruitment}>학생모집</button>
            </Link>
            <Link to="/question">
              <button className={styles.question}>질문</button>
            </Link>
          </div>

          <div className={styles.searchAndMake} onSubmit={searchHandler}>
            <form className={styles.search}>
              <select onChange={changeSelectHandler}>
                <option value="title">제목</option>
                <option value="tags">태그</option>
                <option value="writer">작성자</option>
              </select>
              <input
                id="searchInput"
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit">검색</button>
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

        {/* 검색 */}
        {searching && !noResult && (
          <InfiniteScroll
            dataLength={questions.length}
            next={page !== 1 ? searchResult : null}
            hasMore={hasMore}
            loader={<LoaderImg />}
          >
            {searchResults.map((data, index) => {
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
        )}

        {noResult ? (
          <div className={styles.noResult}>
            <a>⚠️ 검색결과가 없습니다 ⚠️{noResult}</a>
          </div>
        ) : null}

        {!searching && (
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
        )}
      </div>
    </>
  );
}
export default MainQuestion;
