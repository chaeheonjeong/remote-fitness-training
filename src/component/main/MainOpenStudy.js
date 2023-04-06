import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import LazyLoad from "react-lazyload";

import mainStyles from  "./MainOpenStudy.module.css";
import "./InfiniteScroll.css";
import OpenStudyModal from "./OpenStudyModal";
import OpenStudyRoomCard from "./OpenStudyRoomCard";

import loadingImg from "../../images/loadingImg.gif";

function MainOpenStudy() {
    const [studyModal, setStudyModal] = useState(false);

    const [openStudies, setOpenStudies] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [selected, setSelected] = useState('title');
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [noResult, setNoResult] = useState(false);
    

    const loaderImg = () => {
        return(
            <div className={mainStyles.loadingPackage}>
                <img className={mainStyles.loadingImg} src={loadingImg} alt="loadingImg" />
                <div className={mainStyles.loading}>loading...</div>
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

        if(searchInput === '') {
            
        }

        axios
            .get(`http://localhost:8080/searchOpenStudy?selected=${selected}&value=${encodeURIComponent(searchInput)}&page=${page}&limit=6`)
            .then((response) => {
                console.log('검색결과를 가져오겠습니다.');
                const newSearchOpenStudies = response.data.openStudies;
                const isLastPage = newSearchOpenStudies.length < 6;

                try {
                    //setSearchResults(response.data.openStudies);
                    //setHasMore(response.data.hasMore);
                    //console.log('검색결과 : ', response.data.openStudies);
                    //console.log(response.data.openStudies.length);

                    if(isLastPage) {
                        setHasMore(false);
                    }

                    const prevSearchOpenStudies = [...openStudies];
                    setSearchResults(prevSearchOpenStudies => [...prevSearchOpenStudies, ...newSearchOpenStudies]);
                    setPage(prevSearchPage => prevSearchPage + 1);

                    console.log(response.data.openStudies.length);
                    if(response.data.openStudies.length === 0) {
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
        setOpenStudies([]);
        setPage(1);
        setHasMore(true);
    }, [searchInput]);


    const addModal = (img, title, tags, personNum) => {
        const newOpenStudies = [...openStudies, {img, title, tags, personNum}]
        setOpenStudies(newOpenStudies);
    }

    const moreOpenStudies = () => {
        console.log('데이터를 불러옵니다');
      
        axios
          .get(`http://localhost:8080/openStudies?page=${page}&limit=6`)
          .then((response) => {
            const newOpenStudies = response.data.openStudies;
            const isLastPage = newOpenStudies.length < 6;
      
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
            console.log('모든데이터를 불러왔습니다. => ', error);
            setIsLoading(false);
            setHasMore(false);
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
                    
                    <div className={mainStyles.searchAndMake} onSubmit={searchHandler}>
                    <form className={mainStyles.search}>
                        <select onChange={changeSelectHandler}>
                            <option value="title">제목</option>
                            <option value="tags">태그</option>
                            <option value="writer">작성자</option>
                        </select>
                        <input id="searchInput" name="searchInput" value={searchInput} onChange = { (e) => setSearchInput(e.target.value) }/>
                        <button type="submit">검색</button>
                    </form>
                    <button onClick={() => {setStudyModal(!studyModal)}} className={mainStyles.makeBtn}>만들기</button>
                    </div>
                </div>

        
                <h1>Open Study</h1> 
                {searching && !noResult && (
                    <InfiniteScroll
                        dataLength = {openStudies.length}
                        next = { page !== 1 ? searchResult : null }
                        hasMore = {hasMore}
                        loader = {loaderImg()}
                    >
                    { 
                        searchResults.map((result, index) => {
                            return (
                                <OpenStudyRoomCard 
                                    img={result.img}
                                    title={result.title} 
                                    personNum={result.personNum} 
                                    tags={Array.isArray(result.tags) ? [...result.tags] : []} 
                                    id={result._id}
                                    key={result._id}
                                />
                            );
                        })
                    }
                    </InfiniteScroll>
                )}

                {
                    noResult ? (
                        <div className={mainStyles.noResult}>
                            <a>⚠️ 검색결과가 없습니다 ⚠️{noResult}</a>
                        </div>

                    ) : null
                }


                {!searching && (
                    <InfiniteScroll
                        dataLength = {openStudies.length}
                        next = { page !== 1 ? moreOpenStudies : null }
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
                                    id={data._id}
                                    key={data._id}
                                />
                            );
                        })}
                    </InfiniteScroll>
                )}
                { !hasMore && !noResult && (
                        <div className={mainStyles.noData}>
                        <a>✅ 모든 오픈스터디를 보여드렸습니다 ✅</a>
                    </div>
                )}

            </div>
        </>
    );
} 

export default MainOpenStudy;