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

function Portfolio() {
  const defaultContent = `
    <h2>포트폴리오 작성 예시</h2>
    <br>
    <p> 경력 : </p> 
    <br>
    <p> 운동 종목 : </p> 
    <br>
    <p> 가격대 : </p>
    <br>
    <p> 성별 : </p>
    `;

  const today = new Date();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [htmlString, setHtmlString] = useState();
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = userStore();
  const [isRegistered, setIsRegistered] = useState(false);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  return (
    <div>
      <Header />
      <SideBar />
      <div>
        <div className="title">
          <text className="titleText">제목</text>
          <input
            onChange={handleTitle}
            className="titleInput"
            value={title}
            placeholder="제목을 입력하세요."
          />
        </div>
        <div className="content">
          <CKEditor
            editor={ClassicEditor}
            data={defaultContent}
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
          />
        </div>
        <div className="btn">
          <input
            type="submit"
            value="등록"
            className="submitBtn"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
