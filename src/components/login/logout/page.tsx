"use client"

import { signOut } from "next-auth/react"

export default function LogOutButton(){
    return(
    <div className="field is-grouped">
          <div className="control">
            <button type="submit" onClick={() => signOut({callbackUrl: "/Log"})} className="button is-danger is-outlined">
              Sair
            </button>
            </div>
    </div>)
}