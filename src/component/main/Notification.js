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
      {hook.rendData.map((x, i) => {
        return (
          <div
            key={x.id + i}
            className={`${styles.smallContainer} ${
              x.read === 0 && styles.unRead
            }`}
            onClick={() => {
              x.read === 0 && hook.setReadComm(!hook.readComm);
              x.read = 1;
            }}
          >
            {" "}
            {/* onClick={()=>window.open(x.url)} 나중에 URL 추가하고 활성화 */}
            <div className={styles.title}>
              {x.type === "comment" && (
                <div>
                  <VscCommentDiscussion /> 새로운 댓글이 달렸어요!
                </div>
              )}
            </div>
            <div>
              {x.content.length >= 70
                ? x.content.substring(0, 70) + "..."
                : x.content}
            </div>
            <div className={styles.time}>{x.time}</div>
          </div>
        );
      })}
      <Paginator hook={hook} />
    </div>
  );
};

export default Notification;