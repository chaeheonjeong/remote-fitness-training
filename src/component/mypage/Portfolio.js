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
import { MdPayment, MdAttachMoney} from "react-icons/md";
import { BsFillTrophyFill, BsGenderAmbiguous } from "react-icons/bs";
import { AiFillTag } from "react-icons/ai";
import { FcOk } from "react-icons/fc";
import { BASE_API_URI } from "../../util/common";


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
      <div className="Registered">
        <Header />
        <SideBar />
        <p className="registered">
          {" "}
          <FcOk size={18} /> 등록이 완료되었습니다.{" "}
        </p>
        <div className="viewContent">
        <div className="viewContent2">
        <div className="styles.css1_head" style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}>
        <BsGenderAmbiguous style={{ marginRight: '1.5rem' }}/>{/* 성별 */} {gender}</div>

        <div className="styles.css1_head"  style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}>
          <BsFillTrophyFill style={{ marginRight: '1.5rem' }}/>{/* 경력 */} {career}</div>

        <div className="styles.css1_head"  style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}>
          <MdAttachMoney style={{ marginRight: '1.5rem' }}/>{/* 가격대 */} {price}원</div>

        <div className="styles.css1_head"  style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}>
          <FcSportsMode style={{ marginRight: '1.5rem' }}/>{/* 운동종목 */} {sports}</div>

        <div className="styles.css1_head"  style={{ marginRight: "1.5rem", textDecoration: "none", display: 'flex', alignItems: 'center'}}>
          <MdPayment style={{ marginRight: '1.5rem' }}/>
            {/* 가능결제수단 */} {paymentMethods.map((method, index) => (
              <div className="styles.css1_head" style={{ marginleft: "5rem", textDecoration: "none", display: 'flex', alignItems: 'center'}}key={index}>{method}</div>
              ))}
            </div>

        <div className="styles.css1_head"  style={{ marginRight: "1.5rem", textDecoration: "none", display: 'flex', alignItems: 'center'}}>
          <AiFillTag style={{ marginRight: '1.5rem' }}/>
            {tags.map((tag, index) => (
              <div className="styles.css1_head2" style={{ marginleft: "5rem", textDecoration: "none", display: 'flex', alignItems: 'center'}}key={index}>{/* 태그 */} {tag}</div>
              ))}
            </div>
            </div>


            <div className="titltt">제목</div>
            <div className="view_title">
              
              <div className="viewTitle">{title}</div>
            
            <div className="view_contents">
              <div
                className="viewContents"
                dangerouslySetInnerHTML={{ __html: htmlString }}
              />
            </div>
            
            </div>  
        </div>
        <button
          type="submit"
          className="modifyBtn"
          onClick={() => {
            navigate(`/PortfolioModify`);
          }}
        >
          수정하기
        </button>
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
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <span>현금</span></label>
                
                </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="카드 결제"
                    /* className={styles.aaa} */
                    checked={paymentMethods.includes("카드 결제")}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <span>카드</span></label>
                
              </div>
              <div>  
              <label>
                  <input
                    type="checkbox"
                    value="계좌 이체"
                    /* className={styles.aaa} */
                    checked={paymentMethods.includes("계좌 이체")}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <span>계좌 이체</span></label>
                
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
