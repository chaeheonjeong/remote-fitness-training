import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import "./PortfolioView.css";
import ProfileSideBar from "./ProfileSideBar";
import { FcCancel } from "react-icons/fc";
import { BASE_API_URI } from "../../util/common";

function PortfolioView() {
  const [portfolio, setPortfolio] = useState([]);
  const token = localStorage.getItem("token");
  const user = userStore;
  const [contents, setContents] = useState();
  const [isRegistered, setIsRegistered] = useState(false);
  const { writerId } = useParams();
  const [review, setReview] = useState([]);

  //const [student, setStudent] = useState([""]);
  //const [writeDate, setWriteDate] = useState([""]);

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
        <div className="Registered">
          <Header />
          <ProfileSideBar />
          <p className="_registered">
            {" "}
            <FcCancel size={28} />볼 수 있는 포트폴리오가 없습니다.
          </p>
        </div>
        <div className="reviewContent">
          <div className="review">후기</div>
        </div>
        <div className="review_contents">
          {console.log(review)}
          {review.map((item, index) => (
            <div className="reviewContents" key={index + "___"}>
              <div>작성자 {item.writerName.charAt(0) + "****"}</div>

              <div>작성일자 {item.date}</div>
              <div>별점 {item.star}</div>
              <div>리뷰내용 {item.reviewContent}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <Header />
      <ProfileSideBar />
      <div className="viewContent">
        <div>{portfolio[0]?.gender}</div>
        <div>{portfolio[0]?.career}</div>
        <div>{portfolio[0]?.price}</div>
        <div>{portfolio[0]?.sports}</div>
        <div>
          {portfolio[0]?.paymentMethods.map((method, index) => (
            <div key={index}>{method}</div>
          ))}
        </div>
        <div>
          {portfolio[0]?.tags.map((tag, index) => (
            <div key={index}>{tag}</div>
          ))}
        </div>
        <div className="view_title">
          <div className="viewTitle">제목 {portfolio[0]?.title}</div>
        </div>
        <div className="view_contents">
          <div
            className="viewContents"
            dangerouslySetInnerHTML={{ __html: contents }}
          />
        </div>
      </div>
      <div className="reviewContent">
        <div className="review">후기</div>
      </div>
      <div className="review_contents">
        {console.log(review)}
        {review.map((item, index) => (
          <div className="reviewContents" key={index + "___"}>
            <div>작성자 {item.writerName.charAt(0) + "****"}</div>

            <div>작성일자 {item.date}</div>
            <div>별점 {item.star}</div>
            <div>리뷰내용 {item.reviewContent}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioView;
