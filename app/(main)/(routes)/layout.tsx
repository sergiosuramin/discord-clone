import NavigationSidebar from '@/components/navigation/navigation-sidebar'

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="tw-h-svh">
      {/* server list */}
      <div className="tw-flex tw-flex-col tw-h-full tw-w-[72px] tw-z-30 tw-fixed tw-inset-y-0 tw-transition -tw-translate-x-[200%] md:tw-translate-x-0">
        <NavigationSidebar />
      </div>
      <main className="md:tw-pl-[72px] tw-h-full">{children}</main>
    </div>
  )
}

export default MainLayout
