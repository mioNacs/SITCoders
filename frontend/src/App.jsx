import { useState } from 'react'
import { Landing, Home, Footer, Header } from './components'
import {Outlet} from 'react-router-dom'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {!isLoggedIn && <Outlet/>}
      {isLoggedIn && (
        <div>
          <Header />
          <Outlet />
          <Footer/>
        </div>
      )}
    </>
  )
}

export default App
