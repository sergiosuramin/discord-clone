'use client'
import { useUser } from '@clerk/nextjs'
import {
  ControlBar,
  GridLayout,
  LayoutContextProvider,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react'
import axios, { AxiosError } from 'axios'
import { Track } from 'livekit-client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import '@livekit/components-styles'

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

const MediaRoom = ({ chatId, video = false, audio = true }: MediaRoomProps) => {
  const router = useRouter()
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
        const response = await axios.get(`/api/livekit?room=${chatId}&username=${name}`)

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
    <LayoutContextProvider>
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        video={video}
        audio={audio}
        connect
        onDisconnected={() => router.back()}
      >
        <ConferenceComposer />
        <RoomAudioRenderer />
        <div className="tw-flex tw-items-center tw-justify-center">
          <ControlBar
            variation="minimal"
            controls={{
              microphone: true,
              camera: video,
              chat: true,
              screenShare: true,
              leave: true,
              settings: true,
            }}
          />
        </div>
      </LiveKitRoom>
    </LayoutContextProvider>
  )
}

function ConferenceComposer() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100svh - var(--lk-control-bar-height) - 46px)' }}>
      <ParticipantTile />
    </GridLayout>
  )
}

export default MediaRoom
