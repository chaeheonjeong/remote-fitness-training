import "./Write.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import { useNavigate } from "react-router-dom";

const ModifyAsk = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [htmlString, setHtmlString] = useState();
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const user = userStore();

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

  const handleModify = async (e) => {
    e.preventDefault();
    if (title === "") alert("제목을 작성해주세요.");
    else if (JSON.stringify(content) === `{"content":""}`)
      alert("내용을 작성해주세요.");
    else if (user.token !== null) {
      try {
        const response = await axios.post("http://localhost:8080/askModify", {
          _id: id,
          tag: tags,
          title: title,
          content: JSON.parse(JSON.stringify(content)),
        });
        alert("수정이 완료되었습니다.");
        navigate(`/AskView/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchWrite = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getAsk/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setTags(res.data.result[0].tag);
          setTitle(res.data.result[0].title);
          setContent(res.data.result[0].content);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWrite();
  }, []);

  useEffect(() => {
    if (content !== undefined) {
      const contentString = JSON.stringify(content); // 객체를 문자열로 변환합니다.
      const cleanedString = contentString.replace(/undefined/g, "");
      const parsedContent = JSON.parse(cleanedString); // 문자열을 JSON 객체로 변환합니다.
      const html = parsedContent.content;
      setHtmlString(html);
    }
  }, [content]);

  return (
    <>
      <Header />
      <div className="choose">
        <text className="tt">태그</text>
        <div>
          <input
            className="tag_input"
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="해시태그 입력(최대 5개)"
          />
          <div className="tag_tagPackage">
            {tags !== undefined &&
              tags.map((tag, index) => (
                <span key={tag + index} className="tag_tagindex">
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
      </div>
      <div className="title_input">
        <text className="cc">제목</text>
        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="title_tinput"
          placeholder="제목을 입력하세요."
          defaultValue={title}
        />
      </div>

      <div className="content">
        <CKEditor
          editor={ClassicEditor}
          data={htmlString}
          config={{
            placeholder: "내용을 입력하세요.",
          }}
          /*           onReady={(editor) => {
            console.log("Editor is ready to use!", editor);
          }} */
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
            navigate("/AskView/:id");
          }}
        />
        <input
          type="submit"
          value="수정"
          className="submit"
          onClick={handleModify}
        />
      </div>
    </>
  );
};

export default ModifyAsk;
