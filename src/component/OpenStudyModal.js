import { useEffect, useRef, useState } from "react";

import styles from  "./OpenStudyModal.module.css";
import tagStyles from "./Tag.module.css";
import axios from "axios";
import { Navigate } from "react-router-dom";


export default function OpenStudyModal({
    studyModal,
    setStudyModal,
    //setImage,
    addModalHandler
}) 
{
    const [img, setImg] = useState("");
    const [title, setTitle] = useState("");
    const [inputTag, setInputTag] = useState("");
    const [personNum, setpersonNum] = useState("1");
    const [tags, setTags] = useState([]);

    const numOfPeopleOption = () => {
        const numArray = [];
        for(var i=1; i<=50; i++) {
            numArray.push(<option key={i} value={i}>{i}</option>);     
        }
        return numArray;  
    };

    const addOpenStudy = async (event) => {
        event.preventDefault();
        setStudyModal(false);
        try {
            const response = await axios.post("http://localhost:8080/openStudy", {
                img: img,
                title: title,
                hashtag: tags,
                personNum: personNum
            });
            addModalHandler(img, title, tags, personNum);
            alert("오픈스터디가 생성되었습니다.");
        } catch(error) {
            console.log(error);
        }
    }

    function handleKeyPress(event) {
        if(event.key === 'Enter') {
            const newTag = inputTag.trim();

            if(tags.includes(newTag)) {
                alert('중복되는 태그가 있습니다');
                setInputTag('');
                event.preventDefault();
            } else {
                if(tags.length < 5) {
                    if(newTag !== '') {
                        setTags([...tags, newTag]);
                        setInputTag('');
                        event.preventDefault();
                    }
                }
                else {
                    alert('태그는 최대 5개까지 가능합니다.');
                    setInputTag('');
                    event.preventDefault();
                }
            }
        }
    }
 /*            // 태그 생성 
            function handleKeyPress(event) {
                console.log('태그생성');
            } */
        
            // 태그 삭제 
            function handleDelete(index) {
                setTags(tags.filter((tag, i) => i !== index));
            }
    
            // 모달창에서 만들기 눌렀을 때 (데이터 저장)
            /*const submitHandler = async (event) => {
                event.preventDefault();
                alert("오픈스터디가 생성되었습니다.");
                setStudyModal(false);
                //makeRoom(true);
            };*/
    
        // 사진 업로드
        const imageUploadHandler = (event) => {
            const selectedImage = event.target.files[0];
            const MAX_SIZE = 50000000;
    
            if(selectedImage && selectedImage.size <= MAX_SIZE) {
                const reader = new FileReader();
                reader.onload = () => {
                    //setImage(reader.result);
                    setImg(reader.result);
                };
                reader.readAsDataURL(selectedImage);
            } else {
                alert("이미지 용량은 50MB보다 작아야 합니다.");
            }
        };

  return (
      (
      <div className={`${styles.container} ${studyModal? styles.ModalOpen : styles.ModalClose}`}>
        <div className={styles.closeBox} onClick={() => setStudyModal(false)} />
        <div className={styles.modalWrapper}>
          오픈스터디 만들기
          <button className={styles.ModalClose} onClick={() => setStudyModal(false)}>
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
                                    <a>방 제목</a> 
                                    <input
                                        type="text"
                                        name="title"
                                        onChange = { (e) => setTitle(e.target.value) }
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <a>태그</a> 
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
                                            <span key={index} className={tagStyles.tag}>
                                                {tag}
                                                <button 
                                                    onClick={() => handleDelete(index)}
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <a>인원수</a>
                                    <select
                                        name="personNum"
                                        onChange={ (e) => setpersonNum(e.currentTarget.value) }
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
                                    onClick={() => {setStudyModal(false)}}
                                >
                                    취소
                                </button>
                            </footer>
          </div>
        </div>
      </div>
    )
  );
}
