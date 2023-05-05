import React, { useState, useRef, useEffect, useCallback } from "react";
import io from "socket.io-client";
import Video from "./Video";
import { create } from "zustand";

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
const SOCKET_SERVER_URL = "http://localhost:5050";

const RTCChat = () => {
  const socketRef = useRef();
  const pcsRef = useRef({});
  const localVideoRef = useRef(null);
  const localStreamRef = useRef();
  const [users, setUsers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [audioTrack, setAudioTrack] = useState(null);
  const [remoteMuted, setRemoteMuted] = useState(false);
  const [isActive, setIsActive] = useState({});

  const getLocalStream = useCallback(async () => {
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
      socketRef.current.emit("join_room", {
        room: "1234",
        email: "sample@naver.com",
      });

      const audioTrack = localStream.getAudioTracks()[0];
      setAudioTrack(audioTrack);
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getVideoTracks().forEach((track) => {
      if (visible) {
        track.enabled = false;
      } else {
        track.enabled = true;
      }
    });

    setVisible(!visible);
  }, [visible]);

  const toggleMic = useCallback(() => {
    setMuted(!muted); // 버튼 클릭 시 muted 값 toggle

    // localStream이 있을 때, 모든 audioTrack의 enabled를 muted와 반대 값으로 변경
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });

      setAudioTrack((audioTrack) => {
        const newAudioTrack = audioTrack.clone();
        newAudioTrack.enabled = !muted;
        return newAudioTrack;
      });

      socketRef.current.emit("toggle_mic", { room: "1234", muted: !muted }); // 마이크 음소거 상태를 서버로 전달
    }
  }, [muted, socketRef, localStreamRef, pcsRef, setAudioTrack]);

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
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              email,
              stream: e.streams[0],
              isMuted: remoteMuted,
            })
        );
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
            offerSendEmail: "offerSendSample@sample.com",
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
  }, [socketRef]);

  // useEffect(() => {
  //   getLocalStream();
  // }, [visible]);
  return (
    <div>
      <video
        style={{
          width: 240,
          height: 240,
          margin: 5,
          backgroundColor: "black",
        }}
        muted={muted}
        ref={localVideoRef}
        autoPlay
      />
      <button onClick={toggleCamera}>
        {visible ? "카메라 끄기" : "카메라 켜기"}
      </button>
      <button onClick={toggleMic}>
        {muted ? "마이크 켜기" : "마이크 끄기"}
      </button>
      {users.map((user, index) => (
        <Video
          key={index}
          email={user.email}
          stream={user.stream}
          isMuted={user.isMuted}
          isActive={isActive[user.id]}
        />
      ))}
    </div>
  );
};

export default RTCChat;
