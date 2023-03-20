import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

import styles from  "./OpenStudyModal.module.css";
import tagStyles from "./Tag.module.css";

function OpenStudyModal(
    { open, close, makeRoom, title, setTitle, total, setTotal, participants, room, setRoom }) {
    var numOfPeople = Array.from({length: 50}, (v, i) => i+1);

    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const numOfPeopleOption = () => {
        const numArray = [];
        for(var i=1; i<=numOfPeople.length; i++) {
            numArray.push(<option key={i} value={i}>{i}</option>);     
        }
        return numArray;  
    };

    const changeTitle = (e) => {
        setTitle(e.target.value);
    }

    const makeOpenStudy = () => {
        alert("오픈스터디가 생성되었습니다.");
        close(false);
        makeRoom(true);
    };

    const decidePeople = (e) => {
        setTotal(e.currentTarget.value);
    };

    function handleKeyPress(event) {
        if(event.key === 'Enter') {
            const newTag = inputValue.trim();

            if(tags.includes(newTag)) {
                alert('중복되는 태그가 있습니다');
                setInputValue('');
                event.preventDefault();
            } else {
                if(tags.length < 5) {
                    if(newTag !== '') {
                        setTags([...tags, newTag]);
                        setInputValue('');
                        event.preventDefault();
                    }
                }
                else {
                    alert('태그는 최대 5개까지 가능합니다.');
                    setInputValue('');
                    event.preventDefault();
                }
            }
        }
    }

    function handleDelete(index) {
        setTags(tags.filter((tag, i) => i !== index));
    }

    function handleSubmit(evnet) {
        evnet.preventDefault();
    }

    return(
        <div className = {open ? 'openStudyModal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        <a className={styles.modalTitle}>오픈 스터디 만들기</a>
                        <button className={styles.close} onClick={() => {close(false)}}>
                            &times;
                        </button>
                    </header>
                    <hr />

                    <div>
                        <form action="/openStudyModal" method="POST" onSubmit={handleSubmit}>
                            <div className={styles.under}>
                                <div className={styles.image}>오픈 스터디 사진</div>
                                <div>
                                    <a>방 제목</a> 
                                    <input
                                        type="text"
                                        name="title"
                                        onChange = {changeTitle}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <a>태그</a> 
                                    <input
                                        type="text"
                                        name="hashtag"
                                        className={styles.tagInput}
                                        value={inputValue}
                                        onChange={(event) => setInputValue(event.target.value)}
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
                                <div/>
                                <div>
                                    <a>인원수</a>
                                    <select
                                        name="personNum"
                                        onChange={decidePeople}
                                    >
                                        {numOfPeopleOption()}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>

                    <footer>
                        <button 
                            className={styles.makeOpenStudy} 
                            onClick={() => makeOpenStudy()}
                        >
                            만들기
                        </button>
                        <button 
                            className={styles.openStudyCancle} 
                            onClick={() => {close(false)}}
                        >
                            취소
                        </button>
                    </footer>
                    </div>
                </section>
            ) : null}
        </div>
    );
} 

OpenStudyModal.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    makeRoom: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    setTitle: PropTypes.func.isRequired,
    total: PropTypes.string.isRequired,
    setTotal: PropTypes.func.isRequired,
    participants: PropTypes.number.isRequired,
};

export default OpenStudyModal;