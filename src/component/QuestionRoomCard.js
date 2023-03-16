import { useState } from "react";
import PropTypes from "prop-types";

import emptyHeart from "../images/emptyHeart.png";
import fullHeart from "../images/heart.png";
import view from "../images/view.png";
import comment from "../images/comment.png";

import styles from "./QuestionRoomCard.module.css";
import "./InfiniteScroll.css";

function QuestionRoomCard({ keyNum, title }) {
    const tag = "태그";
    const viewCount = 10;
    const commentCount = 3;
    title = "Hello";

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
            <div className={styles.questionBox} key={keyNum}>
                {heartBtn()}
                <h1 className={styles.questionTitle}>{title}</h1>
                <div className={styles.tagPackage}>
                    <a className={styles.quesitonTag}>#{tag}</a>
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

QuestionRoomCard.propTypes = {
    keyNum: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};
export default QuestionRoomCard;