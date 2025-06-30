import React from 'react'
import HeroSection from './HeroSection'
import Footer from '../Footer/Footer'
import MeetTheDevs from './MeetTheDevs'
import UpcomingUpdates from './UpcomingUpdates'

function Landing() {
  return (
      <div className="relative h-full w-full bg-white">
        <div className="fixed inset-0  bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
          </div>
      <HeroSection />
      <MeetTheDevs />
      <UpcomingUpdates />
      <Footer />
    </div>
  )
}

export default Landing
