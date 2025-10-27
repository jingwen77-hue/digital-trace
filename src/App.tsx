import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import GalleryPage from './pages/GalleryPage'
export default function App(){
  return (
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/about' element={<AboutPage/>} />
      <Route path='/gallery' element={<GalleryPage/>} />
      <Route path='*' element={<div className='min-h-screen grid place-items-center text-slate-700'>
        <div className='text-center'>
          <div className='mb-4 text-2xl font-semibold'>404</div>
          <Link className='underline' to='/'>Back to Home</Link>
        </div>
      </div>} />
    </Routes>
  )
}
