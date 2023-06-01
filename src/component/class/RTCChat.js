import React, { useState, useRef, useEffect, useCallback } from "react";
import io from "socket.io-client";
import styles from "./RTCChat.module.css";
import Video, {
  Container,
  UserLabel,
  VideoContainer,
  activeStyle,
} from "./Video";
import { BsCameraVideo } from "react-icons/bs";
import { BsCameraVideoOff } from "react-icons/bs";
import { BsMic } from "react-icons/bs";
import { BsMicMute } from "react-icons/bs";
import { RxExit } from "react-icons/rx";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import userStore from "../../store/user.store";
import ChangeTime from "./ChangeTime";
import { BASE_API_URI_CAM } from "../../util/common";
import { BASE_API_URI } from "../../util/common";
import axios from "axios";
import socket from "socket.io-client/lib/socket";
import TimeoutModal from "./TimeoutModal";
import { HiOutlinePhoneMissedCall } from "react-icons/hi";

const pc_config = {
  iceServers: [
    // {
    //   urls: 'stun:[STUN_IP]:[PORT]',
    //   'credentials': '[YOR CREDENTIALS]',
    //   'username': '[USERNAME]'
    // },
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
const SOCKET_SERVER_URL = BASE_API_URI_CAM;

const RTCChat = () => {
  const socketRef = useRef();
  const { roomTitle } = useParams();
  const pcsRef = useRef({});
  const localVideoRef = useRef(null);
  const localStreamRef = useRef();
  const [users, setUsers] = useState([]);
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(false);
  const [audioTrack, setAudioTrack] = useState(null);
  const [remoteMuted, setRemoteMuted] = useState(false);
  const [isActive, setIsActive] = useState({});
  const [chatMsgs, setChatMsgs] = useState([]);
  const [msg, setMsg] = useState("");
  const [select, setSelect] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState([]);
  const [videoStyle, setVideoStyle] = useState({
    wrapper: "900px",
    box: "300px",
    px: "290px",
  });
  const userMe = userStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const setTime = (h, m) => {
    setHour(h);
    setMinute(m);
  };
  const [showModal, setShowModal] = useState(false); // 모달 보이기/감추기 상태

  const handleModalConfirm = () => {
    // 모달 확인 버튼 클릭 시 수행되는 로직
    navigate("/MyCalendar"); // navigate 호출 예시
  };

  const meetingOffHandler = () => {
    const confirmClose = window.confirm("화상미팅을 종료하시겠습니까?");
    if (confirmClose) {
      const closeData = {
        room: roomTitle,
      };
      if (socketRef.current !== undefined) {
        console.log(closeData.room);
        socketRef.current.emit("close_meeting", roomTitle);
      }
      axios
        .post(`${BASE_API_URI}/meetingClose`, {
          roomTitle: roomTitle,
        })
        .catch((error) => {
          console.error(error);
        });
      navigate("/MyCalendar");
    }
  };

  useEffect(() => {
    const timeData = {
      hour: hour,
      minute: minute,
      room: roomTitle,
    };

    if (socketRef.current !== undefined) {
      socketRef.current.emit("change_time", timeData);
    }

    axios
      .post(`${BASE_API_URI}/get-time`, { roomTitle: roomTitle })
      .then((response) => {
        if (response.status === 200) {
          setHour(response.data.hour);
          setMinute(response.data.minute);

          console.log(hour, minute);

          const currentTime = new Date();
          const finishTime = new Date(currentTime);
          finishTime.setHours(currentTime.getHours() + response.data.hour);
          finishTime.setMinutes(
            currentTime.getMinutes() + response.data.minute
          );

          if (finishTime.getMinutes() >= 60) {
            finishTime.setHours(finishTime.getHours() + 1);
            finishTime.setMinutes(finishTime.getMinutes() - 60);
          }

          const timer = setInterval(() => {
            const current = new Date();
            if (
              current.getHours() === finishTime.getHours() &&
              current.getMinutes() === finishTime.getMinutes()
            ) {
              setShowModal(true);
              clearInterval(timer);
            }
          }, 1000);

          return () => {
            clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
          };
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [hour, minute]);

  const clickTime = () => {
    axios
      .post(`${BASE_API_URI}/get-time`, { roomTitle: roomTitle })
      .then((response) => {
        if (response.status === 200) {
          setHour(response.data.hour);
          setMinute(response.data.minute);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // 4명 wrapper-800px, box-300px, px-80px
    // 3명 wrapper-900px, box-250px, px-45px
    // 2명 wrapper-900px, box-300px, px-130px
    // 1명 wrapper-900px, box-300px, px-290px
    if (users.length > 2)
      setVideoStyle({ wrapper: "800px", box: "300px", px: "80px" });
    else if (users.length > 1)
      setVideoStyle({ wrapper: "900px", box: "250px", px: "45px" });
    else if (users.length > 0)
      setVideoStyle({ wrapper: "900px", box: "300px", px: "130px" });
    else if (users.length === 0)
      setVideoStyle({ wrapper: "900px", box: "300px", px: "290px" });
  }, [users]);

  useEffect(() => {
    console.log("speaking");
  }, [speaking]);

  const navigate = useNavigate();

  const selectClickHandler = (num) => {
    if (select === num) setSelect(0);
    else setSelect(num);
  };

  const msgClickHandler = () => {
    socketRef.current.emit("chat_send", {
      room: roomTitle,
      msg: msg,
      name: userMe.name,
    });
    const arr = [...chatMsgs];
    arr.push({ from: "(나)", msg: msg });
    setChatMsgs(arr);
    setMsg("");
  };

  const getLocalStream = useCallback(async (bool) => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 240,
          height: 240,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      if (!socketRef.current) return;
      !bool &&
        socketRef.current.emit("join_room", {
          room: roomTitle,
          email: `${userMe.name}`,
        });

      // !bool && checkTalking(localStream);
      const audioTrack = localStream.getAudioTracks()[0];
      setAudioTrack(audioTrack);
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;

    setVisible((prevVisible) => !prevVisible);

    setTimeout(() => {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = visible;
      });
    }, 0);
  }, [visible]);

  // useEffect(() => {
  //   console.log(audioTrack);
  // }, [audioTrack]);

  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;

    setMuted((prevMuted) => !prevMuted);

    socketRef.current.emit("toggle_mic", { room: roomTitle, muted: !muted });
  }, [muted, socketRef]);

  const createPeerConnection = useCallback((socketID, email) => {
    try {
      const pc = new RTCPeerConnection(pc_config);

      pc.onicecandidate = (e) => {
        if (!(socketRef.current && e.candidate)) return;
        console.log("onicecandidate");
        socketRef.current.emit("candidate", {
          candidate: e.candidate,
          candidateSendID: socketRef.current.id,
          candidateReceiveID: socketID,
        });
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          if (pcsRef.current[socketID]) {
            pcsRef.current[socketID].close();
            delete pcsRef.current[socketID];
          }
          setUsers((oldUsers) =>
            oldUsers.filter((user) => user.id !== socketID)
          );
          setAudioTrack((audioTrack) => {
            const newAudioTrack = audioTrack.clone();
            newAudioTrack.enabled = true;
            return newAudioTrack;
          });
          setIsActive((isActive) => ({
            ...isActive,
            [socketID]: false,
          }));
        }
      };

      pc.ontrack = (e) => {
        console.log("ontrack success");
        setUsers((oldUsers) => {
          const arr = [...oldUsers];
          console.log(arr);
          console.log(socketID);
          const newArr = arr.map((x) => {
            if (x.id === socketID) {
              return {
                id: x.id,
                email: x.email,
                stream: e.streams[0],
                isMuted: x.isMuted ?? true,
              };
            } else return { ...x };
          });
          const findUser = newArr.find((x) => x.id === socketID);
          if (!findUser)
            newArr.push({
              id: socketID,
              email,
              stream: e.streams[0],
              isMuted: true,
            });
          console.log(newArr);
          return newArr;
        });
        setIsActive((isActive) => ({
          ...isActive,
          [socketID]: true,
        }));
      };

      if (localStreamRef.current) {
        console.log("localstream add");
        localStreamRef.current.getTracks().forEach((track) => {
          if (!localStreamRef.current) return;
          pc.addTrack(track, localStreamRef.current);
        });
      } else {
        console.log("no local stream");
      }

      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, []);

  useEffect(() => {
    socketRef.current = io.connect(SOCKET_SERVER_URL);
    getLocalStream();

    socketRef.current.on("all_users", (allUsers) => {
      allUsers.forEach(async (user) => {
        if (!localStreamRef.current) return;
        const pc = createPeerConnection(user.id, user.email);
        if (!(pc && socketRef.current)) return;
        pcsRef.current = { ...pcsRef.current, [user.id]: pc };
        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          console.log("create offer success");
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          socketRef.current.emit("offer", {
            sdp: localSdp,
            offerSendID: socketRef.current.id,
            offerSendEmail: userMe.name,
            offerReceiveID: user.id,
          });
        } catch (e) {
          console.error(e);
        }
      });
    });

    socketRef.current.on("getOffer", async (data) => {
      const { sdp, offerSendID, offerSendEmail } = data;
      console.log("get offer");
      if (!localStreamRef.current) return;
      const pc = createPeerConnection(offerSendID, offerSendEmail);
      if (!(pc && socketRef.current)) return;
      pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("answer set remote description success");
        const localSdp = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        socketRef.current.emit("answer", {
          sdp: localSdp,
          answerSendID: socketRef.current.id,
          answerReceiveID: offerSendID,
        });
      } catch (e) {
        console.error(e);
      }
    });

    socketRef.current.on("getAnswer", (data) => {
      const { sdp, answerSendID } = data;
      console.log("get answer");
      const pc = pcsRef.current[answerSendID];
      if (!pc) return;
      pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socketRef.current.on("getCandidate", async (data) => {
      console.log("get candidate");
      const pc = pcsRef.current[data.candidateSendID];
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      console.log("candidate add success");
    });

    socketRef.current.on("user_exit", (data) => {
      if (!pcsRef.current[data.id]) return;
      pcsRef.current[data.id].close();
      delete pcsRef.current[data.id];
      setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      users.forEach((user) => {
        if (!pcsRef.current[user.id]) return;
        pcsRef.current[user.id].close();
        delete pcsRef.current[user.id];
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, getLocalStream]);

  useEffect(() => {
    // 마이크 음소거 상태를 서버로부터 전달받는 이벤트 처리
    socketRef.current.on("mute", ({ id, muted }) => {
      setRemoteMuted(muted);
      setUsers((oldUsers) => {
        return oldUsers.map((user) => {
          if (user.id === id) {
            return { ...user, isMuted: muted };
          }
          return user;
        });
      });
    });

    socketRef.current.on("users_muted_info", (mutedInfo) => {
      // 서버의 참가자 목록이 넘어온다.
      // video, audio XX
      const arr = mutedInfo.map((x) => {
        return { ...x, isMuted: x.isMuted ?? true };
      });

      // 기존 유저에 없고, 새로운 유저에 대한 정보가 온 경우 ????

      // });
      setUsers([...arr]);

      // setUsers((oldUsers) =>
      //   oldUsers.map((user) => {
      //     const mutedUser = mutedInfo.find((info) => info.id === user.id);
      //     const isMuted = mutedUser ? mutedUser.isMuted : false;
      //     return { ...user, isMuted };
      //   })
      // );
    });

    socketRef.current.on("chat_receive", ({ id, msg, name }) => {
      // console.log(chat);
      setChatMsgs((chats) => {
        return [...chats, { from: name, msg }];
      });
    });

    socketRef.current.on("speak", ({ id, speaking }) => {
      setUserSpeaking((prevUserSpeaking) => ({
        ...prevUserSpeaking,
        [id]: speaking,
      }));
    });

    socketRef.current.on("time_changed", (timeData) => {
      // 변경된 시간 정보를 사용하여 필요한 처리 수행
      setHour(timeData.hour);
      setMinute(timeData.minute);
    });

    socketRef.current.on("meeting_closed", (room) => {
      setShowModal(true);
    });
  }, [socketRef]);

  useEffect(() => {
    const context = new AudioContext();
    const analyser = context.createAnalyser();

    // 임계값 설정
    const threshold = 0.01;

    // 입력 신호 크기 측정을 위한 버퍼 생성
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    let timer;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const source = context.createMediaStreamSource(stream);
        source.connect(analyser);

        // 입력 신호의 크기를 주기적으로 측정하여 출력
        timer = setInterval(() => {
          analyser.getFloatTimeDomainData(dataArray);
          const rms = Math.sqrt(
            dataArray.reduce((acc, val) => acc + val * val) / bufferLength
          );

          if (rms > threshold && muted === false) {
            setSpeaking(true);
            socketRef.current.emit("speaking", {
              room: roomTitle,
              speaking: true,
            });
          } else if (rms < threshold || muted === true) {
            setSpeaking(false);
            socketRef.current.emit("speaking", {
              room: roomTitle,
              speaking: false,
            });
          }
        }, 300);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => clearInterval(timer);
  }, [muted, socketRef, speaking]);

  const exitHandler = async () => {
    navigate("/MyCalendar"); // 경로 이동
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.volume = 0;
    }
  }, []);

  return (
    <>
      <div className="h-screen">
        {showModal ? <TimeoutModal onConfirm={handleModalConfirm} /> : null}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            position: "relative",
          }}
          className="h-full"
        >
          <div
            className={`w-full flex flex-col h-full justify-center items-center`}
          >
            <div
              style={{
                position: "relative",
                zIndex: "0",
              }}
              className="w-full flex-1 overflow-hidden flex justify-center items-center gap-2 text-center"
              // className="grid grid-cols-2 grid-flow-row w-full flex-1 overflow-hidden"
            >
              {/* <div
              className="w-[800px] text-center bg-red-200 px-[80px]"
              // 4명 wrapper-800px, box-300px, px-80px
              // 3명 wrapper-900px, box-250px, px-45px
              // 2명 wrapper-900px, box-300px, px-130px
              // 1명 wrapper-900px, box-300px, px-290px
            >
              {new Array(4).fill().map((_, i) => (
                <div
                  className=" max-w-[300px] m-[10px] bg-slate-500 aspect-square w-[500px] float-left relative "
                  key={i}
                ></div>
              ))}
            </div> */}

              <div
                className="text-center"
                style={{
                  width: select === 0 ? videoStyle.wrapper : "640px",
                  height: select !== 0 ? "600px" : "auto",
                  paddingLeft: select === 0 ? videoStyle.px : "20px",
                  paddingRight: select === 0 ? videoStyle.px : "20px",
                }}
              >
                <Container
                  className={`m-[10px] aspect-square w-full float-left ${
                    select !== 0 && select !== 1 && "hidden"
                  }`}
                  style={{
                    maxWidth: select === 1 ? `600px` : videoStyle.box,
                  }}
                  onClick={() => selectClickHandler(1)}
                >
                  <div className=" aspect-square w-full relative">
                    <VideoContainer
                      ref={localVideoRef}
                      muted={muted}
                      autoPlay
                      style={{
                        outline:
                          speaking && !muted ? "solid #8ae52e 3px" : "none",
                        borderRadius: "10px",
                      }}
                    />
                    <div className="flex flex-row items-center justify-between px-3 bg-gray-200 rounded-b-[10px] bg-opacity-80 absolute bottom-0 w-full">
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        {userMe.name} (나)
                      </div>
                      <div>
                        {muted ? (
                          <BsMicMute
                            size="16"
                            width="100"
                            color="#5a5a5a"
                            style={{ cursor: "pointer", strokeWidth: "0.5px" }}
                          />
                        ) : (
                          <BsMic
                            size="16"
                            color="#5a5a5a"
                            style={{ cursor: "pointer", strokeWidth: "0.5px" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Container>
                {users.map((user, index) => {
                  if (index < 3)
                    return (
                      <Video
                        key={index}
                        email={user.email}
                        stream={user.stream}
                        isMuted={user.isMuted}
                        selectClickHandler={selectClickHandler}
                        num={index + 2}
                        select={select}
                        speaking={userSpeaking[user.id]}
                        videoStyle={videoStyle}
                      />
                    );
                })}
              </div>
            </div>
            <div
              className={`bg-white flex h-[90px]
          w-full border border-[rgb(219,219,219)] gap-[30px] justify-center items-center `}
            >
              <button
                onClick={toggleCamera}
                className={`${styles.camearButton} ${
                  visible ? styles.offStyle : ""
                }`}
              >
                {visible ? (
                  <BsCameraVideoOff
                    size="25"
                    color="white"
                    style={{ strokeWidth: "0.15px" }}
                  />
                ) : (
                  <BsCameraVideo
                    size="25"
                    color="#5a5a5a"
                    style={{ strokeWidth: "0.15px" }}
                  />
                )}
              </button>
              <button
                onClick={toggleMic}
                className={`${styles.mikeButton} ${
                  muted ? styles.offStyle : ""
                }`}
              >
                {muted ? (
                  <BsMicMute
                    size="24"
                    color="white"
                    style={{ strokeWidth: "0.2px" }}
                  />
                ) : (
                  <BsMic
                    size="24"
                    color="#5a5a5a"
                    style={{ strokeWidth: "0.2px" }}
                  />
                )}
              </button>
              <button onClick={exitHandler} className={styles.mikeButton}>
                <RxExit size="25" color="#5a5a5a" className={styles.camIcon} />
              </button>
              <div className={styles.timeContainer}>
                {isDropdownOpen && (
                  <ChangeTime
                    originMinute={minute}
                    originHour={hour}
                    handleDropdownToggle={handleDropdownToggle}
                    setOriginTime={setTime}
                    roomTitle={roomTitle}
                  />
                )}
                <button
                  onClick={handleDropdownToggle}
                  className={styles.timeButton}
                >
                  <AiOutlineClockCircle
                    size="27"
                    color="#5a5a5a"
                    style={{ cursor: "pointer" }}
                    onClick={clickTime}
                  />
                </button>
              </div>
              <button onClick={meetingOffHandler} className={styles.closeCam}>
                <HiOutlinePhoneMissedCall
                  size="25"
                  color="white"
                  style={{ cursor: "pointer" }}
                />
              </button>
            </div>
          </div>

          <div
            className={`w-[500px] bg-white flex flex-col h-screen top-0 z-1 right-0 border border-[rgb(219,219,219)]`}
          >
            <div className={styles.chatDivContainer}>
              <div className={styles.chatDiv}>Chat💬</div>
            </div>
            <div className={styles.chatText}>
              {chatMsgs.map((x, i) => {
                return (
                  <div key={i}>
                    <p
                      style={{ whiteSpace: "pre-wrap", paddingBottom: "3px" }}
                    >{`${x.from}님의 메세지 : \n${x.msg}`}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.chatBox}>
              <div className={styles.chatBox2}>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className={styles.chatTextArea}
                  placeholder="여기에 채팅을 입력해주세요..."
                />
                <div className={styles.buttonBox} onClick={msgClickHandler}>
                  <button>보내기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RTCChat;
