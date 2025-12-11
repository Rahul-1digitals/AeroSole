import React, { useState, useEffect, useRef } from 'react';
import { searchProducts } from '../services/api';
import './AIVoiceRecorder.scss';

const AIVoiceRecorder = ({ isVisible, onClose, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const accumulatedTextRef = useRef('');
  const completedRef = useRef(false); // Flag to prevent duplicate onComplete calls
  const isVisibleRef = useRef(false);
  
  // Track visibility changes
  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (isVisible) {
      console.log('AIVoiceRecorder became visible');
    } else {
      console.log('AIVoiceRecorder became hidden');
    }
  }, [isVisible]);
  
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
        accumulatedTextRef.current = ''; // Reset accumulated text
        console.log('Speech recognition started');
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

        // Update accumulated text with final transcript
        if (finalTranscript) {
          accumulatedTextRef.current += finalTranscript;
          console.log('Final transcript received:', finalTranscript);
          console.log('Accumulated text:', accumulatedTextRef.current);
        }
        
        // Update display text and interim text
        setDisplayedText(accumulatedTextRef.current + interimTranscript);
        setInterimText(interimTranscript);
        
        // Debug log for interim text
        if (interimTranscript) {
          console.log('Interim transcript:', interimTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };

      recognition.onend = async () => {
        setIsListening(false);
        setIsRecording(false);
        setInterimText('');
        
        // Prevent duplicate calls
        if (completedRef.current) {
          console.log('onComplete already called, skipping');
          return;
        }
        
        // Use accumulated text from ref for API call
        const finalText = accumulatedTextRef.current.trim();
        console.log('Speech recognition ended. Final accumulated text:', finalText);
        
        // Show processing state
        setDisplayedText('Processing your request...');
        setInterimText('');
        
        // Call API with the transcribed text
        if (finalText) {
          try {
            console.log('Calling API with text:', finalText); // Debug log
            const apiResult = await searchProducts(finalText);
            console.log('API result received:', apiResult); // Debug log
            
            // Mark as completed and pass result
            completedRef.current = true;
            if (onComplete) {
              onComplete(apiResult);
            }
          } catch (error) {
            console.error('Error calling API:', error);
            // Mark as completed and pass error
            completedRef.current = true;
            if (onComplete) {
              onComplete({ success: false, error: error.message });
            }
          }
        } else {
          console.log('No speech text detected'); // Debug log
          // Mark as completed and pass no speech error
          completedRef.current = true;
          if (onComplete) {
            onComplete({ success: false, error: 'No speech detected' });
          }
        }
        
        // Add a small delay before starting fade out to prevent flickering
        setTimeout(() => {
          setIsFadingOut(true);
          
          setTimeout(() => {
            onClose();
          }, 800); // Reduced from 1000ms for smoother transition
        }, 200); // Small delay to prevent immediate flickering
      };

      recognitionRef.current = recognition;
    }
  }, []); // Remove dependencies to prevent re-initialization

  // Handle visibility changes
  useEffect(() => {
    if (!isVisible) {
      // Force stop recognition immediately when becoming invisible
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Recognition stopped due to visibility change');
        } catch (error) {
          console.error('Error stopping recognition on visibility change:', error);
        }
      }
      
      // Reset all states immediately
      setDisplayedText('');
      setInterimText('');
      setIsRecording(false);
      setIsListening(false);
      setIsFadingOut(false);
      accumulatedTextRef.current = '';
      completedRef.current = false;
      return;
    }

    // Reset completion flag when becoming visible
    completedRef.current = false;

    // Start speech recognition when component becomes visible
    if (speechSupported && recognitionRef.current && !isListening && !completedRef.current) {
      try {
        console.log('Starting speech recognition...');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        // If already started, just continue
        if (error.name !== 'InvalidStateError') {
          console.error('Unexpected speech recognition error:', error);
        }
      }
    }
  }, [isVisible, speechSupported]);

  // Cleanup speech recognition on unmount only
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        console.log('Cleaning up speech recognition on unmount');
        recognitionRef.current.stop();
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
    };
  }, []); // Only cleanup on actual unmount

  // Manual stop function
  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        // Immediately update states to prevent race conditions
        setIsListening(false);
        setIsRecording(false);
        console.log('Manual stop recording triggered');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  // Enhanced close function that ensures cleanup
  const handleClose = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        // Immediately update states
        setIsListening(false);
        setIsRecording(false);
        setIsFadingOut(false);
        console.log('AI recorder closed, recognition stopped');
      } catch (error) {
        console.error('Error stopping recognition on close:', error);
      }
    }
    
    // Reset all states
    setDisplayedText('');
    setInterimText('');
    accumulatedTextRef.current = '';
    completedRef.current = false;
    
    // Call the original onClose
    onClose();
  };


  if (!isVisible) return null;

  console.log('AIVoiceRecorder rendering with isVisible:', isVisible);

  return (
    <div className={`ai-voice-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="ai-voice-background"></div>
      
      <button className="ai-voice-close" onClick={handleClose} aria-label="Close">
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
              <p className="ai-status-text">Listening... Click stop when done</p>
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
