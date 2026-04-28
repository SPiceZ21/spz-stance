import { useState, useEffect, useCallback, useRef } from 'preact/hooks'
import { SlidersHorizontal, MoveVertical, AlignHorizontalJustifyStart, AlignHorizontalJustifyEnd, RotateCw, RotateCcw, Check } from 'lucide-preact'
import { Button } from './components/Button'
import './components/Button.css'

const RESOURCE = 'spz-stance'

function post(name: string, data: object = {}) {
  fetch(`https://${RESOURCE}/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data),
  }).catch(() => {})
}

interface SliderParam {
  id: string
  icon: preact.ComponentChildren
  label: string
  min: number
  max: number
  step: number
  event: string
  transform: (v: number) => number
}

const PARAMS: SliderParam[] = [
  { id: 'height',  icon: <MoveVertical size={14} />,                   label: 'Height',         min: 0, max: 20, step: 0.01, event: 'setvehicleheight',            transform: v => v * 0.01 },
  { id: 'wheelof', icon: <AlignHorizontalJustifyStart size={14} />,    label: 'Front Offset',   min: 0, max: 10, step: 0.1,  event: 'setvehiclewheeloffsetfront',   transform: v => v },
  { id: 'wheelor', icon: <AlignHorizontalJustifyEnd size={14} />,      label: 'Rear Offset',    min: 0, max: 10, step: 0.1,  event: 'setvehiclewheeloffsetrear',    transform: v => v },
  { id: 'wheelrf', icon: <RotateCw size={14} />,                       label: 'Front Rotation', min: 0, max: 10, step: 0.1,  event: 'setvehiclewheelrotationfront', transform: v => v },
  { id: 'wheelrr', icon: <RotateCcw size={14} />,                      label: 'Rear Rotation',  min: 0, max: 10, step: 0.1,  event: 'setvehiclewheelrotationrear',  transform: v => v },
]

function Slider({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const setFromEvent = (e: MouseEvent) => {
    if (!trackRef.current) return
    const r = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    let next = min + ratio * (max - min)
    next = Math.round(next / step) * step
    next = Math.max(min, Math.min(max, next))
    onChange(next)
  }

  const onDown = (e: MouseEvent) => {
    setFromEvent(e)
    const move = (ev: MouseEvent) => setFromEvent(ev)
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const pct = ((value - min) / (max - min)) * 100
  return (
    <div class="spz-slider" ref={trackRef} onMouseDown={onDown}>
      <div class="spz-slider-track"><div class="spz-slider-fill" style={{ width: `${pct}%` }} /></div>
      <div class="spz-slider-thumb" style={{ left: `${pct}%` }} />
    </div>
  )
}

function SliderRow({ param, value, onChange }: { param: SliderParam; value: number; onChange: (v: number) => void }) {
  return (
    <div class="slider-row">
      <div class="slider-row-top">
        <div class="slider-row-label">
          <span class="slider-icon">{param.icon}</span>
          <span class="slider-name">{param.label}</span>
        </div>
        <span class="slider-value">{value.toFixed(2)}</span>
      </div>
      <Slider value={value} onChange={onChange} min={param.min} max={param.max} step={param.step} />
    </div>
  )
}

type Values = Record<string, number>

export function App() {
  const [visible, setVisible] = useState(false)
  const [values, setValues] = useState<Values>({ height: 0, wheelof: 0, wheelor: 0, wheelrf: 0, wheelrr: 0 })

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data
      if (data.type === 'playsound') {
        const audio = new Audio('./audio/' + data.content.file + '.ogg')
        audio.volume = data.content.volume || 0.3
        audio.play().catch(() => {})
      }
      if (data.type === 'show') {
        if (data.content.bool) {
          const c = data.content
          setValues({
            height:  (c.height || 0) * 100,
            wheelof: (c.offset?.[0] || 0) * 100,
            wheelor: (c.offset?.[2] || 0) * 100,
            wheelrf: (c.rotation?.[0] || 0) * 100,
            wheelrr: (c.rotation?.[2] || 0) * 100,
          })
          setVisible(true)
        } else {
          setVisible(false)
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') doClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  const doClose = () => { post('wheelsetting', { bool: true }); post('closecarcontrol'); setVisible(false) }

  const handleChange = useCallback((param: SliderParam, val: number) => {
    setValues(prev => ({ ...prev, [param.id]: val }))
    post(param.event, { val: param.transform(val) })
  }, [])

  if (!visible) return null

  return (
    <div class="stance-overlay">
      <div class="stance-panel">
        <div class="stance-header">
          <span class="stance-icon"><SlidersHorizontal size={18} /></span>
          <div>
            <div class="spz-eyebrow">Vehicle</div>
            <div class="stance-title">Stancer</div>
          </div>
        </div>

        <div class="stance-sliders">
          {PARAMS.map(p => (
            <SliderRow key={p.id} param={p} value={values[p.id]} onChange={val => handleChange(p, val)} />
          ))}
        </div>

        <div class="stance-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span class="spz-kbd">Esc</span>
            <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>cancel</span>
          </div>
          <Button variant="primary" onClick={doClose}><Check size={13} /> Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
