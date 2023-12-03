import React, { useState, useRef } from 'react';

const VideoRecorder = () => {
  const videoRef = useRef();
  const mediaRecorderRef = useRef(null);
  const [isRecording, setRecording] = useState(false);
  const [mediaChunks, setMediaChunks] = useState([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setMediaChunks((prevChunks) => [...prevChunks, e.data]);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          // No automatic download, handle this separately
        };

        mediaRecorderRef.current.start();
        setRecording(true);
      })
      .catch((error) => console.error('Error accessing camera:', error));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleDownload = () => {
    if (mediaChunks.length > 0) {
      const blob = new Blob(mediaChunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recorded-media.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      <div>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        <button onClick={handleDownload} disabled={mediaChunks.length === 0}>
          Download
        </button>
      </div>
    </div>
  );
};

export default VideoRecorder;





// import "./App.css";
// import { useState, useRef } from "react";
// import VideoRecorder from "../src/VideoRecorder";
// import AudioRecorder from "../src/AudioRecorder";

// const App = () => {
//     let [recordOption, setRecordOption] = useState("video");
//     const toggleRecordOption = (type) => {
//         return () => {
//             setRecordOption(type);
//         };
//     };
//     return (
//         <div>
//             <h1>React Media Recorder</h1>
//             <div className="button-flex">
//                 <button onClick={toggleRecordOption("video")}>
//                   Record Video
//                 </button>
//                 <button onClick={toggleRecordOption("audio")}>
//                   Record Audio
//                 </button>
//             </div>
//             <div>
//                 {recordOption === "video" ? <VideoRecorder /> : <AudioRecorder />}
//             </div>
//         </div>
//     );
// };
// export default App;

// import { useRef, useEffect } from 'react';

// export default function App() {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const getUserMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({video: true});
//         videoRef.current.srcObject = stream;
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getUserMedia();
//   }, []);

//   return (
//     <div>
//       <video 
//         ref={videoRef}
//         autoPlay
//       />
//     </div>
//   );
// }