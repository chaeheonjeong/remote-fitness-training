import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {HiOutlineHeart} from "react-icons/hi";
import {HiHeart} from "react-icons/hi";
import {HiOutlineEye} from "react-icons/hi";
import {HiOutlineChat} from "react-icons/hi";
import styles from "./QuestionRoomCard.module.css";
import "./InfiniteScroll.css";
import { Fragment } from "react";
import axios from "axios";
import userStore from "../../store/user.store";
import { BASE_API_URI } from "../../util/common";

function QuestionRoomCard({ title, tags, id, onClick }) {
  const user = userStore();

  const [heart, setHeart] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const changeHeart = () => {
    setHeart(!heart);
  };

  const clickHeart = () => {
    if (user.token !== null) {
      axios
        .post(`${BASE_API_URI}0/setGood/${id}`, null, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            console.log(id);
            setHeart(!heart);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("로그인 해주세요.");
      setHeart(false);
    }
  };

  // 관심글
  const HeartBtn = () => {
    if (!heart) {
      return (
        <HiOutlineHeart
          className={styles.heart}
          alt="HiOutlineHeart"
          onClick={() => {
            changeHeart();
            clickHeart();
          }}
        />
      );
    } else {
      return (
        <HiHeart
        className={styles.heart}
        alt="HiHeart"
        style={{color: "#8ae52e" }}
        onClick={() => {
          changeHeart();
          clickHeart();
        }}
      />
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
                <a className={styles.questionTag} key={tag.id} id={tag.id}>
                  {"#" + tag}
                </a>
              );
            } else {
              return (
                <a className={styles.questionTag} key={index}>
                  {"#" + tag}
                </a>
              );
            }
          })}
      </div>
    );
  }

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get(`${BASE_API_URI}/getGood/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setHeart(response.data.good);
          } else if (response.status === 204) {
            setHeart(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    Promise.all([
      axios.post(
        `${BASE_API_URI}/getViewCount`,
        { id: id, postName: "question" } // 서버로 전달할 id
      ),
      axios.post(
        `${BASE_API_URI}/getCommentCount`,
        { id: id, postName: "question" } // 서버로 전달할 id
      ),
    ])
      .then(([viewCountResponse, commentCountResponse]) => {
        if (
          viewCountResponse.status === 200 &&
          commentCountResponse.status === 200
        ) {
          setViewCount(viewCountResponse.data.count);

          console.log("조회수: ", viewCountResponse.data.count);
          console.log("댓글수: ", commentCountResponse.data.result);

          setCommentCount(commentCountResponse.data.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div key={id + title} className={styles.questionBoxWrapper}>
      <HeartBtn />
      <div className={styles.questionBox} onClick={onClick && onClick}>
        <h1 className={styles.questionTitle}>
          {title.length > 5 ? title.slice(0, 5) + "..." : title}
        </h1>
        {<Hashtag />}
        <div className={styles.reaction}>
          <HiOutlineEye className={styles.view} alt="HiOutlineEye"/>
          <a style={{color:"#56776C"}}>{viewCount}</a>
          <HiOutlineChat className={styles.comment} alt="HiOutlineChat"/>
          <a style={{color:"#56776C"}}>{commentCount}</a>
        </div>
      </div>
    </div>
  );
}

export default QuestionRoomCard;
