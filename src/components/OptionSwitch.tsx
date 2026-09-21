import { ROUTE_OPTIONS, type OptionId } from '../data/itinerary'

interface OptionSwitchProps {
  optionId: OptionId
  onChange: (id: OptionId) => void
}

export default function OptionSwitch({ optionId, onChange }: OptionSwitchProps) {
  return (
    <div className="shrink-0 border-b border-slate-200 p-3">
      <div className="mb-2 text-[13px] font-semibold text-slate-500">回程方案（点击在地图上对比）</div>
      <div className="space-y-2">
        {ROUTE_OPTIONS.map((option) => {
          const selected = option.id === optionId
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                selected
                  ? 'border-green-600 bg-green-50/60 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-slate-800">{option.name}</span>
                {option.recommended && (
                  <span className="rounded-full bg-green-600 px-1.5 py-0.5 text-[11px] font-medium text-white">
                    推荐
                  </span>
                )}
                <span className="ml-auto shrink-0 text-xs text-slate-400">
                  {option.days} · 约{option.distanceKm}km
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">{option.description}</p>
              {selected && (
                <div className="mt-1.5 space-y-1 text-xs leading-5">
                  {option.pros.map((p) => (
                    <div key={p} className="text-green-700">
                      ＋ {p}
                    </div>
                  ))}
                  {option.cons.map((c) => (
                    <div key={c} className="text-rose-600">
                      － {c}
                    </div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
