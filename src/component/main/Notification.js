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
<<<<<<< HEAD
        <div>알림이 없습니다.</div>
=======
        <div>알림이없습니다.</div>
>>>>>>> 7d81a0645258fcc1dee7c0944e74780748de6f61
      ) : (
        hook.rendData.map((x, i) => {
          console.log("%%%%: ", x);
          return (
              <div
<<<<<<< HEAD
                key={x._id}
=======
                key={x._id/*.id  + i */}
>>>>>>> 7d81a0645258fcc1dee7c0944e74780748de6f61
                className={`${styles.smallContainer} ${
                  x.read === false && styles.unRead
                }`}
                onClick={() => {
<<<<<<< HEAD
                  x.read === false && hook.handleReadComm(x._id);
=======
                  x.read === false && hook.handleReadComm(x._id)/* hook.setReadComm(!hook.readComm) */;
>>>>>>> 7d81a0645258fcc1dee7c0944e74780748de6f61
                  console.log(x._id);
                  x.read = true;
                }}
              >
<<<<<<< HEAD
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
=======
                {" "}
                {/* onClick={()=>window.open(x.url)} 나중에 URL 추가하고 활성화 */}
                <div className={styles.title}>
                  {/* {x.type === "comment" && ( */}
                    <div>
                      <VscCommentDiscussion /> {x.title}
                    </div>
                  {/* )} */}
>>>>>>> 7d81a0645258fcc1dee7c0944e74780748de6f61
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