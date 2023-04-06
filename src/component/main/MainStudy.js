import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styles from  "./MainStudy.module.css";
import "./InfiniteScroll.css";
import StudyRoomCard from "./StudyRoomCard";

import loadingImg from "../../images/loadingImg.gif";


function MainStudy() {
    const [studyTitle, setStudyTitle] = useState('');

    const [studies, setStudies] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [selected, setSelected] = useState('title');
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [noResult, setNoResult] = useState(false);

    const navigate = useNavigate();

    function loaderImg() {
        return(
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
    
    const changeSelectHandler = (event) => {
        setSelected(event.target.value);
    };

    const searchResult = () => {
        console.log('btn click!!!!!!!!');
        console.log(selected);

        setSearching(true);
        setNoResult(false);

        axios
            .get(`http://localhost:8080/searchStudy?selected=${selected}&value=${encodeURIComponent(searchInput)}&page=${page}&limit=6`)
            .then((response) => {
                console.log('검색결과를 가져오겠습니다.');
                const newSearchStudies = response.data.studies;
                const isLastPage = newSearchStudies.length < 6;

                try {
                    /* setSearchResults(response.data.studies);
                    setHasMore(response.data.hasMore);
                    console.log('검색결과 : ', response.data.studies);
                    //console.log(response.data.openStudies.length);


                    console.log(response.data.studies.length);
                    if(response.data.studies.length === 0) {
                        setNoResult(true);
                    } */

                    if(isLastPage) {
                        setHasMore(false);
                    }

                    const prevSearchStudies = [...studies];
                    setSearchResults(prevSearchStudies => [...prevSearchStudies, ...newSearchStudies]);
                    setPage(prevSearchPage => prevSearchPage + 1);

                    console.log(response.data.studies.length);
                    if(response.data.studies.length === 0) {
                        setNoResult(true);
                    }
                } catch(error) {
                    console.log('검색결과: ', error);
                    setHasMore(false);
                    setIsLoading(false);
                } finally {
                }
            })
        
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
        console.log('데이터를 불러옵니다');

        axios 
            .get(`http://localhost:8080/studies?page=${page}&limit=6`)
            .then((response) => {
                const newStudies = response.data.studies;
                const isLastPage = newStudies.length < 6;

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
                /* console.log(error);
                setIsLoading(false); */
                console.log('모든데이터를 불러왔습니다. => ', error);
                setIsLoading(false);
                setHasMore(false);
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

                    <div className={styles.searchAndMake} onSubmit={searchHandler}>
                        <form className={styles.search}>
                            <select onChange={changeSelectHandler}>
                                <option value="title">제목</option>
                                <option value="tags">태그</option>
                                <option value="writer">작성자</option>
                            </select>
                            <input className="searchInput" name="searchInput" value={searchInput} onChange = { (e) => setSearchInput(e.target.value) }/>
                            <button type="submit">검색</button>
                        </form>
                        <button 
                            className={styles.makeBtn} 
                            onClick={() => {
                                navigate("/writePost");
                            }}
                        >
                            만들기
                        </button>
                    </div>
                </div>
                    
                <h1>Study</h1>
                {searching && !noResult && (
                    <InfiniteScroll
                        dataLength = {studies.length}
                        next = { page !== 1 ? searchResult : null }
                        hasMore = {hasMore}
                        loader = {loaderImg()}
                    >
                    {
                            searchResults.map((data, index) => {
                            return (
                                <StudyRoomCard 
                                    title={data.title}
                                    tags={Array.isArray(data.tag) ? [...data.tag] : []} 
                                    id={data._id}
                                    key={data._id}
                                />
                            );
                        })
                    }
                    </InfiniteScroll>
                )}

                {
                    noResult ? (
                        <div className={styles.noResult}>
                            <a>⚠️ 검색결과가 없습니다 ⚠️{noResult}</a>
                        </div>
                    ) : null
                }
                
                {!searching && (
                    <InfiniteScroll
                        dataLength = {studies.length}
                        next = { page !== 1 ? moreStudies : null }
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
                )}
                { !hasMore && !noResult && (
                        <div className={styles.noData}>
                        <a>✅ 모든 오픈스터디를 보여드렸습니다 ✅</a>
                    </div>
                )}
            </div> 
        </>

    )
}
/*   }

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
} */
export default MainStudy;
