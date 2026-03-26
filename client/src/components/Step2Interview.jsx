import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'
import AudioVisualizer from './AudioVisualizer'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");


  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices
      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92;     // slightly slower than normal
      utterance.pitch = 1.05;    // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic()
        videoRef.current?.play();
      };


      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);



        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };


      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };


  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        // If last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }

    }

    runIntro()


  }, [selectedVoice, isIntroPhase, currentIndex])



  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isAIPlaying || isSubmitting || feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0;
        }
        return prev - 1

      })
    }, 1000);

    return () => clearInterval(timer)

  }, [isIntroPhase, currentIndex, isAIPlaying, isSubmitting, feedback])

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);


  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;

  }, []);


  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch { }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };


  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic()
    setIsSubmitting(true)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
      }, { withCredentials: true })

      setFeedback(result.data.feedback)
      speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);


  }

  const finishInterview = async () => {
    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl + "/api/interview/finish", { interviewId }, { withCredentials: true })

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer()
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);







  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-4 sm:p-6 space-y-4 sm:space-y-6 border-b lg:border-r lg:border-b-0 border-gray-200'>

          <div className='w-full max-w-3xl flex flex-row lg:flex-col gap-4 items-stretch lg:items-center'>
            <div className='w-1/2 lg:w-full max-w-md rounded-2xl overflow-hidden shadow-sm flex items-center justify-center bg-[#FAFAFA] border border-gray-200'>
              <video
                src={videoSource}
                key={videoSource}
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover max-h-48 md:max-h-60 lg:max-h-full"
              />
            </div>

            {/* timer Area */}
            <div className='w-1/2 lg:w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-3 sm:p-5 flex flex-col justify-center space-y-3 sm:space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-xs sm:text-sm text-gray-600'>
                  Status
                </span>
                {isAIPlaying && <span className='text-[10px] sm:text-xs font-semibold text-[#6600CC] truncate ml-1'>
                  {isAIPlaying ? "AI is speaking" : ""}
                </span>}
              </div>

              <div className="h-px bg-gray-200"></div>

              <div className='flex justify-center'>
                <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
              </div>

              <div className="h-px bg-gray-200"></div>

              <div className='grid grid-cols-2 gap-2 text-center'>
                <div>
                  <span className='text-base sm:text-xl md:text-2xl font-bold text-[#6600CC]'>{currentIndex + 1}</span>
                  <span className='block text-[10px] sm:text-xs text-gray-600'>Current</span>
                </div>

                <div>
                  <span className='text-base sm:text-xl md:text-2xl font-bold text-[#6600CC]'>{questions.length}</span>
                  <span className='block text-[10px] sm:text-xs text-gray-600'>Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* subtitle */}
          {subtitle && (
            <div className='w-full max-w-2xl bg-[#FAFAFA] border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm'>
              <p className='text-gray-600 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}

        </div>

        {/* Text section */}

        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-[#6600CC] mb-6'>
            Live AI Interview
          </h2>


          {!isIntroPhase && (<div className='relative mb-6 bg-[#FAFAFA] p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className='text-xs sm:text-sm text-gray-600 mb-2'>
              Question {currentIndex + 1} of {questions.length}
            </p>

            <div className='text-base sm:text-lg font-semibold text-black leading-relaxed '>{currentQuestion?.question}</div>
          </div>)
          }

          {!isIntroPhase && !feedback && (
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-sm font-medium text-gray-600">Your Voice Response</span>
              <div className="w-24 h-6">
                <AudioVisualizer isListening={isMicOn && !isAIPlaying} />
              </div>
            </div>
          )}

          <textarea
            placeholder="Speak or type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-white p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-300 focus:ring-2 focus:ring-[#6600CC] focus:border-[#6600CC] transition text-black" />


          {!feedback ? (<div className='flex items-center gap-4 mt-6'>
            <div className="relative flex items-center justify-center">
              {isMicOn && !isAIPlaying && (
                <span className="absolute w-full h-full rounded-full bg-[#6600CC] opacity-60 animate-ping"></span>
              )}
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className='relative z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm border border-gray-200 hover:bg-[#F3E8FF] active:scale-95 hover:shadow-md'>
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>
            </div>

            <motion.button
              onClick={submitAnswer}
              disabled={isSubmitting}
              whileTap={{ scale: 0.95 }}
              className='flex-1 bg-gradient-to-r from-[#6600CC] to-[#7A33D1] hover:from-[#5B00B3] hover:to-[#7A33D1] text-white py-3 sm:py-4 rounded-2xl shadow-sm hover:shadow-md hover:opacity-90 transition font-semibold disabled:opacity-60 disabled:from-[#E5E7EB] disabled:to-[#E5E7EB] disabled:text-gray-600 active:scale-95'>
              {isSubmitting ? "Submitting..." : "Submit Response"}

            </motion.button>

          </div>) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-6 bg-[#FAFAFA] border border-gray-200 p-5 rounded-2xl shadow-sm'>
              <p className='text-[#6600CC] font-medium mb-4'>{feedback}</p>

              <button
                onClick={handleNext}

                className='w-full bg-gradient-to-r from-[#6600CC] to-[#7A33D1] hover:from-[#5B00B3] hover:to-[#7A33D1] text-white py-3 rounded-xl shadow-sm hover:shadow-md hover:opacity-90 transition flex items-center justify-center gap-1 active:scale-95'>
                Continue to Next Question <BsArrowRight size={18} />
              </button>

            </motion.div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Step2Interview
