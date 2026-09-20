import { useEffect, useRef } from 'react'
import { DAYS, PHASE_META, TOTAL_MILEAGE, type DayPlan } from '../data/itinerary'
import type { OptionId } from './TripMap'

interface ItineraryPanelProps {
  selectedDay: number | null
  onSelectDay: (day: number | null) => void
  optionId: OptionId
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
      className={`w-full rounded-xl border p-3 text-left transition-colors ${
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
          <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600">
            {day.holiday}
          </span>
        )}
        <span className="ml-auto shrink-0 text-xs text-slate-400">
          {day.mileageKm}km · {day.driveHours}h
        </span>
      </div>
      <div className="mt-1.5 text-sm font-medium text-slate-800">{day.title}</div>
      <div className="mt-0.5 text-xs text-slate-500">
        {phase.label} · 住：<span className="font-medium text-slate-700">{day.lodging}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {day.highlights.map((h) => (
          <span
            key={h}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
          >
            {h}
          </span>
        ))}
      </div>
      {day.note && (
        <div className="mt-1.5 rounded-md bg-amber-50 px-2 py-1 text-[11px] leading-4 text-amber-700">
          {day.note}
        </div>
      )}
    </button>
  )
}

export default function ItineraryPanel({ selectedDay, onSelectDay, optionId }: ItineraryPanelProps) {
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  useEffect(() => {
    if (selectedDay == null) return
    cardRefs.current[selectedDay]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedDay])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-100 px-3 py-2 text-xs text-slate-500">
        全程 15 天 · 约 {TOTAL_MILEAGE}km · 10/6-10/7 在家休息
        {(optionId === 'B' || optionId === 'C') && (
          <div className="mt-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
            地图正在预览方案 {optionId}，以下行程单仍为主方案 A
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {DAYS.map((day) => (
          <DayCard
            key={day.day}
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
