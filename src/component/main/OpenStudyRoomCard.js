import { useState } from "react";

import styles from "./OpenStudyRoomCard.module.css";
import "./InfiniteScroll.css";

import emptyHeart from "../../images/emptyHeart.png";
import fullHeart from "../../images/heart.png";

function OpenStudyRoomCard({ img, title, personNum, tags, id }) {
  const [heart, setHeart] = useState(false);

  const changeHeart = () => {
    setHeart(!heart);
  };

  // 관심글
  function heartBtn() {
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
  }

  // 해시태그
  function Hashtag() {
    return (
      <div>
        {tags &&
          tags.map((tag, index) => {
            if (typeof tag === "object" && tag.id) {
              return (
                <a
                  className={styles.openStudyTag}
                  key={tag.id + index}
                  id={tag.id}
                >
                  {"#" + tag}
                </a>
              );
            } else {
              return (
                <a className={styles.openStudyTag} key={index + tag}>
                  {"#" + tag}
                </a>
              );
            }
          })}
      </div>
    );
  }

  return (
    <div className={styles.openStudyBox} key={id}>
      {heartBtn()}
      <a className={styles.participants}>1/{personNum}</a>
      {/* <a>{id}</a> */}
      <div className={styles.openStudyImg}>
        {img ? (
          <img className={styles.openStudyImage} src={img} alt="openStudyImg" />
        ) : null}
      </div>
      <h3 className={styles.roomTitle}>{title}</h3>
      {<Hashtag />}
    </div>
  );
}

export default OpenStudyRoomCard;
