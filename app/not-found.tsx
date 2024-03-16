'use client'
import { XOctagon } from 'lucide-react'
import Head from 'next/head'

const NotFound = () => (
  <div className="tw-w-screen tw-h-screen tw-flex tw-justify-center tw-items-center">
    <Head>
      <title>404 Not Found</title>
      <meta name="description" content="Oops! Looks like you're lost or the page is not found." />
    </Head>

    <div className="tw-grid tw-gap-y-4 tw-text-center tw-max-w-[400px]">
      <div className="tw-flex tw-justify-center tw-mb-6">
        <XOctagon size={96} className="tw-text-destructive" />
      </div>
      <h1 className="tw-font-semibold">Oops! Looks like you&apos;re lost.</h1>
      <h3>Let&apos;s go back to our app</h3>

      <a href="/" className="tw-bg-indigo-500 hover:tw-bg-indigo-500/90 tw-text-white tw-rounded-md tw-px-4 tw-py-2">
        Go Back
      </a>
    </div>
  </div>
)

export default NotFound
