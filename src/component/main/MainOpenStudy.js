import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import mainStyles from "./MainOpenStudy.module.css";
import "./InfiniteScroll.css";
import OpenStudyModal from "./OpenStudyModal";
import OpenStudyRoomCard from "./OpenStudyRoomCard";

import loadingImg from "../../images/loadingImg.gif";

function MainOpenStudy() {
  const [studyModal, setStudyModal] = useState(false);
  //const [image, setImage] = useState();
  const [moreOpenStudies, setMoreOpenStudies] = useState(true);
  const [openStudies, setOpenStudies] = useState([]);
  const [page, setPage] = useState(1);

  // 무한스크롤

  //const [cards, setCards] = useState(Array.from({length: 4}))

  //const fetchData = () => {
  //console.log(cards.length);
  /* setTimeout(() => { 
            setCards(cards.concat(Array.from({ length: 4 })))
        }, 1500); */

  /* let params = {  
            lastCardId: openStudies[openStudies.length - 1]?.id,
        }
        if(moreOpenStudies) {
            dispatch(fetchAll)
        }
    }; */

  const loaderImg = () => {
    return (
      <div className={mainStyles.loadingPackage}>
        <img
          className={mainStyles.loadingImg}
          src={loadingImg}
          alt="loadingImg"
        />
        <div className={mainStyles.loading}>loading...</div>
      </div>
    );
  };

  /* const studyScroll = () => {
        return (
            <InfiniteScroll
                dataLength = {cards.length}
                next = {fetchData}
                hasMore = {true}
                loader = {loaderImg()}
            >
               {openStudyPackage()}
            </InfiniteScroll>
        );
    } */

  /* const openStudyPackage = () => {
        <div>
        {openStudies && openStudies.map((data, index) => {
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
        </div>
    }  */

  const addModal = (img, title, tags, personNum) => {
    const newOpenStudies = [...openStudies, { img, title, tags, personNum }];
    setOpenStudies(newOpenStudies);
  };

  // 데이터 불러오기
  useEffect(() => {
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
  });

  return (
    <>
      <div style={{ width: "100%" }}>
        {
          <OpenStudyModal
            studyModal={studyModal}
            setStudyModal={setStudyModal}
            //setImage={setImage}
            addModalHandler={addModal}
          />
        }
        <div id={mainStyles.body}>
          <div id={mainStyles.menu}>
            <div id={mainStyles.select}>
              <Link to="/">
                <button id={mainStyles.openStudy}>오픈스터디</button>
              </Link>
              <Link to="/study">
                <button id={mainStyles.study}>스터디</button>
              </Link>
              <Link to="/question">
                <button id={mainStyles.question}>질문</button>
              </Link>
            </div>

            <form id={mainStyles.search}>
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
                setStudyModal(!studyModal);
              }}
            >
              만들기
            </button>
          </div>

          <h1>Open Study</h1>

          <InfiniteScroll
            dataLength={openStudies.length}
            next={() => setPage(page + 1)}
            hasMore={moreOpenStudies}
            loader={loaderImg()}
            style={{ width: "100%" }}
            co
          >
            <div className={mainStyles.cardWrapper}>
              {openStudies &&
                openStudies.map((data, index) => {
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
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}

export default MainOpenStudy;
