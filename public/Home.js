import React, { useState, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import * as Tone from 'tone';

const INSTRUMENTS = [
  { name: 'Piano', type: 'triangle' },
  { name: 'Guitar', type: 'sawtooth' },
  { name: 'Flute', type: 'sine' },
  { name: 'Violin', type: 'sawtooth' },
  { name: 'Bass', type: 'square' },
  { name: 'Synth', type: 'square' },
  { name: 'Clarinet', type: 'triangle' },
  { name: 'Trumpet', type: 'sawtooth' },
  { name: 'Oboe', type: 'sine' },
  { name: 'Harp', type: 'triangle' },
  { name: 'Cymbal', type: 'sine' },
  { name: 'Cello', type: 'sawtooth' },
  { name: 'Saxophone', type: 'square' },
  { name: 'Accordion', type: 'sine' },
  { name: 'Banjo', type: 'sawtooth' },
];

const Home = () => {
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const pitchRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedAudio(url);
      await convertMp3ToInstrument(file);
    }
  };

  const convertMp3ToInstrument = async (file) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyser.connect(audioContextRef.current.destination);

    const pitchDetector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(pitchDetector.inputLength);

    source.start();

    const processAudio = () => {
      analyser.getFloatTimeDomainData(input);
      const [pitch, clarity] = pitchDetector.findPitch(input, audioContextRef.current.sampleRate);
      if (pitch !== null && clarity > 0.8) {
        pitchRef.current = pitch;
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

  const playInstrumentSound = async (selectedInstrument) => {
    if (!audioContextRef.current) {
      return;
    }

    if (pitchRef.current) {
      await Tone.start();
      const synth = new Tone.Synth({
        oscillator: {
          type: selectedInstrument.type,
        },
      }).toDestination();

      synth.triggerAttackRelease(pitchRef.current, '8n');
    }
  };

  const stopPlaying = () => {
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Convert MP3 to Instrument Sound</h2>
      <input
        type="file"
        accept="audio/mp3"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {uploadedAudio && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Uploaded Audio:</h3>
          <audio src={uploadedAudio} controls className="w-full max-w-lg" />
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.name}
            onClick={() => playInstrumentSound(inst)}
            disabled={!isPlaying || !pitchRef.current}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {inst.name}
          </button>
        ))}
      </div>
      <button
        onClick={stopPlaying}
        disabled={!isPlaying}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Stop Playing
      </button>
    </div>
  );
};

export default Home;
