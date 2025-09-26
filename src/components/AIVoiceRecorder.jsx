import React, { useState, useEffect } from 'react';
import './AIVoiceRecorder.scss';

const AIVoiceRecorder = ({ isVisible, onClose, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const targetText = "skate shoes in a nineties style with a leopard pattern";
  
  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('');
      setIsRecording(true);
      setIsTyping(false);
      setIsFadingOut(false);
      return;
    }

    // Start recording animation for 2 seconds
    const recordingTimer = setTimeout(() => {
      setIsRecording(false);
      setIsTyping(true);
      
      // Start typing animation
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= targetText.length) {
          setDisplayedText(targetText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Wait 1 second then trigger completion and start fade out simultaneously
          setTimeout(() => {
            // Trigger completion immediately to show CustomShoeResult
            if (onComplete) {
              onComplete();
            }
            
            // Start fade out at the same time
            setIsFadingOut(true);
            
            // Close after fade animation completes
            setTimeout(() => {
              onClose();
            }, 1000); // Match the fade animation duration
          }, 800); // Slightly reduced wait time
        }
      }, 100); // 100ms per character for natural typing speed
      
    }, 2000);

    return () => {
      clearTimeout(recordingTimer);
    };
  }, [isVisible, onClose]);

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
          <p className="ai-transcribed-text">
            {displayedText}
            {isTyping && <span className="typing-cursor">|</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceRecorder;
