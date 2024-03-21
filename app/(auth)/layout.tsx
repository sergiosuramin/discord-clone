import { ModeToggle } from '@/components/feature/mode-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tw-h-svh tw-bg-gradient-primary tw-flex tw-flex-col">
      <div className="tw-ml-auto tw-pr-4 tw-py-2">
        <ModeToggle auth />
      </div>

      <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center">{children}</div>
    </div>
  )
}
