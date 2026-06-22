import { Upload } from 'lucide-react'
import { useCallback, useState, type DragEvent } from 'react'

type FileDropzoneProps = {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: string
  hint?: string
}

export function FileDropzone({
  onFiles,
  accept = '.pdf,application/pdf',
  multiple = false,
  label = 'Drop PDF files here',
  hint = 'or click to browse',
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return
      onFiles(Array.from(fileList))
    },
    [onFiles],
  )

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        isDragging
          ? 'border-brand-500 bg-brand-50'
          : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50'
      }`}
    >
      <Upload className="mb-3 h-8 w-8 text-brand-600" />
      <span className="text-base font-medium text-slate-800">{label}</span>
      <span className="mt-1 text-sm text-slate-500">{hint}</span>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />
    </label>
  )
}
