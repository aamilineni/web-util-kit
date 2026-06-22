import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type CopyButtonProps = {
  text: string
  label?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, label = 'Copy', size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast('Copied to clipboard')
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="secondary" size={size} onClick={() => void handleCopy()} disabled={!text}>
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : label}
    </Button>
  )
}
