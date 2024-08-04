import React, { useState, useRef } from 'react';
import axios from 'axios';

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [generatedMusicURL, setGeneratedMusicURL] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
            audioChunksRef.current = [];
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const generateMusic = async () => {
        if (!audioURL) return;

        try {
            const response = await fetch(audioURL);
            const audioBlob = await response.blob();
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            const result = await axios.post('http://localhost:5000/generate-music', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setGeneratedMusicURL(result.data.musicUrl);
        } catch (error) {
            console.error('Error generating music:', error);
        }
    };

    return (
        <div>
            <h1>Voice Recorder</h1>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {audioURL && <audio src={audioURL} controls />}
            <button onClick={generateMusic} disabled={!audioURL}>Generate Music</button>
            {generatedMusicURL && <audio src={generatedMusicURL} controls />}
        </div>
    );
};

export default VoiceRecorder;