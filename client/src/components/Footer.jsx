import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='bg-white flex justify-center px-4 pb-10 py-4 pt-10'>
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-gray-200 py-8 px-3 text-center'>
        <div className='flex justify-center items-center gap-3 mb-3'>
            <div className='bg-gradient-to-r from-[#6600CC] to-[#7A33D1] text-white p-2 rounded-lg'><BsRobot size={16}/></div>
            <h2 className='font-semibold'>NextRound.ai</h2>
        </div>
        <p className='text-gray-600 text-sm max-w-xl mx-auto'>
  AI-powered mock interview platform that helps students and job seekers
          improve communication, technical skills, and interview confidence.
        </p>


      </div>
    </div>
  )
}

export default Footer
