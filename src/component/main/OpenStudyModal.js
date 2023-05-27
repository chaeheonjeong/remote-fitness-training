import { useEffect, useRef, useState } from "react";

import styles from "./OpenStudyModal.module.css";
import tagStyles from "./Tag.module.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { BASE_API_URI } from "../../util/common";

export default function OpenStudyModal({
  studyModal,
  setStudyModal,
  //setImage,
  addModalHandler,
}) {
  const [image, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [pw, setPW] = useState(0);
  const [inputTag, setInputTag] = useState("");
  const [personNum, setpersonNum] = useState("1");
  const [tags, setTags] = useState([]);

  const numOfPeopleOption = () => {
    const numArray = [];
    for (var i = 1; i <= 50; i++) {
      numArray.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return numArray;
  };

  const addOpenStudy = async (event) => {
    event.preventDefault();
    setStudyModal(false);
    try {
      const response = await axios.post(`${BASE_API_URI}/openStudy`, {
        img: image,
        title: title,
        pw: pw,
        hashtag: tags,
        personNum: personNum,
      });
      addModalHandler(image, title, pw, tags, personNum);
      console.log("사진 크기: ", image.size);
      alert("오픈스터디가 생성되었습니다.");
    } catch (error) {
      console.log(error);
    }
  };

  function handleKeyPress(event) {
    if (
      event.code === "Enter" ||
      event.code === "Comma" ||
      event.code === "Space"
    ) {
      const newTag = inputTag.trim();

      if (tags.includes(newTag)) {
        alert("중복되는 태그가 있습니다");
        setInputTag("");
        event.preventDefault();
      } else {
        if (tags.length < 5) {
          if (newTag !== "") {
            setTags([...tags, newTag]);
            setInputTag("");
            event.preventDefault();
          }
        } else {
          alert("태그는 최대 5개까지 가능합니다.");
          setInputTag("");
          event.preventDefault();
        }
      }
    }
  }

  // 태그 삭제
  function handleDelete(index) {
    setTags(tags.filter((tag, i) => i !== index));
  }

  // 사진 업로드 및 압축
  const imageUploadHandler = async (event) => {
    const selectedImage = event.target.files[0];
    const MAX_SIZE = 50000000;
    const options = {
      maxSizeMB: 50, // 이미지 최대 용량
    };
    console.log("before: ", selectedImage.size);

    try {
      console.log("before: ", selectedImage.size);
      console.log(selectedImage);

      const compressedFile = await imageCompression(selectedImage, options);
      const promise = imageCompression.getDataUrlFromFile(compressedFile);

      if (compressedFile && compressedFile.size <= MAX_SIZE) {
        const reader = new FileReader();

        console.log("changeSize: ", compressedFile.size);

        reader.onload = () => {
          setImg(reader.result);

          console.log("check: ", reader.result);
        };
        //reader.readAsDataURL(selectedImage);
        const imageFile = reader.readAsDataURL(compressedFile);
        setImg(imageFile);

        console.log("hello: ", compressedFile);
      } else {
        alert("이미지 용량은 50MB보다 작아야 합니다.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`${styles.container} ${
        studyModal ? styles.ModalOpen : styles.ModalClose
      }`}
    >
      <div className={styles.closeBox} onClick={() => setStudyModal(false)} />
      <div className={styles.modalWrapper}>
        <strong>오픈스터디 만들기</strong>
        <button
          className={styles.ModalClose}
          onClick={() => setStudyModal(false)}
        >
          &times;
        </button>
        <div className={styles.inputWrapper}>
          <form>
            대표이미지
            <div className={styles.image}>
              <input
                type="file"
                accept="image/*"
                onChange={imageUploadHandler}
              />
            </div>
            <div className={styles.openStudyTitle}>
              <a>방 제목 </a>
              <input
                type="text"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <a>비밀번호</a>
              <input
                type="password"
                name="pw"
                onChange={(e) => setPW(e.target.value)}
              />
            </div>
            <div>
              <a>태그 </a>
              <input
                type="text"
                name="hashtag"
                className={styles.tagInput}
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="해시태그 입력(최대 5개)"
              />
              <div className={tagStyles.tagPackage}>
                {tags.map((tag, index) => (
                  <span key={index + tag} className={tagStyles.tag}>
                    {tag}
                    <button onClick={() => handleDelete(index)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <a>인원수 </a>
              <select
                className="personNum"
                name="personNum"
                onChange={(e) => setpersonNum(e.currentTarget.value)}
              >
                {numOfPeopleOption()}
              </select>
            </div>
          </form>

          <footer>
            <button
              className={styles.makeOpenStudy}
              type="submit"
              onClick={addOpenStudy}
            >
              만들기
            </button>
            <button
              className={styles.openStudyCancle}
              onClick={() => {
                setStudyModal(false);
              }}
            >
              취소
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
