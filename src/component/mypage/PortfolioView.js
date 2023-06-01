import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import "./PortfolioView.css";
import ProfileSideBar from "./ProfileSideBar";
import { FcSportsMode, FcCancel } from "react-icons/fc";
import { MdPayment, MdAttachMoney} from "react-icons/md";
import { BsFillTrophyFill, BsGenderAmbiguous } from "react-icons/bs";
import { AiFillTag } from "react-icons/ai";
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
      <div className="viewContent2">
        <div className="styles.css1_head" style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}>
        <BsGenderAmbiguous style={{ marginRight: '1rem'  }}/>{/* 성별  */}{portfolio[0]?.gender}</div>
        <div className="styles.css1_head"  style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}>
        <BsFillTrophyFill style={{ marginRight: '1rem' }}/>{/* 경력 */}{portfolio[0]?.career}</div>
        <div className="styles.css1_head"  style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}>
        <MdAttachMoney style={{ marginRight: '1rem' }}/>{/* 가격대 */}{portfolio[0]?.price}원</div>
        <div className="styles.css1_head"  style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}><FcSportsMode style={{ marginRight: '1rem' }}/>{/* 운동종목 */} {portfolio[0]?.sports}</div>

        {/* <div>
          {portfolio[0]?.paymentMethods.map((method, index) => (
            <div key={index}>가능결제수단 {method}</div>
          ))}
        </div> */}
        <div className="styles.css1_head"  style={{ marginRight: "1rem", textDecoration: "none", display: 'flex', alignItems: 'center'}}><MdPayment style={{ marginRight: '1rem' }}/>
            {/* 가능결제수단 */}{portfolio[0]?.paymentMethods.map((method, index) => (
              <div className="styles.css1_head" style={{ marginleft: "5rem", textDecoration: "none", display: 'flex', alignItems: 'center'}}key={index}>{method}</div>
            ))}
          </div>
        <div className="styles.css1_head"  style={{ marginRight: "1rem", textDecoration: "none", display: 'flex', alignItems: 'center'}}>
        <AiFillTag style={{ marginRight: '1rem' }}/>
          {portfolio[0]?.tags.map((tag, index) => (
            <div className="styles.css1_head2" style={{ marginleft: "5rem", textDecoration: "none", display: 'flex', alignItems: 'center'}}key={index}>{/* 태그 */} {tag}</div>
          ))}
        </div></div>
        <div className="titltt">제목</div>
        <div className="view_title">
          
          <div className="viewTitle">{portfolio[0]?.title}</div>
        
        <div className="view_contents">
          <div
            className="viewContents"
            dangerouslySetInnerHTML={{ __html: contents }}
          />
        </div>
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
