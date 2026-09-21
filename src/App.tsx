import { useMemo, useState } from 'react'
import TripMap from './components/TripMap'
import ItineraryPanel from './components/ItineraryPanel'
import OptionSwitch from './components/OptionSwitch'
import ReferencePanel from './components/ReferencePanel'
import Modal from './components/Modal'
import { ITINERARIES, KEY_TIPS, ROUTE_OPTIONS, type OptionId } from './data/itinerary'

export default function App() {
  const [optionId, setOptionId] = useState<OptionId>('A')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [refOpen, setRefOpen] = useState(false)

  const days = useMemo(() => ITINERARIES[optionId], [optionId])
  const option = ROUTE_OPTIONS.find((o) => o.id === optionId) ?? ROUTE_OPTIONS[0]

  const handleOptionChange = (id: OptionId) => {
    setOptionId(id)
    setSelectedDay(null)
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 text-slate-800">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-lg font-bold">青甘大环线自驾路线图</h1>
          <span className="text-sm text-slate-500">
            2026 婚假之旅 · 9/20 获嘉亢村出发 — 10/5 到家 · 两人轮换驾驶
          </span>
          <button
            onClick={() => setRefOpen(true)}
            className="ml-auto hidden rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 md:inline-block"
          >
            对比与预定
          </button>
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
        <aside className="hidden w-[400px] shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
          <OptionSwitch optionId={optionId} onChange={handleOptionChange} />
          <ItineraryPanel
            days={days}
            option={option}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </aside>

        <main className="relative min-w-0 flex-1">
          <TripMap
            days={days}
            optionId={optionId}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          {/* 移动端底部操作栏 */}
          <div className="absolute inset-x-3 bottom-5 z-[1001] flex gap-2 md:hidden">
            <button
              onClick={() => setPanelOpen(true)}
              className="flex-1 rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg"
            >
              行程单
            </button>
            <button
              onClick={() => setRefOpen(true)}
              className="flex-1 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 shadow-lg"
            >
              对比·预定
            </button>
          </div>

          {/* 移动端行程单全屏面板 */}
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
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <OptionSwitch optionId={optionId} onChange={handleOptionChange} />
                <ItineraryPanel
                  days={days}
                  option={option}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 对比与预定：桌面居中大弹窗，移动端全屏 */}
      <Modal open={refOpen} onClose={() => setRefOpen(false)} title="方案对比与立即预定清单">
        <ReferencePanel />
      </Modal>
    </div>
  )
}
