import { noti } from "../../util/dummy";
import styles from "./Notification.module.css";
import { VscCommentDiscussion } from "react-icons/vsc";
import { useState } from "react";
import useNoti from "../../hooks/useNoti";
import Paginator from "../common/Paginator";
import { BsJustify } from "react-icons/bs";

const Notification = () => {
  const hook = useNoti();
  return (
    <>
      <div className={styles.notiTitle}>알림</div>
      <div className={styles.notiWrapper}>
        {hook.rendData === null ? (
          <div>알림이 없습니다.</div>
        ) : (
          hook.rendData.map((x, i) => {
            return (
              <div
                key={x._id /*.id  + i */}
                className={`${styles.smallContainer} ${
                  x.read === false && styles.unRead
                }`}
                onClick={() => {
                  x.read === false &&
                    hook.handleReadComm(
                      x._id
                    ) /* hook.setReadComm(!hook.readComm) */;
                  x.read = true;
                  if (x.location === undefined) {
                    window.open(`/${x.postCategory}`);
                  } else {
                    window.open(`/${x.postCategory}/${x.location}`);
                  }
                }}
              >
                {" "}
                {/* onClick={()=>window.open(x.url)} 나중에 URL 추가하고 활성화 */}
                <div className={styles.title}>
                  {/* {x.type === "comment" && ( */}
                  <div className={styles.titleWrapper}>
                    <VscCommentDiscussion style={{ strokeWidth: "0.4px" }} />{" "}
                    {"    "}
                    <span style={{ fontWeight: "590" }}>{x.title}</span>
                  </div>
                  {/* )} */}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    {console.log("+ ", x.message)}
                    {x.message.length >= 70
                      ? x.message.substring(0, 70) + "..."
                      : x.message}
                  </div>
                  {x.role === "student" ? (
                    <div>
                      <button
                        onClick={() => {
                          hook.handlePreBtn(
                            x._id
                          ) /* hook.setReadComm(!hook.readComm) */;
                        }}
                        className={styles.preBtn}
                      >
                        선금 결제하기
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className={styles.time}>{x.createAt}</div>
                {x.role === 'student' ? (
                  <div>
                     <button  onClick={() => {
                      hook.handlePreBtn(x._id);
                      console.log("클릭했어요");
                    }}>선금</button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            );
          })
        )}
      </div>
      <Paginator hook={hook} />
    </>
  );
};

export default Notification;
