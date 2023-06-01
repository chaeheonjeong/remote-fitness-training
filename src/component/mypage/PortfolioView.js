import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import styles from "./PortfolioView.module.css";
import ProfileSideBar from "./ProfileSideBar";
import { FcSportsMode, FcCancel } from "react-icons/fc";
import { AiFillTag } from "react-icons/ai";
import { BASE_API_URI } from "../../util/common";
import { GiRoundStar } from "react-icons/gi";
import { TbCurrencyWon } from "react-icons/tb";
import { FaTransgender } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { FaHashtag } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaTemperatureLow } from "react-icons/fa";

function PortfolioView() {
  const [portfolio, setPortfolio] = useState([]);
  const token = localStorage.getItem("token");
  const user = userStore;
  const [contents, setContents] = useState();
  const [isRegistered, setIsRegistered] = useState(false);
  const { writerId } = useParams();
  const [review, setReview] = useState([]);
  const [name, setName] = useState("");
  const [happiness, setHappiness] = useState("");

  //const [student, setStudent] = useState([""]);
  //const [writeDate, setWriteDate] = useState([""]);

  const calculateAverageStar = () => {
    if (review.length === 0) {
      return 0; // 리뷰가 없을 경우 평균 별점 0으로 처리
    }

    // 모든 리뷰의 별점을 정수로 변환하여 합산
    const totalStars = review.reduce(
      (acc, item) => acc + parseInt(item.star),
      0
    );

    // 평균 별점 계산
    const averageStar = totalStars / review.length;

    return averageStar.toFixed(1); // 소수점 한 자리까지 표시
  };

  const renderStarIcons = () => {
    const averageStar = calculateAverageStar(); // 평균 별점 계산
    const totalStars = 5; // 총 별의 개수
    const filledStars = Math.floor(averageStar); // 채워진 별의 개수 (정수 부분)
    const fractionalStar = averageStar - filledStars; // 소수 부분

    // 별 아이콘을 담을 배열 생성
    const starIcons = [];

    // 채워진 별 아이콘 추가
    for (let i = 0; i < filledStars; i++) {
      starIcons.push(
        <FaStar
          key={i}
          size={20}
          color="#f3da00"
          style={{ marginLeft: "5px" }}
        />
      );
    }

    // 소수 부분이 있을 경우 부분적으로 채워진 별 아이콘 추가
    if (fractionalStar > 0) {
      starIcons.push(
        <div
          key={filledStars}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaStar
            size={20}
            color="#f3da00"
            style={{
              marginLeft: "5px",
              clipPath: `inset(0 ${100 - fractionalStar * 100}% 0 0)`,
            }}
          />
          <FaStar size={20} color="#ccc" style={{ marginLeft: "-20px" }} />
        </div>
      );
    }

    // 빈 별 아이콘 추가
    for (let i = starIcons.length; i < totalStars; i++) {
      starIcons.push(
        <FaStar key={i} size={20} color="#ccc" style={{ marginLeft: "5px" }} />
      );
    }

    return starIcons;
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (writerId) {
        try {
          const res = await axios.get(`${BASE_API_URI}/portfolio/${writerId}`);
          const portfolio = res.data;
          if (portfolio.length !== 0) {
            setPortfolio(res.data);
            setIsRegistered(true);
          } else {
            setIsRegistered(false);
          }
          console.log(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    const getReview = async () => {
      try {
        const res = await axios.post(`${BASE_API_URI}/getTargetReview`, {
          targetUser: writerId,
        });
        if (res.data !== undefined) {
          console.log(res.data);
          setReview(res.data.reviews.reviewContents);
          setHappiness(res.data.happinessIndex.happinessIndex);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPortfolio();
    getReview();
  }, []);

  useEffect(() => {
    if (portfolio[0]?.content !== undefined) {
      const contentString = JSON.stringify(portfolio[0]?.content);
      const cleanedString = contentString.replace(/undefined/g, "");
      const parsedContent = JSON.parse(cleanedString);
      const contents = parsedContent.content;
      setContents(contents);
    }
  }, [portfolio]);

  console.log(contents);

  if (isRegistered === false) {
    return (
      <>
        <Header />
        <div style={{ marginTop: "100px" }}>
          <ProfileSideBar setNameHandler={setName} />
          <div
            style={{
              backgroundColor: "white",
              display: "flex",
              position: "relative",
              flexDirection: "column",
              padding: "2rem 15rem",
            }}
          >
            <div
              style={{
                marginTop: "70px",
                display: "flex",
                flexDirection: "row",
                fontWeight: "700",
              }}
            >
              <FcCancel size={28} />볼 수 있는 포트폴리오가 없습니다.
            </div>
            <div className={styles.reviewContent}>
              <div className={styles.infoLabel}>리뷰</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontSize: "35px",
                    fontWeight: "700",
                    marginRight: "10px",
                    marginBottom: "25px",
                  }}
                >
                  {calculateAverageStar()}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "1.3rem",
                  }}
                >
                  {renderStarIcons()}
                </div>
              </div>
              <hr
                style={{
                  height: "0.5px",
                  border: "none",
                  backgroundColor: "#ccc",
                }}
              />
              <div className={styles.reviewWrapper}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3.5rem",
                  }}
                >
                  {review.map((item, index) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.7rem",
                      }}
                      key={index + "___"}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <div style={{ fontWeight: "700" }}>
                          {item.writerName.charAt(0) + "****"}
                        </div>
                        <FaStar size="20" color="#f3da00" />
                        <div style={{ fontWeight: "700" }}> {item.star}.0</div>
                      </div>
                      <div> {item.reviewContent}</div>
                      <div
                        style={{ fontSize: "13px", color: "rgb(65, 65, 65)" }}
                      >
                        {" "}
                        {item.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ marginTop: "100px" }}>
        <ProfileSideBar setNameHandler={setName} />
        {console.log(name)}
        <div
          style={{
            backgroundColor: "white",
            display: "flex",
            position: "relative",
          }}
        >
          <div className={styles.viewContent}>
            <div className={styles.nameLable}>{name}</div>
            <div className={styles.smallContainer}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className={styles.boxLabel2}>경력</div>
                <div className={styles.boxLabel}>{portfolio[0]?.career}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className={styles.boxLabel2}>운동종목 </div>
                <div className={styles.boxLabel}>{portfolio[0]?.sports}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className={styles.boxLabel2}>온도</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.3rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaTemperatureLow size="25" color="#8ae52e" />
                  <div className={styles.boxLabel}>
                    {happiness !== "" ? happiness : `50.0`}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.infoLabel}>정보</div>
            <div className={styles.infoWrapper}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <TbCurrencyWon size="20" />
                <div>가격대 : {portfolio[0]?.price}원대</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaTransgender size="20" />
                <div>성별 : {portfolio[0]?.gender}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <MdPayments size="20" />
                가능결제수단 :
                {portfolio[0]?.paymentMethods.map((method, index) => (
                  <>
                    <p style={{ marginRight: "-0.5rem" }} key={index}>
                      {method}
                    </p>
                    {index < portfolio[0].paymentMethods.length - 1 && ","}
                  </>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaHashtag size="18" />
                {portfolio[0]?.tags.map((tag, index) => (
                  <div key={index}> # {tag}</div>
                ))}
              </div>
            </div>
            <div className={styles.infoLabel}>상세정보</div>
            <div className={styles.view}>
              <div className={styles.viewTitle}>{portfolio[0]?.title}</div>
              <div
                className={styles.viewContents}
                dangerouslySetInnerHTML={{ __html: contents }}
              />
            </div>
            <div className={styles.reviewContent}>
              <div className={styles.infoLabel}>리뷰</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontSize: "35px",
                    fontWeight: "700",
                    marginRight: "10px",
                    marginBottom: "25px",
                  }}
                >
                  {calculateAverageStar()}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {renderStarIcons()}
                  </div>
                  {
                    <div
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "13px",
                        marginTop: "0.2rem",
                      }}
                    >
                      {review.length}개 리뷰
                    </div>
                  }
                </div>
              </div>
              <hr
                style={{
                  height: "0.5px",
                  border: "none",
                  backgroundColor: "#ccc",
                }}
              />
              <div className={styles.reviewWrapper}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3.5rem",
                  }}
                >
                  {review.map((item, index) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.7rem",
                      }}
                      key={index + "___"}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <div style={{ fontWeight: "700" }}>
                          {item.writerName.charAt(0) + "****"}
                        </div>
                        <FaStar size="20" color="#f3da00" />
                        <div style={{ fontWeight: "700" }}> {item.star}.0</div>
                      </div>
                      <div> {item.reviewContent}</div>
                      <div
                        style={{ fontSize: "13px", color: "rgb(65, 65, 65)" }}
                      >
                        {" "}
                        {item.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PortfolioView;
