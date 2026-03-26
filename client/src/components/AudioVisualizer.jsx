import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ isListening }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const requestRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isListening) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw a flat line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = '#E5E7EB'; // border-gray-200
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      return;
    }

    let isMounted = true;

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isMounted) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }
        streamRef.current = stream;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        draw();
      } catch (err) {
        console.error("Error accessing microphone for visualizer", err);
      }
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas || !analyserRef.current) return;
      
      const ctx = canvas.getContext('2d');
      requestRef.current = requestAnimationFrame(draw);
      
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#6600CC'; // primary purple
      ctx.beginPath();
      
      const sliceWidth = canvas.width * 1.0 / dataArrayRef.current.length;
      let x = 0;
      
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = v * canvas.height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    setupAudio();

    return () => {
      isMounted = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      // audioContext close omitted in cleanup to avoid rapid toggle bugs, handled by initialization block
    };
  }, [isListening]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <canvas 
        ref={canvasRef} 
        width="300" 
        height="80" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default AudioVisualizer;
