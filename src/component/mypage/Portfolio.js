import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SideBar from "./SideBar";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import styles from "./PortfolioModify.module.css";
import { FcSportsMode, FcCancel } from "react-icons/fc";
import { MdPayment, MdAttachMoney } from "react-icons/md";
import {
  BsBorderRight,
  BsFillTrophyFill,
  BsGenderAmbiguous,
} from "react-icons/bs";
import { AiFillTag } from "react-icons/ai";
import { FcOk } from "react-icons/fc";
import { BASE_API_URI } from "../../util/common";
import { TbCurrencyWon } from "react-icons/tb";
import { FaTransgender } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { FaHashtag } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaTemperatureLow } from "react-icons/fa";

function Portfolio() {
  const today = new Date();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [htmlString, setHtmlString] = useState();
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = userStore();
  const [isRegistered, setIsRegistered] = useState(false);
  const [sports, setSports] = useState("");
  const [career, setCareer] = useState("");
  const [tags, setTags] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState("");
  const [review, setReview] = useState([]);
  const [happiness, setHappiness] = useState();

  function handleKeyPress(e) {
    if (e.code === "Enter" || e.code === "Comma" || e.code === "Space") {
      const newTag = e.target.value.trim();

      if (tags.includes(newTag)) {
        alert("중복되는 태그가 있습니다");
        e.target.value = "";
        e.preventDefault();
      } else {
        if (tags.length < 5) {
          if (newTag !== "") {
            setTags([...tags, newTag]);
            e.target.value = "";
            e.preventDefault();
          }
        } else {
          alert("태그는 최대 5개까지 가능합니다.");
          e.target.value = "";
          e.preventDefault();
        }
      }
    }
  }

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

  const handlePaymentMethodChange = (value) => {
    if (paymentMethods.includes(value)) {
      // 이미 선택된 결제 수단인 경우, 선택 해제
      setPaymentMethods(paymentMethods.filter((method) => method !== value));
    } else {
      // 새로운 결제 수단을 선택한 경우, 선택 추가
      setPaymentMethods([...paymentMethods, value]);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGender(res.data[0].gender);
        setCareer(res.data[0].career);
        setPrice(res.data[0].price);
        setSports(res.data[0].sports);
        setPaymentMethods(res.data[0].paymentMethods);
        setTags(res.data[0].tags);
        setTitle(res.data[0].title);
        setContent(res.data[0].content);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/getMyHappiness`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHappiness(res.data.happiness);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (content !== undefined) {
      const contentString = JSON.stringify(content);
      const cleanedString = contentString.replace(/undefined/g, "");
      const parsedContent = JSON.parse(cleanedString);
      const contents = parsedContent.content;
      setHtmlString(contents);
    }
  }, [content]);

  useEffect(() => {
    const getReview = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/getMyReview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data !== undefined) {
          console.log(res.data);
          setReview(res.data.reviews.reviewContents);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getReview();
  }, []);

  console.log(htmlString);

  if (isRegistered) {
    return (
      <div>
        <Header />
        <SideBar />
        <div style={{ marginTop: "60px", marginLeft: "200px" }}>
          <div className={styles.viewContent}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "600",
                  marginBottom: "30px",
                }}
              >
                나의 포트폴리오
              </div>
              <button
                type="submit"
                style={{
                  background: "#8ae52e",
                  width: "70px",
                  height: "40px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginRight: "-70px",
                }}
                onClick={() => {
                  navigate(`/PortfolioModify`);
                }}
              >
                수정하기
              </button>
            </div>
            <hr
              style={{
                marginBottom: "40px",
                width: "850px",
              }}
            />
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
                <div className={styles.boxLabel}>{career}</div>
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
                <div className={styles.boxLabel}>{sports}</div>
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
                  <div className={styles.boxLabel}>{happiness}</div>
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
                <div>가격대 : {price}원대</div>
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
                <div>성별 : {gender}</div>
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
                {paymentMethods.map((method, index) => (
                  <>
                    <p style={{ marginRight: "-0.5rem" }} key={index}>
                      {method}
                    </p>
                    {index < paymentMethods.length - 1 && ","}
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
                {tags.map((tag, index) => (
                  <div key={index}> # {tag}</div>
                ))}
              </div>
            </div>
            <div className={styles.infoLabel}>상세정보</div>
            <div className={styles.view}>
              <div className={styles.viewTitle}>{title}</div>
              <div
                className={styles.viewContents}
                dangerouslySetInnerHTML={{ __html: htmlString }}
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
    );
  } else if (user.token !== null) {
    const checkRegistration = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const portfolio = res.data.find((p) => p.writer === user.name);
        if (portfolio !== undefined) {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkRegistration();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") alert("제목을 작성해주세요");
    else if (content === "") alert("내용을 작성해주세요");
    else if (token != null) {
      try {
        const res = await axios.post(
          `${BASE_API_URI}/portfolio`,
          {
            gender: gender,
            career: career,
            price: price,
            sports: sports,
            paymentMethods: paymentMethods,
            tags: tags,
            title: title,
            content: JSON.parse(JSON.stringify(content)),
            writer: user.name,
            writeDate: today,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        window.alert("포트폴리오 등록이 완료되었습니다.");
        setIsRegistered(true);
        console.log("success", res.data.message);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const imgLink = `${BASE_API_URI}/images`;

  const customUploadAdapter = (loader) => {
    // (2)
    return {
      upload() {
        return new Promise((resolve, reject) => {
          loader.file.then((file) => {
            // 이미지 리사이징 및 압축
            compressImage(file, 800, 800).then((compressedFile) => {
              const data = new FormData();
              data.append("name", file.name);
              data.append("file", compressedFile);

              axios
                .post(`${BASE_API_URI}/upload`, data)
                .then((res) => {
                  if (!flag) {
                    setFlag(true);
                  }
                  resolve({
                    default: `${imgLink}/${res.data.filename}`,
                  });
                  console.log(`${imgLink}/${res.data.filename}`);
                })
                .catch((err) => reject(err));
            });
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    // (3)
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  const compressImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      image.onload = function () {
        let width = image.width;
        let height = image.height;
        let newWidth = width;
        let newHeight = height;

        // 이미지 크기 조정
        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (height * maxWidth) / width;
        }
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (newWidth * maxHeight) / newHeight;
          newHeight = maxHeight;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // 이미지 압축
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          0.7
        );
      };

      image.onerror = (e) => {
        reject(e);
      };

      image.src = URL.createObjectURL(file);
    });
  };
  if (isRegistered) {
    return (
      <div className="Registered">
        <Header />
        <SideBar />
        <p className="registered">
          {" "}
          <FcOk size={28} /> 등록이 완료되었습니다.{" "}
        </p>
        <button
          type="submit"
          className="modifyBtn"
          onClick={() => {
            navigate(`/PortfolioModify`);
          }}
        >
          수정하기
        </button>
      </div>
    );
  } else if (user.token !== null) {
    const checkRegistration = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const portfolio = res.data.find((p) => p.writer === user.name);
        if (portfolio !== undefined) {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkRegistration();
  }

  return (
    <div>
      <Header />
      <SideBar />
      <div className={styles.all}>
        <div className={styles.choose}>
          <div className={styles.write_title}>나의 포트폴리오 작성</div>
          <hr />
          <div className={styles.select}>
            <div className={styles.left}>
              <div className={styles.recruit_num}>
                <text className={styles.nn}>성별</text>
                <select
                  name="gender"
                  className={styles.number}
                  defaultValue="default"
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <option value="default" disabled hidden>
                    성별 선택
                  </option>
                  <option value="남자">남자</option>
                  <option value="여자">여자</option>
                </select>
              </div>

              <div className={styles.running_time}>
                <text className={styles.ww}>경력</text>
                <input
                  className={styles.runningTime}
                  onChange={(event) => {
                    setCareer(event.target.value);
                  }}
                  type="text"
                  id="career"
                  name="career"
                  value={career}
                />
              </div>

              <div className={styles.pay}>
                <text className={styles.ww}>가격대</text>
                <input
                  className={styles.estimatedAmount_input}
                  onChange={(event) => {
                    setPrice(event.target.value);
                  }}
                  type="currency"
                  pattern="[0-9]+"
                  id="estimatedAmount"
                  name="estimatedAmount"
                  min="0"
                  step="100"
                  value={price}
                />{" "}
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.start_time}>
                <text className={styles.ww}>운동 종목</text>
                <input
                  className={styles.startTime_input}
                  onChange={(event) => {
                    setSports(event.target.value);
                  }}
                  type="text"
                  id="sports"
                  name="sports"
                  value={sports}
                />
              </div>

              <div className={styles.pay}>
                <text className={styles.ww}>결제 수단</text>

                <div className={styles.paypay}>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        value="현금 결제"
                        /* className={styles.aaa} */
                        checked={paymentMethods.includes("현금 결제")}
                        onChange={(e) =>
                          handlePaymentMethodChange(e.target.value)
                        }
                      />
                      <span>현금</span>
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        value="카드 결제"
                        /* className={styles.aaa} */
                        checked={paymentMethods.includes("카드 결제")}
                        onChange={(e) =>
                          handlePaymentMethodChange(e.target.value)
                        }
                      />
                      <span>카드</span>
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        value="계좌 이체"
                        /* className={styles.aaa} */
                        checked={paymentMethods.includes("계좌 이체")}
                        onChange={(e) =>
                          handlePaymentMethodChange(e.target.value)
                        }
                      />
                      <span>계좌 이체</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.tags}>
                <text className={styles.tt}>태그</text>

                <input
                  className={styles.tag_input}
                  onKeyPress={handleKeyPress}
                  type="text"
                  placeholder="해시태그 입력(최대 5개)"
                />
                <div className={styles.tag_tagPackage}>
                  {tags.map((tag, index) => (
                    <span key={index} className={styles.tag_tagindex}>
                      {tag}
                      <button
                        className={styles.tag_Btn}
                        onClick={() => {
                          setTags(tags.filter((tag, i) => i !== index));
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <hr />

          <div className={styles.ch3}>
            <div className={styles.title_input}>
              <text className={styles.cc}>제목</text>
              <input
                onChange={handleTitle}
                className={styles.title_tinput}
                value={title}
                placeholder="제목을 입력하세요."
              />
            </div>

            <div className={styles.content}>
              <CKEditor
                editor={ClassicEditor}
                data={htmlString}
                config={{
                  placeholder: "내용을 입력하세요.",
                  extraPlugins: [uploadPlugin],
                }}
                onChange={(e, editor) => {
                  const data = editor.getData();
                  setContent({
                    content: data,
                  });
                }}
                onBlur={(e, editor) => {
                  // console.log("Blur.", editor);
                }}
                onFocus={(e, editor) => {
                  // console.log("Focus.", editor);
                }}
              />

              <div className={styles.btn2}>
                <input
                  type="submit"
                  value="등록"
                  className={styles.submitBtn3}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
