import { useState } from "react";
import PropTypes from "prop-types";

import emptyHeart from "../../images/emptyHeart.png";
import fullHeart from "../../images/heart.png";
import view from "../../images/view.png";
import comment from "../../images/comment.png";

import styles from "./QuestionRoomCard.module.css";
import "./InfiniteScroll.css";
import { Fragment } from "react";

function QuestionRoomCard({ title, tags, id, onClick }) {
  const viewCount = 10;
  const commentCount = 3;

  const [heart, setHeart] = useState(false);

  const changeHeart = () => {
    setHeart(!heart);
  };

  // 관심글
  const HeartBtn = () => {
    if (!heart) {
      return (
        <img
          className={styles.heart}
          src={emptyHeart}
          alt="emptyHeart"
          onClick={() => changeHeart()}
        ></img>
      );
    } else {
      return (
        <img
          className={styles.heart}
          src={fullHeart}
          alt="fullHeart"
          onClick={() => changeHeart()}
        ></img>
      );
    }
  };

  // 해시태그
  function Hashtag() {
    return (
      <div className={styles.tagPackage}>
        {tags &&
          tags.map((tag, index) => {
            if (typeof tag === "object" && tag.id) {
              return (
                <a className={styles.studyTag} key={tag.id} id={tag.id}>
                  {"#" + tag}
                </a>
              );
            } else {
              return (
                <a className={styles.studyTag} key={index}>
                  {"#" + tag}
                </a>
              );
            }
          })}
      </div>
    );
  }

  return (
    <div key={id + title} className={styles.questionBoxWrapper}>
      <HeartBtn />
      <div className={styles.questionBox} onClick={onClick && onClick}>
        <h1 className={styles.questionTitle}>{title}</h1>
        {<Hashtag />}
        <div className={styles.reaction}>
          <img className={styles.view} src={view} alt="view"></img>
          <a>{viewCount}</a>
          <img className={styles.comment} src={comment} alt="comment"></img>
          <a>{commentCount}</a>
        </div>
      </div>
    </div>
  );
}

export default QuestionRoomCard;
