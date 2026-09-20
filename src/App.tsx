import { useState } from 'react'
import TripMap, { type OptionId } from './components/TripMap'
import ItineraryPanel from './components/ItineraryPanel'
import OptionSwitch from './components/OptionSwitch'
import { KEY_TIPS } from './data/itinerary'

export default function App() {
  const [optionId, setOptionId] = useState<OptionId>('A')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const sidebar = (
    <>
      <OptionSwitch optionId={optionId} onChange={setOptionId} />
      <ItineraryPanel selectedDay={selectedDay} onSelectDay={setSelectedDay} optionId={optionId} />
    </>
  )

  return (
    <div className="flex h-full flex-col bg-slate-50 text-slate-800">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h1 className="text-lg font-bold">青甘大环线自驾路线图</h1>
          <span className="text-sm text-slate-500">
            2026 婚假之旅 · 9/21 获嘉亢村出发 — 10/5 到家 · 两人轮换驾驶
          </span>
        </div>
        <div className="mt-1.5 flex gap-2 overflow-x-auto pb-0.5">
          {KEY_TIPS.map((tip) => (
            <span
              key={tip}
              className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs text-amber-800"
            >
              {tip}
            </span>
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[380px] shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
          {sidebar}
        </aside>

        <main className="relative min-w-0 flex-1">
          <TripMap optionId={optionId} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

          <button
            onClick={() => setPanelOpen(true)}
            className="absolute right-4 bottom-6 z-[1001] rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg md:hidden"
          >
            行程单
          </button>

          {panelOpen && (
            <div className="absolute inset-0 z-[1002] flex flex-col bg-white md:hidden">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-2.5">
                <span className="font-semibold">行程单与方案</span>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                >
                  关闭
                </button>
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{sidebar}</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
