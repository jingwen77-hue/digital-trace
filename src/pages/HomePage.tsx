import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import FlipBook from '../components/FlipBook'

const ACCESS_CODE = 'trace'

function RotatingRingText({ text='ALL-THINGS; WHAT-I-CAN-IMAGINE;', radius=190, size=32, speedSec=12 }){
  const ref = useRef<HTMLDivElement|null>(null)
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const chars = String(text).split(''); el.innerHTML='';
    const frag = document.createDocumentFragment();
    for(let i=0;i<chars.length;i++){
      const span = document.createElement('span'); span.innerText = chars[i];
      const angle = (360/chars.length)*i;
      span.style.position='absolute';
      span.style.transform='rotateY('+angle+'deg) translateZ('+radius+'px)';
      span.style.transformOrigin='center center '+(-radius)+'px';
      span.style.fontFamily='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
      span.style.fontSize=size+'px'; span.style.fontWeight='500'; span.style.color='rgba(10,20,40,0.82)';
      frag.appendChild(span);
    }
    el.appendChild(frag);
  },[text,radius,size])
  return (<div className='relative flex justify-center items-center w-full h-[360px]' style={{perspective:'1000px'}}>
    <div ref={ref} className='absolute w-[380px] h-[380px] text-center' style={{ transformStyle:'preserve-3d', animation:`rotateRing ${speedSec}s linear infinite` }} />
  </div>)
}

const IDENTITIES = [
  { id:'food', label:'Food Lover', images: Array.from({length:10},(_,i)=>`/images/food/food${i+1}.jpg`) },
  { id:'exhibition', label:'Exhibition Goer', images: Array.from({length:10},(_,i)=>`/images/exhibition/ex${i+1}.jpg`) },
  { id:'idol', label:'Idol Follower', images: Array.from({length:10},(_,i)=>`/images/idol/idol${i+1}.jpg`) },
  { id:'student', label:'Student', images: Array.from({length:10},(_,i)=>`/images/student/stu${i+1}.jpg`) },
  { id:'real', label:'Real Me', images: Array.from({length:10},(_,i)=>`/images/real/me${i+1}.jpg`) },
] as const

export default function HomePage(){
  const idsRef=useRef<HTMLDivElement|null>(null)
  const [unlocked,setUnlocked]=useState(false)
  const [pwd,setPwd]=useState(''); const [error,setError]=useState<string|null>(null)
  const [active,setActive]=useState<string|null>(null)
  const submit=(e:React.FormEvent)=>{ e.preventDefault(); if(pwd===ACCESS_CODE){ setUnlocked(true); setError(null); setTimeout(()=>idsRef.current?.scrollIntoView({behavior:'smooth'}),150)} else setError('Wrong code') }
  return (
    <div className='relative min-h-screen w-full overflow-x-hidden text-[#1A1A22]'>
      <section className='relative min-h-screen flex flex-col items-center justify-center overflow-hidden'>
        <motion.h1 className='relative z-10 text-5xl font-semibold mb-8 tracking-tight title-glow'
          initial={{opacity:0, y:8, scale:0.98}} animate={{opacity:1, y:0, scale:1}} transition={{duration:0.6, ease:'easeOut'}}>
          Digital Traces
        </motion.h1>
        <div className='absolute inset-0 grid place-items-center pointer-events-none z-0'>
          <RotatingRingText />
        </div>
        <div className='relative z-10 text-center px-6'>
          <form onSubmit={submit} className='mx-auto w-full max-w-md rounded-2xl border border-white/60 bg-gradient-to-br from-white/50 to-[#DDE3F0]/40 backdrop-blur-2xl shadow-[0_8px_30px_rgba(10,20,40,0.08)] p-3 flex items-center gap-2'>
            <input type='password' value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder='Enter access code'
              className='flex-1 bg-transparent placeholder-[#1A1A22]/50 text-[#1A1A22] outline-none px-3 py-2' aria-label='Access code' />
            <button type='submit' className='px-4 py-2 rounded-xl bg-[#7AA7FF] text-white font-medium hover:brightness-110 transition'>Unlock</button>
          </form>
          {error && <div className='mt-2 text-sm text-rose-600'>{error}</div>}
        </div>
      </section>
      <section ref={idsRef} className={unlocked ? 'min-h-screen py-24' : 'hidden'}>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-6'>
            {IDENTITIES.map(({id,label},i)=>(
              <button key={id} onClick={()=>setActive(id)} className='relative flex flex-col items-center justify-center w-44 h-44 rounded-full bg-gradient-to-br from-white/40 to-[#DDE3F0]/30 border border-white/60 shadow-[0_8px_30px_rgba(10,20,40,0.06)] backdrop-blur-2xl hover:shadow-[0_8px_40px_rgba(122,167,255,0.35)] hover:border-[#C7D3EA] transition focus:outline-none focus:ring-2 focus:ring-[#7AA7FF]/40'
                style={{ animation: f'buttonWobble 2.2s ease-in-out {i*0.2}s infinite' as unknown as string }}>
                <div className='text-3xl'>•</div>
                <div className='mt-3 text-lg font-medium text-[#1A1A22]/90'>{label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
      {active && <FlipBook images={(IDENTITIES.find(x=>x.id===active) as any).images} onClose={()=>setActive(null)} />}
    </div>
  )
}
