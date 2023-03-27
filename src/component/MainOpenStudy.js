import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import mainStyles from  "./MainOpenStudy.module.css";
import "./InfiniteScroll.css";
import OpenStudyModal from "./OpenStudyModal";
import OpenStudyRoomCard from "./OpenStudyRoomCard";

import loadingImg from "../images/loadingImg.gif";

function MainOpenStudy() {
    const [studyModal, setStudyModal] = useState(false);

    const [openStudies, setOpenStudies] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    //const router = useRouter();
    const [selected, setSelected] = useState('title');
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    

    const loaderImg = () => {
        return(
            <div className={mainStyles.loadingPackage}>
                <img className={mainStyles.loadingImg} src={loadingImg} alt="loadingImg" />
                <div className={mainStyles.loading}>loading...</div>
            </div>
        );
    }

    /* const search = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get("http://localhost:8080/search", {
                
            });
            searchResult();
        } catch(error) {
            console.log(error);
        }
    } */

    const changeSelectHandler = (event) => {
        setSelected(event.target.value);
        console.log('selected: ', selected);
    };

    const searchResult = () => {
        console.log('btn click!!!!!!!!');

        axios
            .get(`http://localhost:8080/search?selected=${encodeURIComponent(selected)}&value=${encodeURIComponent(searchInput)}&page=${page}&limit=12`)
            .then((response) => {
                console.log('검색결과를 가져오겠습니다.');

                const newResults = response.data.results;
                const isLastPage  = newResults.length < 12;

                if(isLastPage) {
                    setHasMore(false);
                }

                const prevOpenStudies = [...newResults];
                console.log('Page(searchTitle): ', page);
                setOpenStudies(prevOpenStudies => [...prevOpenStudies, ...newResults]);
                console.log('Number of loaded studies(searchTitle): ' + (prevOpenStudies.length + newResults.length));
                setPage(prevPage => prevPage + 1);

                if(prevOpenStudies.length === 0 && newResults.length === 0) {
                    return(<a>검색결과를 찾을 수 없습니다.</a>);
                } else {
                    console.log('검색결과를 가져왔습니다.');
                }
            })
            .catch((error) => {
                console.log('검색결과: ', error);
                setIsLoading(false);
            });
        
    };

        /* useEffect(() => {
            searchResult()
        }, []); */


    const addModal = (img, title, tags, personNum) => {
        const newOpenStudies = [...openStudies, {img, title, tags, personNum}]
        setOpenStudies(newOpenStudies);
    }

    const moreOpenStudies = () => {
        console.log('데이터를 불러옵니다');
      
        axios
          .get(`http://localhost:8080/openStudies?page=${page}&limit=12`)
          .then((response) => {
            const newOpenStudies = response.data.openStudies;
            const isLastPage = newOpenStudies.length < 12;
      
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
            console.log(error);
            setIsLoading(false);
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
                    
                    <div className={mainStyles.searchAndMake}>
                    <form className={mainStyles.search}>
                        <select onChange={changeSelectHandler}>
                            <option value="title">제목</option>
                            <option value="tags">태그</option>
                            <option value="writer">작성자</option>
                        </select>
                        <input id={searchInput} name={searchInput} onChange = { (e) => setSearchInput(e.target.value) }/>
                        <button onClick={() => {searchResult()}}>검색</button>
                    </form>
                    <button onClick={() => {setStudyModal(!studyModal)}} className={mainStyles.makeBtn}>만들기</button>
                    </div>
                </div>

        
                <h1>Open Study</h1>

                <InfiniteScroll
                    dataLength = {openStudies.length}
                    next = {moreOpenStudies}
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
                                id={data.id}
                                key={data.id}
                            />
                        );
                    })}
                </InfiniteScroll>
            </div>
        </>
    );
} 

export default MainOpenStudy;