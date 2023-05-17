import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BiMicrophone } from "react-icons/bi";
import { BiMicrophoneOff } from "react-icons/bi";

export const Container = styled.div`
  position: relative;

  width: 100%;
  margin: 5px;
`;

export const VideoContainer = styled.video`
  width: 100%;
  background-color: black;
`;

export const UserLabel = styled.p`
  display: inline-block;
  position: absolute;
  top: 250px;
  left: 0px;
`;

const Video = ({
  email,
  stream,
  isMuted,
  selectClickHandler,
  num,
  select,
  speaking,
  videoStyle,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);


  return (
    <Container
      className={`m-[10px] aspect-square w-full float-left ${
        select !== 0 && select !== num && "hidden"
      }`}
      style={{
        maxWidth: select === num ? `600px` : videoStyle.box,
      }}
      onClick={() => selectClickHandler(num)}
    >
      <div className=" aspect-square w-full relative">
        <VideoContainer
          ref={ref}
          muted={isMuted}
          autoPlay
          style={{
            border: select === num ? "red" : "none",
            outline: speaking ? "solid #8ae52e 3px" : "none",
            display: "flex",
            borderRadius: "10px",
          }}
        />
        <div className="flex flex-row items-center justify-between px-3 bg-gray-200 rounded-b-[10px] bg-opacity-80 absolute bottom-0 w-full">
          <div
            style={{
              display: "flex",
            }}
          >
            {email}
          </div>
          <div>
            {isMuted ? (
              <BiMicrophoneOff
                size="20"
                color="#5a5a5a"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <BiMicrophone
                size="20"
                color="#5a5a5a"
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Video;
