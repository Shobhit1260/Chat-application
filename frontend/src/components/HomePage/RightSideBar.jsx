import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector,useDispatch } from 'react-redux';


function RightSideBar() {
  const { logout } = useAuth0();
  const userSelected=useSelector((state)=>state?.userSelected?.value);

  return (
    <div>{
      Object.keys(userSelected).length===0? null: <button className="w-[400px] bg-white/20 rounded-r-lg h-[700px]" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>log out</button>

      }
    </div>
  )
}

export default RightSideBar
