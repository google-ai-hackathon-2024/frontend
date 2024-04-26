import React from 'react';
import { VoiceRecorder } from 'react-voice-recorder-player';

function AudioRecorder() {
  const styles = {
    mainContainerStyle: {
      backgroundColor: 'gray',
      border: '1px solid black',
      borderRadius: '5px',
      padding: '10px'
    },
    controllerContainerStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px'
    },
    controllerStyle: {
      backgroundColor: 'white',
      border: '1px solid black',
      borderRadius: '5px',
      cursor: 'pointer',
      padding: '5px'
    },
    waveContainerStyle: {
      height: '100px',
      marginTop: '10px',
      width: '100%'
    }
  };

  return (
    <VoiceRecorder
      mainContainerStyle={styles.mainContainerStyle}
      controllerContainerStyle={styles.controllerContainerStyle}
      controllerStyle={styles.controllerStyle}
      waveContainerStyle={styles.waveContainerStyle}
    />
  );
}

export default AudioRecorder;
