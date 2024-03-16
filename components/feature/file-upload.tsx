'use client'

import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

import { UploadDropzone } from '@/lib/uploadthing'

import '@uploadthing/react/styles.css'

interface FileUploadProps {
  endpoint: 'serverImage' | 'messageFile'
  value: string
  onChange: (url?: string) => void
}

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split('.').pop()

  if (value && fileType !== 'pdf') {
    return (
      <div className="tw-relative tw-h-20 tw-w-20">
        <Image fill sizes="100%" src={value} alt="server-img" className="tw-rounded-full" />
        <button
          onClick={() => onChange('')}
          className="tw-bg-rose-500 tw-text-white tw-p-1 tw-rounded-full tw-absolute tw-top-0 tw-right-0 tw-shadow-sm"
          type="button"
        >
          <X className="tw-w-4 tw-h-4" />
        </button>
      </div>
    )
  }

  if (value && fileType === 'pdf') {
    return (
      <div className="tw-relative tw-flex tw-items-center tw-p-2 tw-mt-2 tw-rounded-md tw-bg-background/10">
        <FileIcon className="tw-w-10 tw-h-10 tw-fill-indigo-200 tw-stroke-indigo-400" />

        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="tw-ml-2 tw-text-sm tw-text-indigo-500 dark:tw-text-indigo-400 hover:tw-underline"
        >
          {value}
        </a>

        <button
          onClick={() => onChange('')}
          className="tw-bg-rose-500 tw-text-white tw-p-1 tw-rounded-full tw-absolute -tw-top-2 -tw-right-2 tw-shadow-sm"
          type="button"
        >
          <X className="tw-w-4 tw-h-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url)
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message ?? 'Failed to upload file')
      }}
    />
  )
}

export default FileUpload
