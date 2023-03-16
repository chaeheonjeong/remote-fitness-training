import { useState } from "react";
import PropTypes from "prop-types";

import styles from  "./OpenStudyRoomCard.module.css";
import "./InfiniteScroll.css";

import emptyHeart from "../images/emptyHeart.png";
import fullHeart from "../images/heart.png";

function OpenStudyRoomCard({ keyNum, title, total, participants }) {
    const tag = "태그";

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
            <div className={styles.openStudyBox} key={keyNum}>
                {heartBtn()}
                <a className={styles.participants}>{participants}/{total}</a>
                <a>{keyNum}</a>
                <div className={styles.openStudyImg}>스터디 사진</div>
                <h3 className={styles.roomTitle}>{title}</h3>
                <a className={styles.openStudyTag}>#{tag}</a>
            </div>
        </>
    );
}

OpenStudyRoomCard.propTypes = {
    keyNum: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    total: PropTypes.string.isRequired,
    participants: PropTypes.number.isRequired,
};
export default OpenStudyRoomCard;