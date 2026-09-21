import { useEffect, useRef } from 'react'
import {
  PHASE_META,
  restNote,
  totalMileage,
  type DayPlan,
  type RouteOption,
} from '../data/itinerary'

interface ItineraryPanelProps {
  days: DayPlan[]
  option: RouteOption
  selectedDay: number | null
  onSelectDay: (day: number | null) => void
}

function DayCard({
  day,
  selected,
  onSelect,
  cardRef,
}: {
  day: DayPlan
  selected: boolean
  onSelect: () => void
  cardRef: (el: HTMLButtonElement | null) => void
}) {
  const phase = PHASE_META[day.phase]
  return (
    <button
      ref={cardRef}
      onClick={onSelect}
      className={`w-full rounded-xl border p-3.5 text-left transition-colors ${
        selected
          ? 'border-blue-500 bg-blue-50/60 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: phase.color }}
        >
          {day.day}
        </span>
        <span className="text-sm font-semibold">
          {day.date} {day.weekday}
        </span>
        {day.holiday && (
          <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-600">
            {day.holiday}
          </span>
        )}
        {day.done && (
          <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[11px] font-medium text-green-600">
            已完成
          </span>
        )}
        <span className="ml-auto shrink-0 text-[13px] text-slate-400">
          {day.mileageKm}km · {day.driveHours}h
        </span>
      </div>
      <div className="mt-1.5 text-[15px] font-medium text-slate-800">{day.title}</div>
      <div className="mt-0.5 text-[13px] text-slate-500">
        {phase.label} · 住：<span className="font-medium text-slate-700">{day.lodging}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {day.highlights.map((h) => (
          <span key={h} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {h}
          </span>
        ))}
      </div>
      {day.note && (
        <div className="mt-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-xs leading-5 text-amber-700">
          {day.note}
        </div>
      )}
    </button>
  )
}

export default function ItineraryPanel({
  days,
  option,
  selectedDay,
  onSelectDay,
}: ItineraryPanelProps) {
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  useEffect(() => {
    if (selectedDay == null) return
    cardRefs.current[selectedDay]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedDay])

  const lastDay = days[days.length - 1]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-100 px-3 py-2 text-[13px] text-slate-500">
        {option.name}｜全程 {days.length} 天 · 约 {totalMileage(days)}km · {lastDay.date} 到家 ·{' '}
        {restNote(days)}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {days.map((day) => (
          <DayCard
            key={`${option.id}-${day.day}`}
            day={day}
            selected={selectedDay === day.day}
            onSelect={() => onSelectDay(selectedDay === day.day ? null : day.day)}
            cardRef={(el) => {
              cardRefs.current[day.day] = el
            }}
          />
        ))}
      </div>
    </div>
  )
}
