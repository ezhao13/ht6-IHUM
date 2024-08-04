import React, { useState, useRef, useEffect } from 'react';
import { PitchDetector } from 'pitchy';
import './Home.css';


const INSTRUMENTS = {
  piano: 'sawtooth',
  guitar: 'triangle',
  flute: 'sine',
  violin: 'sine',
  bass: 'sawtooth',
  synth: 'sine',
};

function Home() {
  const [instrument, setInstrument] = useState('piano');
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedAudio(url);
      await convertMp3ToInstrument(file);
    }
  };

  const convertMp3ToInstrument = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 4096;
    source.connect(analyser);
    
    const pitchDetector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(pitchDetector.inputLength);

    source.start();

    const processAudio = () => {
      analyser.getFloatTimeDomainData(input);
      const [pitch, clarity] = pitchDetector.findPitch(input, audioContextRef.current.sampleRate);
      if (pitch !== null && clarity > 0.9) {
        playInstrumentSound(pitch);
      }
      if (source.playbackState === source.PLAYING_STATE) {
        requestAnimationFrame(processAudio);
      }
    };

    source.onended = () => {
      stopPlaying();
    };

    processAudio();
    setIsPlaying(true);
  };

  const playInstrumentSound = (pitch) => {
    const instrumentFunctions = {
      piano: playPianoSound,
      guitar: playGuitarSound,
      flute: playFluteSound,
      violin: playViolinSound,
      bass: playBassSound,
      synth: playSynthSound,
    };

    const playSound = instrumentFunctions[instrument];
    if (playSound) {
      playSound(pitch);
    }
  };

  const createOscillator = (type, pitch) => {
    if (!oscillatorRef.current) {
      oscillatorRef.current = audioContextRef.current.createOscillator();
      gainNodeRef.current = audioContextRef.current.createGain();
      filterRef.current = audioContextRef.current.createBiquadFilter();

      oscillatorRef.current.type = type;
      oscillatorRef.current.connect(filterRef.current);
      filterRef.current.type = 'lowpass';
      filterRef.current.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      filterRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);

      oscillatorRef.current.start();
    }

    oscillatorRef.current.frequency.setValueAtTime(pitch, audioContextRef.current.currentTime);
    gainNodeRef.current.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
  };

  const playPianoSound = (pitch) => {
    createOscillator('sawtooth', pitch);
  };

  const playGuitarSound = (pitch) => {
    createOscillator('triangle', pitch);
  };

  const playFluteSound = (pitch) => {
    createOscillator('sine', pitch);
  };

  const playViolinSound = (pitch) => {
    createOscillator('sine', pitch);
  };

  const playBassSound = (pitch) => {
    createOscillator('sawtooth', pitch);
  };

  const playSynthSound = (pitch) => {
    createOscillator('sine', pitch);
  };

  const stopPlaying = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudio(audioUrl);
          audioChunksRef.current = [];
          await convertMp3ToInstrument(audioBlob);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">MP3 to Instrument Converter</h1>
      <label className="home-input-label" htmlFor="home-input">
        Choose File
      </label>
      <input id="home-input" type="file" accept="audio/mp3" onChange={handleFileUpload} className="home-input"/> 

      <select value={instrument} onChange={(e) => setInstrument(e.target.value)} className="home-dropdown">
        {Object.keys(INSTRUMENTS).map((inst) => (
          <option key={inst} value={inst}>
            {inst.charAt(0).toUpperCase() + inst.slice(1)}
          </option>
        ))}
      </select>
      {uploadedAudio && (
        <div>
          <h2 className = "home-upload">Uploaded Audio:</h2>
          <audio src={uploadedAudio} controls />
        </div>
      )}
      {recordedAudio && (
        <div>
          <h2 className = "home-upload">Recorded Audio:</h2> 
          <audio src={recordedAudio} controls />
        </div>
      )}
      <button onClick={stopPlaying} disabled={!isPlaying} className = "home-stop-button">Stop Playing</button>
      <button onClick={isRecording ? stopRecording : startRecording} className = "home-button">
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
}

export default Home;




// import React, { useState, useRef, useEffect } from 'react';
// import * as Tone from 'tone';
// import { PitchDetector } from 'pitchy';

// const INSTRUMENTS = {
//   piano: 'Sampler',
//   guitar: 'AMSynth',
//   flute: 'FMSynth',
//   violin: 'MonoSynth',
//   bass: 'DuoSynth',
//   synth: 'PolySynth',
// };

// function App() {
//   const [instrument, setInstrument] = useState('piano');
//   const [uploadedAudio, setUploadedAudio] = useState(null);
//   const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
//   const [isPlayingConverted, setIsPlayingConverted] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedAudio, setRecordedAudio] = useState(null);
//   const audioContextRef = useRef(null);
//   const synthRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const [analyzedPitches, setAnalyzedPitches] = useState([]);

//   useEffect(() => {
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//     }
//     audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//     synthRef.current = createSynth();
//   }, [instrument]);

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setUploadedAudio(url);
//       await processAudioFile(file);
//     }
//   };

//   const processAudioFile = async (file) => {
//     const arrayBuffer = await file.arrayBuffer();
//     const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
    
//     const source = audioContextRef.current.createBufferSource();
//     source.buffer = audioBuffer;

//     const analyser = audioContextRef.current.createAnalyser();
//     analyser.fftSize = 4096;
//     source.connect(analyser);

//     const pitchDetector = PitchDetector.forFloat32Array(analyser.fftSize);
//     const input = new Float32Array(pitchDetector.inputLength);

//     source.start();

//     const pitches = [];
//     const processAudio = () => {
//       analyser.getFloatTimeDomainData(input);
//       const [pitch, clarity] = pitchDetector.findPitch(input, audioContextRef.current.sampleRate);
//       if (pitch !== null && clarity > 0.9) {
//         pitches.push(pitch);
//       }
//       if (source.playbackState === source.PLAYING_STATE) {
//         requestAnimationFrame(processAudio);
//       }
//     };

//     source.onended = () => {
//       setAnalyzedPitches(pitches);
//     };

//     processAudio();
//   };

//   const playInstrumentSound = () => {
//     setIsPlayingConverted(true);
//     analyzedPitches.forEach((pitch, index) => {
//       setTimeout(() => {
//         if (synthRef.current) {
//           synthRef.current.triggerAttackRelease(Tone.Frequency(pitch, "midi").toFrequency(), '8n');
//         }
//       }, index * 200); // Adjust the timing as needed
//     });
//   };

//   const createSynth = () => {
//     switch (instrument) {
//       case 'piano':
//         return new Tone.Sampler({
//           urls: {
//             C4: 'C4.mp3',
//             D4: 'Ds4.mp3',
//             F4: 'Fs4.mp3',
//             A4: 'A4.mp3',
//           },
//           baseUrl: 'https://tonejs.github.io/audio/salamander/',
//         }).toDestination();
//       case 'guitar':
//         return new Tone.AMSynth().toDestination();
//       case 'flute':
//         return new Tone.FMSynth().toDestination();
//       case 'violin':
//         return new Tone.MonoSynth().toDestination();
//       case 'bass':
//         return new Tone.DuoSynth().toDestination();
//       case 'synth':
//         return new Tone.PolySynth().toDestination();
//       default:
//         return new Tone.Synth().toDestination();
//     }
//   };

//   const stopPlayingOriginal = () => {
//     if (uploadedAudio) {
//       const audio = document.getElementById('uploaded-audio');
//       audio.pause();
//       audio.currentTime = 0;
//       setIsPlayingOriginal(false);
//     }
//   };

//   const stopPlayingConverted = () => {
//     if (synthRef.current) {
//       synthRef.current.releaseAll();
//     }
//     setIsPlayingConverted(false);
//   };

//   const startRecording = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         mediaRecorderRef.current = new MediaRecorder(stream);
//         mediaRecorderRef.current.ondataavailable = (event) => {
//           audioChunksRef.current.push(event.data);
//         };
//         mediaRecorderRef.current.onstop = async () => {
//           const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//           const audioUrl = URL.createObjectURL(audioBlob);
//           setRecordedAudio(audioUrl);
//           audioChunksRef.current = [];
//           await processAudioFile(audioBlob);
//         };
//         mediaRecorderRef.current.start();
//         setIsRecording(true);
//       });
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setIsRecording(false);
//   };

//   return (
//     <div className="App">
//       <h1>MP3 to Instrument Converter</h1>
//       <input type="file" accept="audio/mp3" onChange={handleFileUpload} />
//       <select value={instrument} onChange={(e) => setInstrument(e.target.value)}>
//         {Object.keys(INSTRUMENTS).map((inst) => (
//           <option key={inst} value={inst}>
//             {inst.charAt(0).toUpperCase() + inst.slice(1)}
//           </option>
//         ))}
//       </select>
//       {uploadedAudio && (
//         <div>
//           <h2>Uploaded Audio:</h2>
//           <audio id="uploaded-audio" src={uploadedAudio} controls />
//           <button onClick={stopPlayingOriginal} disabled={!uploadedAudio || isPlayingOriginal}>
//             Stop Original Audio
//           </button>
//         </div>
//       )}
//       {recordedAudio && (
//         <div>
//           <h2>Recorded Audio:</h2>
//           <audio src={recordedAudio} controls />
//         </div>
//       )}
//       <button onClick={stopPlayingConverted} disabled={!isPlayingConverted}>Stop Converted Audio</button>
//       <button onClick={isRecording ? stopRecording : startRecording}>
//         {isRecording ? 'Stop Recording' : 'Start Recording'}
//       </button>
//       <button onClick={playInstrumentSound} disabled={isPlayingConverted || analyzedPitches.length === 0}>
//         Play Converted Audio
//       </button>
//     </div>
//   );
// }

// export default App;

