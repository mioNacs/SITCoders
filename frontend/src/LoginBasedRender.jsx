import React from 'react'
import {Home, Landing} from './components'

function LoginBasedRender() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  return (
    <div>
      {!isLoggedIn && <Landing /> }
      {isLoggedIn && <Home /> }
    </div>
  )
}

export default LoginBasedRender
