import React, { useState, useEffect, useRef } from 'react';
import './AIVoiceRecorder.scss';

const AIVoiceRecorder = ({ isVisible, onClose, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  
  const recognitionRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setDisplayedText(prev => prev + finalTranscript);
        setInterimText(interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsRecording(false);
        setInterimText('');
        
        // Auto-complete after speech ends
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
          
          setIsFadingOut(true);
          
          setTimeout(() => {
            onClose();
          }, 1000);
        }, 1000);
      };

      recognitionRef.current = recognition;
    }
  }, [onComplete, onClose]);

  // Handle visibility changes
  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('');
      setInterimText('');
      setIsRecording(false);
      setIsListening(false);
      setIsFadingOut(false);
      
      // Stop recognition if it's running
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      return;
    }

    // Start speech recognition when component becomes visible
    if (speechSupported && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [isVisible, speechSupported, isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Manual stop function
  const handleStopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`ai-voice-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="ai-voice-background"></div>
      
      <button className="ai-voice-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      
      <div className="ai-voice-content">
        <div className="ai-recorder-container">
          <div className={`ai-recorder-circle ${isRecording ? 'recording' : ''}`}>
            <div className="ai-logo">A</div>
            
            {isRecording && (
              <>
                <div className="soundwave soundwave-left">
                  <div className="wave wave-1"></div>
                  <div className="wave wave-2"></div>
                  <div className="wave wave-3"></div>
                  <div className="wave wave-4"></div>
                </div>
                <div className="soundwave soundwave-right">
                  <div className="wave wave-1"></div>
                  <div className="wave wave-2"></div>
                  <div className="wave wave-3"></div>
                  <div className="wave wave-4"></div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="ai-text-container">
          {!speechSupported ? (
            <p className="ai-transcribed-text error">
              Speech recognition is not supported in your browser. Please use Chrome or Edge.
            </p>
          ) : (
            <p className="ai-transcribed-text">
              {displayedText}
              <span className="interim-text">{interimText}</span>
              {isListening && <span className="typing-cursor">|</span>}
            </p>
          )}
          {isListening && (
            <>
              <p className="ai-status-text">Listening... Speak now</p>
              <button className="stop-recording-btn" onClick={handleStopRecording}>
                Stop Recording
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVoiceRecorder;
