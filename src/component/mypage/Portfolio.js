import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SideBar from "./SideBar";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import "./Portfolio.css";
import { FcOk } from "react-icons/fc";
import { BASE_API_URI } from "../../util/common";
import styles from "./PortfolioModify.module.css";

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
          <div className="view_title">
            <div className="viewTitle">제목 {title}</div>
          </div>
          <div>{gender}</div>
          <div>{career}</div>
          <div>{price}</div>
          <div>{sports}</div>
          <div>
            {paymentMethods.map((method, index) => (
              <div key={index}>{method}</div>
            ))}
          </div>
          <div>
            {tags.map((tag, index) => (
              <div key={index}>{tag}</div>
            ))}
          </div>
          <div className="view_contents">
            <div
              className="viewContents"
              dangerouslySetInnerHTML={{ __html: htmlString }}
            />
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
      <div className={styles.choose}>
        <div className={styles.ch1}>
          <p className={styles.nn}>성별</p>
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

          <p className={styles.ww}>경력</p>
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
        <div className={styles.ch2}>
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
          원<p className={styles.ww}>운동 종목</p>
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

        <div className={styles.ch3}>
          <p className={styles.nn}>결제 수단</p>
          <div>
            <label>
              <input
                type="checkbox"
                value="현금 결제"
                checked={paymentMethods.includes("현금 결제")}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              />
              현금 결제
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="카드 결제"
                checked={paymentMethods.includes("카드 결제")}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              />
              카드 결제
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="계좌 이체"
                checked={paymentMethods.includes("계좌 이체")}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              />
              계좌 이체
            </label>
          </div>
          <p className={styles.tt}>태그</p>
          <div>
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

        <div className={styles.title_input}>
          <text className={styles.cc}>제목</text>
          <input
            onChange={handleTitle}
            className="titleInput"
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
        </div>
      </div>
      <div className={styles.btn}>
        <input
          type="submit"
          value="등록"
          className="submitBtn"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Portfolio;
