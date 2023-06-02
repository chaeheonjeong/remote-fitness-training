import React, { useEffect, useState } from "react";
import styles from "./View.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/user.store";
import Header from "../main/Header";
import { scrollToTop } from "../../util/common";
import { HiUserCircle, HiQuestionMarkCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import MyPAReviews from "../mypage/MyPAReviews";
/* import response from "http-browserify/lib/response"; */
import usePost from "../../hooks/useTPost";
import TViewReply from "./TViewReply";
import { BASE_API_URI } from "../../util/common";

const ViewTWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = userStore();

  const [mouse, setMouse] = useState(false);
  const [rWriterList, setRWriterList] = useState([]);
  const [write, setWrite] = useState([]);
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState(false);
  /* const [selectedId, setSelectedId] = useState();
    const [selectedRId, setSelectedRId] = useState(); */
  const [good, setGood] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [profileImg, setProfileImg] = useState(null);
  const [application, setApplication] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hook = usePost();

  const passHandler = (userId) => {
    navigate(`/PortfolioView/${userId}`);
  };

  const deleteHandler = () => {
    const confirmDelete = window.confirm("글을 삭제하시겠습니까?");
    if (confirmDelete) {
      axios
        .delete(`${BASE_API_URI}/writeTDelete/${id}`)
        .then((res) => {
          navigate("/study");
        })
        .catch((err) => console.log(err));
    }
  };

  function handleApply() {
    setShowModal(true);
  }

  function handleCancel() {
    setShowModal(false);
  }

  const applicantSave = async (e) => {
    e.preventDefault();

    
    console.log("$$$$");
    
    try {
        const response = await axios.post(`${BASE_API_URI}/sApplicantSave`, {
            userName: user.name,
            postId: id,
        }, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplication(true);
        console.log("@@@@@");
    } catch (error) {
        console.log(error);
    }
    window.location.reload();
    setShowModal(false);
  }

  const getApplicants = async () => {
    try {
        const res = await axios.get(
          `${BASE_API_URI}/getSApplicant/${id}`
        );
  
        if (res.data !== undefined) {
          console.log("hi ", res.data.data);
          setRWriterList(res.data.data);
        } else {
          console.log("아직 신청자가 없습니다");
        }
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    getApplicants();
  }, []);

  // 스크랩 수
  const getBookmarkCount = () => {
    axios
      .get(`${BASE_API_URI}/getTBookmarkCount/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setBookmarkCount(res.data.result.goodCount);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(getBookmarkCount, []);

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get(`${BASE_API_URI}/getTWrite/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setWrite(response.data.result[0]);
            setSameUser(response.data.sameUser);
            setProfileImg(response.data.profileImg);
          }
          console.log("getWrite: ", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`${BASE_API_URI}/getTWrite2/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setWrite(response.data.result[0]);
            setSameUser(response.data.sameUser);
            setProfileImg(response.data.profileImg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchWrite = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/getTWrite/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setWrite(res.data.data[0]);
          setSameUser(res.data.sameUser);
          console.log(res.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWrite();
  }, [id]);

    
  useEffect(() => {
    if (write.content !== undefined) {
      const contentString = JSON.stringify(write.content); // 객체를 문자열로 변환합니다.
      const cleanedString = contentString.replace(/undefined/g, "");
      const parsedContent = JSON.parse(cleanedString); // 문자열을 JSON 객체로 변환합니다.
      const htmlString = parsedContent.content;
      setHtmlString(htmlString);
    }
  }, [write]);

  useEffect(() => {
    scrollToTop();
  }, []);

  const formatDate = (today) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dateW = today.getDate();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const formattedDate = `${year}.${month}.${dateW}(${dayOfWeek})`;

    return formattedDate;
  };

  const handleMouseEnter = () => {
    setMouse(true);
  }

  const handleMouseLeave = () => {
    setMouse(false);
  }

  // 글 쓴 사람의 프로필 이미지 클릭시
  const writerProfileClick = (writer, id) => {
    axios
      .post(`${BASE_API_URI}/tView/${id}/${writer}`, {
        id: id,
        writer: writer,
        postName: "view",
      })
      .then((response) => {
        console.log(response.data.message);
        console.log("길이: ", response.data.length);
        navigate(`/MyPAReviews/${writer}`);
        console.log("writer: ", writer);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return(
    <>
        <Header />
        <div className={styles.all}>
            <div className={styles.left}>
                <div className={styles.body}>
                    <div className={styles.detail}>
                        <div className={styles.content_4_a}>
                            <div>
                            <button
                                className={write.recruit ? styles.cbtn : styles.falseBtn}
                            >
                                {write.recruit ? "모집중" : "모집완료"}
                            </button>
                            </div>

                            <div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className={styles.explanation_pack}
                        >
                            <HiQuestionMarkCircle
                                className={styles.questionMark}
                            />
                            {mouse && (
                                <div
                                    className={styles.explanation}
                                >
                                    <p>
                                        수정 클릭 후 
                                        왼쪽 상단에 있는 모집중 버튼을 누르면
                                        신청자 채택 가능합니다
                                    </p>
                                </div>
                            )}
                        </div>
                        </div>

                        

                        <div className={styles.content_1}>
                            <div className={styles.content_1_1}>
                                <div style={{ fontSize: "45px", fontWeight: "600" }}>{write.title}</div>
                                <div className={styles.date}>
                                    {write.writeDate !== undefined &&
                                    formatDate(new Date(write.writeDate))}
                                </div>
                            </div>

                            <div className={styles.content_4}>
                            {sameUser && (
                                <div className={styles.content_4_b}>
                                <input
                                    type="button"
                                    className={styles.dd}
                                    value="삭제"
                                    onClick={() => {
                                        deleteHandler();
                                    }}
                                    />
                                <input
                                    type="button"
                                    value="수정"
                                    className={styles.mm}
                                    onClick={() => {
                                    navigate(`/modifyTPost/${id}`);
                                    }}
                                />
                                </div>
                            )}
                            </div>
                        </div>
                        <hr />
                    </div>

                    <div className={styles.content_3}>
                        <div className={styles.write} dangerouslySetInnerHTML={{ __html: htmlString }} />

                        <div className={styles.write_bottom}>
                            <div className={styles.tags}>
                                <div>
                                    {write.tag !== undefined &&
                                    write.tag.map((x, i) => {
                                    return <span key={x + i} className={styles.tag}>
                                                <div className={styles.hashtag}>#</div> 
                                                <div className={styles.tag_content}>{x}</div>
                                            </span>;
                                    })}
                                </div>
                            </div>

                            <div className={styles.scrap}>
                                <span className={good ? styles.goodBtn : null}>
                                    스크랩 {bookmarkCount}
                                </span>
                                <span className={styles.views}>조회수 {write.views}</span>
                            </div>
                        </div>

                        
                    </div>   
                </div>

                <TViewReply
                    write = {write}
                    setWrite = {setWrite}
                    writer = {write.writer}
                />
                </div>


                <div className={styles.info_all}>
        {!sameUser && (
        <div className={styles.apply}>
            {write.recruit ? (
                    rWriterList.includes(user.name) ? (
                        <button
                            className={styles.noti_pack_complete}
                            disabled={false}
                        > 신청완료 </button>
                    ) : (
                        <>
                        <button
                            onClick={handleApply}
                            className={styles.noti_pack}
                        >신청</button>
        
                        {showModal && (
                            <div 
                            className={`${styles.container} ${
                                showModal ? styles.ModalOpen : styles.ModalClose
                            }`}
                            >
                            <div className={styles.modal_wrapper}>
                                <p>정말로 신청하시겠습니까?</p>
                                <footer>
                                    <button className={styles.cancle} onClick={handleCancel}>취소</button>
                                    <button className={styles.make} onClick={applicantSave}>확인</button>
                                </footer>
                            </div>
                            </div>
                        )}
                        <div className={styles.message}>신청 버튼을 누르면 신청이 완료됩니다</div>
                        </>
                    )
            ) : (
                <button
                    className={styles.noti_pack_complete}
                    disabled={false}
                > 신청마감 </button>
            )}

            
        </div>
        )}
                    <div className={styles.writer_info}>
                        <div className={styles.content_2}>
                            <div>강사</div>
                            <div className={styles.profile1} onClick={() => {passHandler(write._user)}} 
                                style={{ marginRight: "0.8rem" }}>
                                {profileImg === null ? (
                                    <HiUserCircle
                                    size="40"
                                    color="#5a5a5a"
                                    style={{ cursor: "pointer" }}
                                    />
                                ) : (
                                    <img
                                    className={styles.profile}
                                    src={profileImg}
                                    alt="프로필 이미지"
                                    />
                                )}
                                <div className={styles.profileInfo}>
                                    <div className={styles.name}>{write.writer}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                
            <div className={styles.info}>
                <div className={styles.info_title}>상세정보</div>
                <div className={styles.content5_all}>
                    <div className={styles.title}>
                    <div className={styles.css1_head} style={{ marginRight: "1rem" }}>모집인원</div>
                    <div className={styles.css2_head} style={{ marginRight: "1rem" }}> 시작 예정일</div>
                    <div className={styles.css3_head} style={{ marginRight: "1rem" }}> 시작 시간</div>
                    <div className={styles.css4_head} style={{ marginRight: "1rem" }}>예상 진행시간</div>
                    <div className={styles.css5_head} style={{ marginRight: "1rem" }}>예상 금액</div>
                </div>

                <div className={styles.properties}>
                    <div className={styles.css1}>{write.number}</div>
                    <div className={styles.css2}>{write.date}</div>
                    <div className={styles.css3}>{write.startTime}</div>
                    <div className={styles.css4}>{write.runningTime} 분</div>
                    <div className={styles.css5}>{write.estimateAmount} 원</div>
                </div>
            </div>
        </div>
    </div>
</div>
</>
);
}
export default ViewTWrite;
