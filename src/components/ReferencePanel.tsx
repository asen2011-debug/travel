import {
  ITINERARIES,
  LODGINGS,
  ROUTE_OPTIONS,
  TICKETS,
  URGENCY_META,
  restNote,
  type BookingItem,
  type OptionId,
} from '../data/itinerary'

const OPTION_IDS: OptionId[] = ['A', 'B', 'C', 'D']

function optionMeta(id: OptionId) {
  return ROUTE_OPTIONS.find((o) => o.id === id)!
}

const ATTRS: Array<{ label: string; get: (id: OptionId) => string }> = [
  { label: '回程天数', get: (id) => `${ITINERARIES[id].length - 11} 天` },
  { label: '回程里程', get: (id) => `约 ${optionMeta(id).distanceKm}km` },
  {
    label: '到家/休息',
    get: (id) => {
      const days = ITINERARIES[id]
      return `${days[days.length - 1].date} 到家 · ${restNote(days)}`
    },
  },
  { label: '风景', get: (id) => optionMeta(id).compare.scenery },
  { label: '最高住宿', get: (id) => optionMeta(id).compare.maxLodging },
  { label: '国庆拥挤', get: (id) => optionMeta(id).compare.crowd },
  { label: '驾驶强度', get: (id) => optionMeta(id).compare.intensity },
  { label: '一句话', get: (id) => optionMeta(id).compare.verdict },
]

/** 宽屏：四方案对比表 */
function CompareTable() {
  return (
    <table className="hidden w-full border-collapse text-[13px] leading-5 sm:table">
      <thead>
        <tr>
          <th className="w-20 border border-slate-200 bg-slate-50 px-2 py-1.5 text-left font-medium text-slate-500" />
          {OPTION_IDS.map((id) => {
            const o = optionMeta(id)
            return (
              <th
                key={id}
                className={`border border-slate-200 px-2 py-1.5 text-center font-semibold ${
                  o.recommended ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-700'
                }`}
              >
                {o.name.replace('方案 ', '')}
                {o.recommended && (
                  <span className="ml-1 rounded-full bg-green-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    推荐
                  </span>
                )}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {ATTRS.map((attr) => (
          <tr key={attr.label}>
            <td className="border border-slate-200 bg-slate-50 px-2 py-1.5 font-medium text-slate-500">
              {attr.label}
            </td>
            {OPTION_IDS.map((id) => (
              <td key={id} className="border border-slate-200 px-2 py-1.5 text-center text-slate-700">
                {attr.get(id)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** 窄屏：每方案一张卡片，属性逐行展示 */
function CompareCards() {
  return (
    <div className="space-y-3 sm:hidden">
      {OPTION_IDS.map((id) => {
        const o = optionMeta(id)
        return (
          <div
            key={id}
            className={`rounded-xl border p-3 ${
              o.recommended ? 'border-green-300 bg-green-50/50' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-[15px] font-semibold text-slate-800">{o.name}</span>
              {o.recommended && (
                <span className="rounded-full bg-green-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  推荐
                </span>
              )}
            </div>
            {ATTRS.map((attr) => (
              <div key={attr.label} className="flex justify-between gap-3 py-0.5 text-[13px]">
                <span className="shrink-0 text-slate-400">{attr.label}</span>
                <span className="text-right text-slate-700">{attr.get(id)}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function BookingCard({ item, index }: { item: BookingItem; index: number }) {
  const meta = URGENCY_META[item.urgency]
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold text-slate-800">{item.name}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}>
            {meta.label}
          </span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {item.date}
          {item.price ? ` · ${item.price}` : ''}
        </div>
        {item.channel && <div className="mt-0.5 text-xs text-slate-500">渠道：{item.channel}</div>}
        <div className="mt-1 text-xs leading-5 text-slate-600">{item.reason}</div>
      </div>
    </div>
  )
}

export default function ReferencePanel() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">回程方案对比</h3>
        <CompareTable />
        <CompareCards />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">门票预定（按紧迫度）</h3>
        <div className="space-y-2">
          {TICKETS.map((t, i) => (
            <BookingCard key={t.name} item={t} index={i} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">住宿预定（按紧俏程度）</h3>
        <div className="space-y-2">
          {LODGINGS.map((l, i) => (
            <BookingCard key={l.name} item={l} index={i} />
          ))}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          大柴旦、扎尕那优先选"可免费取消"的房源，行程微调可无损退改。
        </p>
      </section>
    </div>
  )
}
