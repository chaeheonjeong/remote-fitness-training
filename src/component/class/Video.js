import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 240px;
  height: 270px;
  margin: 5px;
`;

const VideoContainer = styled.video`
  width: 240px;
  height: 240px;
  background-color: black;
`;

const UserLabel = styled.p`
  display: inline-block;
  position: absolute;
  top: 250px;
  left: 0px;
`;

const Video = ({ email, stream, isMuted }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <Container>
      <VideoContainer ref={ref} muted={isMuted} autoPlay />
      <label>{isMuted ? "음소거" : "마이크 작동"}</label>
      <UserLabel>{email}</UserLabel>
    </Container>
  );
};

export default Video;
