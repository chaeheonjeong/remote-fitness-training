import { noti } from "../../util/dummy";
import styles from "./Notification.module.css";
import { VscCommentDiscussion } from "react-icons/vsc";
import { useState } from "react";
import useNoti from "../../hooks/useNoti";
import Paginator from "../common/Paginator";

const Notification = () => {
  const hook = useNoti();

  return (
    <div>
      {hook.rendData === null ? (
        <div>알림이 없습니다.</div>
      ) : (
        hook.rendData.map((x, i) => {
          console.log("%%%%: ", x);
          return (
              <div
                key={x._id}
                className={`${styles.smallContainer} ${
                  x.read === false && styles.unRead
                }`}
                onClick={() => {
                  x.read === false && hook.handleReadComm(x._id);
                  console.log(x._id);
                  x.read = true;
                }}
              >
                <div className={styles.title}>
                  {x.type === "comment" && (
                    <div>
                      <VscCommentDiscussion /> {x.title}
                    </div>
                  )}
                  {x.type === "write" && (
                    <div>
                      작성자: {x.writer}
                    </div>
                  )}
                </div>
                <div>
                  {console.log(x.message)}
                  {x.message.length >= 70
                    ? x.message.substring(0, 70) + "..."
                    : x.message}
                </div>
                <div className={styles.time}>{x.createAt}</div>
                {x.role === 'student' ? (
                  <div>
                    <button>선금</button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
          );
        })
      )}
      <Paginator hook={hook} />
    </div>
  );
};


export default Notification;