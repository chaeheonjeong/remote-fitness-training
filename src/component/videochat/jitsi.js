import React, { useEffect, useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

function VideoChat () {
  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState('');

  return(
    <JitsiMeeting
    domain='meet.jit.si'
    roomName='jitsiMeetingRoom'
    configOverwrite={{
      startWithAudioMuted : true,
      disableModeratorIndicator : true,
      startScreenSharing : true,
      enableEmailInstats : false
    }}
    interfaceConfigOverwrite={{
      DISABLE_JOIN_LEAVE_NOTIFICATIONS : true
    }}
    userInfo={{
      displayName: 'goeun'
    }}
    onApiReady={ (externalApi) => {

    }}
    getIFrameRef={(iframeRef) => {
      iframeRef.style.height = '710px';
    }}
    />
  );
};

export default VideoChat;