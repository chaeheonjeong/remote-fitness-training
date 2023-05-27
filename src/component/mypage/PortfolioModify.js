import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SideBar from "./SideBar";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import "./PortfolioModify.css";
import { BASE_API_URI } from "../../util/common";

function PortfolioModify() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [htmlString, setHtmlString] = useState();
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = userStore();

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

  return (
    <div>
      <Header />
      <SideBar />
      <div>
        <div className="title">
          <text className="titleText">제목</text>
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="titleInput"
            value={title}
            placeholder="제목을 입력하세요."
          />
        </div>
        <div className="content">
          <CKEditor
            editor={ClassicEditor}
            data={htmlString}
            config={{
              placeholder: "내용을 입력하세요.",
              extraPlugins: [uploadPlugin],
            }}
            /*             onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                        console.log("Editor is ready to use!", editor);
                        }} */
            onChange={(e, editor) => {
              const data = editor.getData();
              console.log({ e, editor, data });
              setContent({
                content: data,
              });
            }}
            /*             onBlur={(e, editor) => {
                        console.log("Blur.", editor);
                        }}
                        onFocus={(e, editor) => {
                        console.log("Focus.", editor);
                        }} */
          />
        </div>
        <div className="btn">
          <input
            type="submit"
            value="수정"
            className="submitBtn"
            onClick={handleModify}
          />
          <input
            type="button"
            value="취소"
            className="cancelBtn"
            onClick={() => {
              navigate(`/Portfolio`);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PortfolioModify;
