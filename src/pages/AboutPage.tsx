import React from 'react'
export default function AboutPage(){
  return (
    <div className='min-h-screen grid place-items-center bg-gradient-to-br from-[#CDE7FF] via-[#F6F9FC] to-[#A0B9D9] animate-lightShift'>
      <div className='max-w-3xl mx-auto px-6 text-[#0e1524]/85'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-6'>About me</h1>
        <p className='mb-3'>I am a designer drawn to the in-between — where clarity meets emotion, and digital surfaces begin to feel alive.</p>
        <p className='mb-3'>My work drifts across brand identity, interactive media, and visual experiments — searching for the moments when form, sound, and motion quietly reveal the self.</p>
        <a href='/' className='underline'>Back to Home</a>
      </div>
    </div>
  )
}
