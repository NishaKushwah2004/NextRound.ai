import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';


function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <Navbar />

      <div className='flex-1 px-6 py-20'>
        <div className='max-w-6xl mx-auto'>

          <div className='flex justify-center mb-6'>
            <div className='bg-white text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2 border-outline '>
              <HiSparkles size={16} className="bg-[#F3E8FF] text-[#6600CC]" />
              AI-Powered Mock Interview Platform
            </div>


          </div>
          
          <div className='text-center mb-28'>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto'>
              Practice Real Interviews with
              <span className='relative inline-block'>
                <span className='bg-white text-[#6600CC] border border-gray-200 px-5 py-1 rounded-full'>
                  AI Interview Coach

                </span>
              </span>



            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='text-gray-600 mt-6 max-w-2xl mx-auto text-lg'>
              Practice role-specific interviews with an AI interviewer, adaptive follow-up questions,
              and instant feedback to improve confidence and performance.

            </motion.p>

            <div className='flex flex-wrap justify-center gap-4 mt-10'>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/interview")
                }}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='bg-linear-to-r from-[#6600CC] to-[#7A33D1] text-white px-10 py-3 rounded-full hover:from-[#5B00B3] hover:to-[#7A33D1] transition shadow-sm active:scale-95'>
                Start Your Interview

              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/history")
                }}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='bg-white text-gray-600 border border-gray-200 px-10 py-3 rounded-full hover:bg-[#F3E8FF] transition active:scale-95'>
                View Past Interviews

              </motion.button>
            </div>
          </div>

          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>
            {
              [
                {
                  icon: <BsRobot size={24} />,
                  step: "STEP 1",
                  title: "Choose Role & Experience",
                  desc: "Pick your target role so AI asks questions at the right level."
                },
                {
                  icon: <BsMic size={24} />,
                  step: "STEP 2",
                  title: "Live AI Interview",
                  desc: "Answer naturally and get smart follow-up questions in real time."
                },
                {
                  icon: <BsClock size={24} />,
                  step: "STEP 3",
                  title: "Timed Practice Session",
                  desc: "Simulate real interview pressure with a built-in timer."
                }
              ].map((item, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 + index * 0.2 }}
                  whileHover={{ rotate: 0, scale: 1.06 }}

                  className={`
        relative bg-white rounded-3xl border-2 border-gray-200 
        hover:border-[#5B00B3] p-10 w-80 max-w-[90%] shadow-sm hover:shadow-md 
        transition-all duration-300
        ${index === 0 ? "rotate-[-4deg]" : ""}
        ${index === 1 ? "rotate-3 md:-mt-6 shadow-md" : ""}
        ${index === 2 ? "-rotate-3" : ""}
      `}>

                  <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-[#6600CC] text-[#6600CC] w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm'>
                    {item.icon}</div>
                  <div className='pt-10 text-center'>
                    <div className='text-xs text-[#6600CC] font-semibold mb-2 tracking-wider'>{item.step}</div>
                    <h3 className='font-semibold mb-3 text-lg'>{item.title}</h3>
                    <p className='text-sm text-gray-600 leading-relaxed'>{item.desc}</p>
                  </div>


                </motion.div>
              ))
            }
          </div>


          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl font-semibold text-center mb-16'>
              Powerful AI{" "}
              <span className="text-[#6600CC]">Capabilities</span>

            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={20} />,
                    title: "Instant Answer Feedback",
                    desc: "Get scores for communication, technical accuracy, and confidence."
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Resume-Based Questions",
                    desc: "Upload your resume to get project and skills-based questions."
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Downloadable PDF Report",
                    desc: "Review strengths, gaps, and clear next-step improvements."
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={20} />,
                    title: "Interview History & Analytics",
                    desc: "Track progress over time with score trends and topic insights."
                  }
                ].map((item, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all'>
                    <div className='flex flex-col md:flex-row items-center gap-8'>
                      <div className='w-full md:w-1/2 flex justify-center'>
                        <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-64' />
                      </div>

                      <div className='w-full md:w-1/2'>
                        <div className='bg-[#F3E8FF] text-[#6600CC] w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-gray-200'>
                          {item.icon}
                        </div>
                        <h3 className='font-semibold mb-3 text-xl'>{item.title}</h3>
                        <p className='text-gray-600 text-sm leading-relaxed'>{item.desc}</p>
                      </div>

                    </div>


                  </motion.div>
                ))
              }
            </div>


          </div>

          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl font-semibold text-center mb-16'>
              Interview{" "}
              <span className="text-[#6600CC]">Modes</span>

            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Practice behavioral and communication-focused interview rounds."
                  },
                  {
                    img: techImg,
                    title: "Technical Interview Mode",
                    desc: "Get role-specific technical questions matched to your experience."
                  },

                  {
                    img: confidenceImg,
                    title: "Confidence Insights",
                    desc: "Understand your speaking tone and delivery confidence."
                  },
                  {
                    img: creditImg,
                    title: "Flexible Credits",
                    desc: "Use credits to unlock more practice interviews anytime."
                  }
                ].map((mode, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">

                    <div className='flex items-center justify-between gap-6'>
                      <div className="w-1/2">
                        <h3 className="font-semibold text-xl mb-3">
                          {mode.title}
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>

                      {/* RIGHT IMAGE */}
                      <div className="w-1/2 flex justify-end">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain"
                        />
                      </div>



                    </div>


                  </motion.div>
                ))
              }
            </div>


          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

        <Footer/>

    </div>
  )
}

export default Home
