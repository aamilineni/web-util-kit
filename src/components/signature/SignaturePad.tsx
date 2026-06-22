import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type SignaturePadProps = {
  onChange: (hasSignature: boolean) => void
  className?: string
}

function getPoint(canvas: HTMLCanvasElement, event: React.PointerEvent<HTMLCanvasElement>) {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}

export const SignaturePad = forwardRef<HTMLCanvasElement, SignaturePadProps>(function SignaturePad(
  { onChange, className = '' },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

  const syncHasInk = useCallback(
    (value: boolean) => {
      setHasInk(value)
      onChange(value)
    },
    [onChange],
  )

  const clear = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    syncHasInk(false)
  }, [syncHasInk])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2.5
    ctx.strokeStyle = '#1e293b'
  }, [])

  const startStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawingRef.current = true
    canvas.setPointerCapture(event.pointerId)
    const point = getPoint(canvas, event)
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
  }

  const continueStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const point = getPoint(canvas, event)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    if (!hasInk) syncHasInk(true)
  }

  const endStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    drawingRef.current = false
    const canvas = canvasRef.current
    if (canvas?.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <canvas
          ref={canvasRef}
          width={560}
          height={180}
          className="block w-full touch-none cursor-crosshair bg-white"
          onPointerDown={startStroke}
          onPointerMove={continueStroke}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
          aria-label="Draw your signature"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-500">Draw your signature with mouse or touch.</p>
        <Button variant="ghost" size="sm" onClick={clear} disabled={!hasInk}>
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  )
})

export async function exportSignaturePng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })
  if (!blob) {
    throw new Error('Could not export signature image.')
  }
  return new Uint8Array(await blob.arrayBuffer())
}
