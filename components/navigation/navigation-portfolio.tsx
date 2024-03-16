import Image from 'next/image'
import Link from 'next/link'

import { ActionTooltip } from '@/components/feature/action-tooltip'

export const NavigationPortfolio = () => {
  return (
    <div>
      <ActionTooltip label="Creator's Portfolio" side="right" align="center">
        <div className="tw-group tw-relative tw-flex tw-items-center">
          <div className="tw-relative tw-group tw-flex tw-mx-4 tw-w-[40px] tw-h-[40px] tw-rounded-[20px] group-hover:tw-rounded-[12px] tw-transition-all tw-overflow-hidden tw-border-2 tw-border-emerald-500">
            <Link
              href="https://portfolio-sergiosuramin.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-transition"
            >
              <Image
                fill
                sizes="100%"
                src="https://storage.googleapis.com/portfolio-753c6.appspot.com/logo/logo.webp"
                alt="creator-portfolio"
                priority
              />
              T
            </Link>
          </div>
        </div>
      </ActionTooltip>
    </div>
  )
}
