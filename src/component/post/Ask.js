import React, { useEffect, useState } from "react";
import "./Ask.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../main/Header";
import userStore from "../../store/user.store";

function Ask() {
  const today = new Date();
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const dateW = today.getDate();
  const dayOfWeek = daysOfWeek[today.getDay()];
  const formattedDate = `${year}.${month}.${dateW}(${dayOfWeek})`;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const user = userStore();

  const titleHandler = (e) => {
    const inputTitle = e.target.value;
    setTitle(inputTitle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") alert("제목을 작성해주세요.");
    else if (content === "") alert("내용을 작성해주세요.");
    else if (user.token !== null) {
      try {
        const response = await axios.post(
          "http://localhost:8080/postAsk",
          {
            title: title,
            content: JSON.parse(JSON.stringify(content)),
            tag: tags,
            writer: user.name,
            writeDate: formattedDate,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log("success", response.data.message);
        navigate("/question");
      } catch (error) {
        console.log(error);
      }
    }
  };

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      const newTag = e.target.value.trim();

      if (tags.length < 5) {
        if (newTag !== "") {
          setTags([...tags, newTag]);
          e.target.value = "";
        }
      } else {
        alert("태그는 최대 5개까지 가능합니다.");
      }
    }
  }

  return (
    <>
      <Header />
      <div className="ask">
        <div className="title_input">
          <text className="cc">제목</text>
          <input
            onChange={titleHandler}
            className="title_tinput"
            value={title}
            placeholder="제목을 입력하세요."
          />
        </div>
        <div>
          <input
            className="tag_input"
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="해시태그 입력(최대 5개)"
          />
          <div className="tag_tagPackage">
            {tags.map((tag, index) => (
              <span key={index} className="tag_tagindex">
                {tag}
                <button
                  className="tag_Btn"
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

        <div className="content">
          <CKEditor
            editor={ClassicEditor}
            data=""
            config={{
              placeholder: "내용을 입력하세요.",
            }}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(e, editor) => {
              const data = editor.getData();
              console.log({ e, editor, data });
              setContent({
                content: data,
              });
            }}
            onBlur={(e, editor) => {
              console.log("Blur.", editor);
            }}
            onFocus={(e, editor) => {
              console.log("Focus.", editor);
            }}
          />
        </div>

        <div className="btn">
          <input
            type="button"
            value="취소"
            className="cancel"
            onClick={() => {
              navigate("/question");
            }}
          />
          <input
            type="submit"
            value="등록"
            className="submit"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}

export default Ask;
