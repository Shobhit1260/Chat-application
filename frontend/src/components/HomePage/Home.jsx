import React from 'react'
import LeftSideBar from './LeftSideBar'
import Chat from './Chat'
import RightSideBar from './RightSideBar'

function Home() {
  return (
     <div className='w-11/12 h-[700px] text-white rounded-lg flex ' >
           <LeftSideBar/> 
           <Chat/>
           <RightSideBar/>
     </div>
  )
}

export default Home
