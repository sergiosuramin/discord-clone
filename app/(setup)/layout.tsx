import { Loader2 } from 'lucide-react'

const SetupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="tw-h-svh tw-flex tw-justify-center tw-items-center">
      <div className="tw-flex tw-flex-col tw-items-center tw-gap-y-2">
        <Loader2 className="tw-w-16 tw-h-16 tw-text-emerald-500 tw-animate-spin" />
        <h1>Initializing profile...</h1>

        {/* dont worry, setup page.tsx will overlap the loader */}
        {children}
      </div>
    </div>
  )
}

export default SetupLayout
