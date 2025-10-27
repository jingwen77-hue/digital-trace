import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function ImageWithSkeleton({ src, alt, loading='lazy', onClick }:{ src:string; alt:string; loading?:'lazy'|'eager'; onClick?:()=>void }){
  const [loaded,setLoaded]=useState(false)
  return (
    <div className='relative w-full h-full rounded-xl overflow-hidden bg-white'>
      {!loaded && <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-[#EAF2FF]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.7)_50%,rgba(255,255,255,0)_100%)] bg-[length:200%_100%] animate-[shimmer_1.4s_linear_infinite]' />
      </div>}
      <img src={src} alt={alt} loading={loading} decoding='async' draggable={false} onLoad={()=>setLoaded(true)} onClick={onClick} className='w-full h-full object-contain p-2 cursor-zoom-in' />
    </div>
  )
}

export default function FlipBook({ images, onClose }:{ images:string[]; onClose:()=>void }){
  const [center,setCenter]=useState(Math.min(Math.max(0,Math.floor(images.length/2)),images.length-1))
  const [selectedIndex,setSelectedIndex]=useState<number|null>(null)
  const openPreview=(i:number)=>setSelectedIndex(i)
  const closePreview=()=>setSelectedIndex(null)
  const prevPreview=()=>setSelectedIndex(i=>i===null?null:(i+images.length-1)%images.length)
  const nextPreview=()=>setSelectedIndex(i=>i===null?null:(i+1)%images.length)

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(selectedIndex===null) return
      if(e.key==='Escape') closePreview()
      if(e.key==='ArrowLeft') prevPreview()
      if(e.key==='ArrowRight') nextPreview()
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[selectedIndex])

  const dragging=useRef(false); const startX=useRef(0)
  const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n))
  const prev=()=>setCenter(c=>clamp(c-1,0,images.length-1))
  const next=()=>setCenter(c=>clamp(c+1,0,images.length-1))
  const onDown=(e:React.PointerEvent)=>{dragging.current=true; startX.current=e.clientX; (e.target as HTMLElement).setPointerCapture?.(e.pointerId)}
  const onMove=(e:React.PointerEvent)=>{ if(!dragging.current) return; const dx=e.clientX-startX.current; if(Math.abs(dx)>30){ dx<0?next():prev(); startX.current=e.clientX } }
  const onUp=()=>{ dragging.current=false }
  const backHome=()=>{ onClose(); window.scrollTo({ top:0, behavior:'smooth' }) }

  return (
    <div className='fixed inset-0 bg-[#0e1524]/80 backdrop-blur-md flex items-center justify-center z-50'>
      <div className='relative w-[88vw] max-w-[1400px] h-[70vh] max-h-[760px] select-none'
           style={{perspective:'1400px'}}
           onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className='absolute inset-x-0 top-4 px-6 flex justify-between z-20'>
          <button onClick={backHome} className='px-3 py-1.5 text-sm rounded-full bg-white/80 hover:bg-white shadow border border-white/70'>Back to Home</button>
          <button onClick={onClose} className='px-3 py-1.5 rounded-full bg-rose-500 text-white shadow hover:brightness-110'>Close</button>
        </div>
        <div className='absolute inset-0 grid place-items-center'>
          <div className='relative w-full h-full'>
            {images.map((src,i)=>{
              const offset=i-center, gap=160, angle=-18, z=-Math.abs(offset)*60, scale=1-Math.min(Math.abs(offset)*0.06,0.3)
              return (
                <motion.div key={i}
                  className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden will-change-transform shadow-2xl border border-[#DDE3F0] bg-white'
                  style={{top:'46%', width:'34vw',maxWidth:520,height:'62vh',maxHeight:620, transformStyle:'preserve-3d'}}
                  animate={{ x: offset*gap, rotateY: offset*angle, z, scale, boxShadow: offset===0?'0 30px 80px rgba(10,20,40,0.35)':'0 10px 40px rgba(10,20,40,0.2)' }}
                  transition={{ type:'spring', stiffness:160, damping:20 }}
                  onClick={()=>setCenter(i)}>
                  <ImageWithSkeleton src={src} alt={'img-'+i} loading={offset===0?'eager':'lazy'} onClick={(e)=>{ e.stopPropagation(); openPreview(i) }} />
                  <div className='pointer-events-none absolute inset-0' style={{ mixBlendMode:'screen', background:'linear-gradient(120deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 30%, rgba(122,167,255,0.12) 70%, rgba(255,255,255,0) 100%)'}} />
                </motion.div>
              )
            })}
          </div>
        </div>
        <div className='absolute bottom-6 left-0 right-0 flex items-center justify-between px-8 z-20'>
          <button onClick={prev} className='px-4 py-2 rounded-lg bg-white/80 hover:bg-white shadow border border-white/70'>Prev</button>
          <div className='text-white/85 text-sm'>{center+1} / {images.length}</div>
          <button onClick={next} className='px-4 py-2 rounded-lg bg-[#7AA7FF] text-white shadow hover:brightness-110'>Next</button>
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex!==null && (
          <motion.div className='fixed inset-0 bg-black/80 z-[60] grid place-items-center'
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={closePreview}>
            <div className='relative max-w-[92vw] max-h-[92vh]' onClick={(e)=>e.stopPropagation()}>
              <img src={images[selectedIndex]} alt='preview' className='max-w-[92vw] max-h-[92vh] rounded-lg shadow-2xl object-contain' draggable={false} />
              <button aria-label='previous' onClick={prevPreview}
                className='absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/85 text-black hover:bg-white shadow border border-white/70'>←</button>
              <button aria-label='next' onClick={nextPreview}
                className='absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/85 text-black hover:bg-white shadow border border-white/70'>→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
