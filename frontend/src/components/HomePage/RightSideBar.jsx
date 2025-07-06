import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";


function RightSideBar() {
  const { logout } = useAuth0();

  return (
    <div>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>log out</button>
    </div>
  )
}

export default RightSideBar
