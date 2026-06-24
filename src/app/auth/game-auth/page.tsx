"use client"

import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"

export default function GameAuth() {
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isSignedIn) return

    async function sendToken() {
      const token = await getToken({ template: "game" })

      window.location.href =
        `${process.env.NEXT_PUBLIC_GAME_URL}/game/WebSignupPOC.html?token=${token}`
    }

    sendToken()
  }, [isSignedIn,getToken])

  return <div>Signing you into the game...</div>
}