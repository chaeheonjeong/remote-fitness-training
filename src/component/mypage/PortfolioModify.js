import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SideBar from "./SideBar";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import styles from "./PortfolioModify.module.css";
import { BASE_API_URI } from "../../util/common";

function PortfolioModify() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [htmlString, setHtmlString] = useState();
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = userStore();

  const [sports, setSports] = useState("");
  const [career, setCareer] = useState("");
  const [tags, setTags] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState("");

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
      const html = parsedContent.content;
      setHtmlString(html);
    }
  }, [content]);

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

  const handleModify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_API_URI}/portfolioModify`,
        {
          gender: gender,
          career: career,
          price: price,
          sports: sports,
          paymentMethods: paymentMethods,
          tags: tags,
          title: title,
          content: content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("수정이 완료되었습니다.");
      navigate(`/Portfolio`);
    } catch (err) {
      console.error(err);
    }
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

  return (
    <div>
      <Header />
      <SideBar />
      
      <div className={styles.all}>
        <div className={styles.choose}>
        <div className={styles.write_title}>나의 포트폴리오 수정</div>
        <hr />
        <div className={styles.select}>
          <div className={styles.left}>
            <div className={styles.recruit_num}>
            
              <text className={styles.nn}>성별</text>
              <select
            name="gender"
            className={styles.number}
            value={gender}
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
            className={styles.estimatedAmount_input}
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
          ></input>{" "}
            </div>
            
          </div>
            
          <div className={styles.right}>
            <div className={styles.start_time}>
              <text className={styles.ww}>운동 종목</text>
              <input
            className={styles.estimatedAmount_input}
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
                    checked={paymentMethods.includes(" 현금 결제")}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <span className={styles.pay5}> 현금</span></label>
                
                </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="카드 결제"
                    /* className={styles.aaa} */
                    checked={paymentMethods.includes(" 카드 결제")}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <span className={styles.pay5}> 카드</span></label>
                
              </div>
              <div>  
              <label>
                  <input
                    type="checkbox"
                    value="계좌 이체"
                    className={styles.aaac}
                    checked={paymentMethods.includes(" 계좌 이체")}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <span className={styles.pay5}> 계좌 이체</span></label>
                
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
            className={styles.aaab}
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

        <div className={styles.btn}>
          <input
            type="submit"
            value="수정"
            className={styles.submitBtn}
            onClick={handleModify}
          />
          <input
            type="button"
            value="취소"
            className={styles.cancelBtn}
            onClick={() => {
              navigate(`/Portfolio`);
            }}
          />
      </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default PortfolioModify;
