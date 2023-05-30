import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../component/main/Recruitment.module.css"

import loadingImg from "../images/loadingImg.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_API_URI } from "../util/common";

function useQSearch() {
  const [studies, setStudies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [renderQ, setRenderQ] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const limit = 12;

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState("title");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [noResult, setNoResult] = useState(false);

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

  const searchInputHandler = (event) => {
    setSearchInput(event.target.value);
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
        `${BASE_API_URI}/searchStudy?selected=${selected}
          &value=${encodeURIComponent(searchInput)}
          &page=${Math.floor(searchResults.length / limit) + 1}&limit=${limit}`
      )
      .then((response) => {
        console.log("검색결과를 가져오겠습니다.");
        const newSearchStudies = response.data.studies;
        const isLastPage = newSearchStudies.length < 4;

        try {
          if (isLastPage) {
            setHasMore(false);
          }

          const prevSearchStudies = [...studies];
          setSearchResults((prevSearchStudies) => [
            ...prevSearchStudies,
            ...newSearchStudies,
          ]);
          setPage((prevSearchPage) => prevSearchPage + 1);

          console.log(response.data.studies.length);
          if (response.data.studies.length === 0) {
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
    setStudies([]);
    setPage(1);
    setHasMore(true);
  }, [searchInput]);

  const moreStudies = () => {
    if (hasMore) {
      axios
        .get(
          `${BASE_API_URI}/studies?page=${
            Math.floor(renderQ.length / limit) + 1
          }&limit=${limit}`
        )
        .then((response) => {
          const { hasMore, studies } = response.data;
          const page = Math.floor(renderQ.length / limit) + 1;
          if (page === 1) setRenderQ([...studies]);
          else setRenderQ((prev) => [...prev, ...studies]);
          setHasMore(hasMore);
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
        { id: id, postName: "study" } // 서버로 전달할 id
      )
      .then((response) => {
        console.log(response.data.message);
        navigate(`/view/${id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return{
    studies,
    setStudies,
    searchInput,
    setSearchInput,
    renderQ, 
    setRenderQ,
    hasMore, 
    setHasMore,
    limit,
    page,
    setPage,
    isLoading,
    setIsLoading,
    selected,
    setSelected,
    searchResults, 
    setSearchResults,
    searching, 
    setSearching,
    noResult, 
    setNoResult,
    LoaderImg,
    changeSelectHandler,
    searchResult,
    searchHandler,
    moreStudies,
    clickHandler,
    searchInputHandler
  };

}

export default useQSearch;