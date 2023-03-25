import { useState } from "react";
import PropTypes from "prop-types";

import emptyHeart from "../images/emptyHeart.png";
import fullHeart from "../images/heart.png";
import view from "../images/view.png";
import comment from "../images/comment.png";

import styles from  "./StudyRoomCard.module.css";
import "./InfiniteScroll.css";

function StudyRoomCard({ keyNum, title }) {
    const tag = "태그";
    const viewCount = 21;
    const commentCount = 7;
    title = "스터디원 구합니다";

    const [heart, setHeart] = useState(false);
    const changeHeart = () => {
        setHeart(heart => !heart);
    };

    function heartBtn() {
        if(!heart) {
            return <img id={styles.heart} src={emptyHeart} alt="emptyHeart" onClick={() => changeHeart()}></img>;
        }
        else {
            return <img id={styles.heart} src={fullHeart} alt="fullHeart" onClick={() => changeHeart()}></img>;
        }
    };

    return(
        <>
            <div className={styles.studyBox} key={keyNum}>
                {heartBtn()}
                <a>{keyNum}</a>
                <h1 className={styles.studyTitle}>{title}</h1>
                <div className={styles.tagPackage}>
                    <a className={styles.studyTag}>#{tag}</a>
                </div>
                <div className={styles.reaction}>
                    <img className={styles.view} src={view} alt="view"></img>
                    <a>{viewCount}</a>
                    <img className={styles.comment} src={comment} alt="comment"></img>
                    <a>{commentCount}</a>
                </div>
            </div>
        </>
    );
}

StudyRoomCard.propTypes = {
    keyNum: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};
export default StudyRoomCard;