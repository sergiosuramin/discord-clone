'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'

interface FileUploadProps {
  endpoint: 'serverImage' | 'messageFile'
  value: string
  onChange: (url?: string) => void
}

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  console.log('lala-- value--', value)
  const fileType = value?.split('.').pop()
  console.log('lala-- fileType--', fileType)

  if (value && fileType !== 'pdf') {
    return (
      <div className="tw-relative tw-h-20 tw-w-20">
        <Image fill src={value} alt="server-img" className="tw-rounded-full" />
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

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url)
      }}
      onUploadError={(error: Error) => {
        console.log('lala-- error--', error)
      }}
    />
  )
}

export default FileUpload
