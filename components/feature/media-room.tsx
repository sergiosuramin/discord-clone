'use client'
import { useUser } from '@clerk/nextjs'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

const MediaRoom = ({ chatId, video = false, audio = true }: MediaRoomProps) => {
  const { user } = useUser()
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    // call livekit route and append the token
    if (!user?.firstName || !user?.lastName) {
      return
    }

    // written when join the room
    const name = `${user.firstName} ${user.lastName}`

    ;(async () => {
      try {
        const response = await axios.get(`/api/livekit?room=${chatId}&username=${name}`, {})

        const data = await response.data

        setToken(data.token)
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data ?? 'Failed to load conference')
        }
      }
    })() //excecute the async
  }, [user?.firstName, user?.lastName, chatId])

  if (token === '') {
    // no token detected
    return (
      <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-center tw-items-center">
        <Loader2 className="tw-w-7 tw-h-7 tw-text-zinc-500 tw-animate-spin tw-my-4" />
        <p className="tw-text-xs tw-text-zinc-500 dark:tw-text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      video={video}
      audio={audio}
      connect
    >
      <VideoConference />
    </LiveKitRoom>
  )
}

export default MediaRoom
