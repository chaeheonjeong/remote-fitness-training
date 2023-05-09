import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import userStore from "../store/user.store";

export default function useWrite() {
  const today = new Date();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [estimateAmount, setEstimateAmount] = useState("");
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState(false);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [periodCondition, setPeriodCondition] = useState("");
  const [pCondition, setPCondition] = useState("");
  const [recruit, setRecruit] = useState(true);

  const user = userStore();
  const { id } = useParams();

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post("http://localhost:8080/upload", formData);
    const imageUrl = res.data.url;
    console.log(imageUrl);
    return imageUrl;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pCondition === "") alert("모집 인원을 입력해주세요.");
    //else if (periodCondition === "") alert("진행 기간을 입력해주세요.");
    else if (startTime === "") alert("시작 시간을 입력해주세요.");
    else if (runningTime === "") alert("예상 진행시간을 입력해주세요.");
    else if (estimateAmount === "") alert("예상 금액을 입력해주세요");
    else if (date === "") alert("시작 예정일을 입력해주세요.");
    else if (title === "") alert("제목을 작성해주세요.");
    else if (content === "") alert("내용을 작성해주세요.");
    else if (user.token !== null) {
      try {
        const response = await axios.post(
          "http://localhost:8080/postWrite",
          {
            number: pCondition,
            /* period: periodCondition, */
            date: String(date),
            startTime: startTime,
            runningTime: runningTime,
            estimateAmount: estimateAmount,
            tag: tags,
            title: title,
            content: JSON.parse(JSON.stringify(content)),
            writer: user.name,
            writeDate: today,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log("success", response.data.message);
        navigate("/study");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleModify = async (e) => {
    e.preventDefault();
    if (title === "") alert("제목을 작성해주세요.");
    else if (JSON.stringify(content) === `{"content":""}`)
      alert("내용을 작성해주세요.");
    else if (user.token !== null) {
      try {
        const response = await axios.post("http://localhost:8080/postModify", {
          _id: id,
          number: pCondition,
          /* period: periodCondition, */
          date: String(date),
          startTime: startTime,
          runningTime: runningTime,
          estimateAmount: estimateAmount,
          tag: tags,
          title: title,
          content: JSON.parse(JSON.stringify(content)),
          recruit: recruit,
        });
        alert("수정이 완료되었습니다.");
        navigate(`/view/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (content !== undefined) {
      const contentString = JSON.stringify(content); // 객체를 문자열로 변환합니다.
      const cleanedString = contentString.replace(/undefined/g, "");
      const parsedContent = JSON.parse(cleanedString); // 문자열을 JSON 객체로 변환합니다.
      const html = parsedContent.content;
      setHtmlString(html);
    }
  }, [content]);

  return {
    id,
    pCondition,
    setPCondition,
    periodCondition,
    setPeriodCondition,
    date,
    setDate,
    startTime,
    setStartTime,
    runningTime,
    setRunningTime,
    estimateAmount,
    setEstimateAmount,
    handleKeyPress,
    tags,
    setTags,
    title,
    setTitle,
    setContent,
    content,
    navigate,
    handleSubmit,
    handleModify,
    htmlString,
    user,
    setSameUser,
    recruit,
    setRecruit,
    uploadImage,
  };
}