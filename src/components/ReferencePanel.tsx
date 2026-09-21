import {
  ITINERARIES,
  LODGINGS,
  ROUTE_OPTIONS,
  TICKETS,
  URGENCY_META,
  restNote,
  type BookingItem,
} from '../data/itinerary'

function CompareTable() {
  const attrs: Array<{ label: string; get: (id: keyof typeof ITINERARIES) => string }> = [
    {
      label: '回程天数',
      get: (id) => {
        const total = ITINERARIES[id].length
        return `${total - 11} 天`
      },
    },
    {
      label: '到家/休息',
      get: (id) => {
        const days = ITINERARIES[id]
        return `${days[days.length - 1].date} / ${restNote(days).replace('在家休息', '休')}`
      },
    },
    { label: '风景', get: (id) => ROUTE_OPTIONS.find((o) => o.id === id)!.compare.scenery },
    { label: '最高住宿', get: (id) => ROUTE_OPTIONS.find((o) => o.id === id)!.compare.maxLodging },
    { label: '国庆拥挤', get: (id) => ROUTE_OPTIONS.find((o) => o.id === id)!.compare.crowd },
    { label: '驾驶强度', get: (id) => ROUTE_OPTIONS.find((o) => o.id === id)!.compare.intensity },
    { label: '一句话', get: (id) => ROUTE_OPTIONS.find((o) => o.id === id)!.compare.verdict },
  ]

  const ids = Object.keys(ITINERARIES) as Array<keyof typeof ITINERARIES>

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[11px] leading-4">
        <thead>
          <tr>
            <th className="border border-slate-200 bg-slate-50 px-1.5 py-1 text-left font-medium text-slate-500" />
            {ids.map((id) => {
              const o = ROUTE_OPTIONS.find((r) => r.id === id)!
              return (
                <th
                  key={id}
                  className={`border border-slate-200 px-1.5 py-1 text-center font-semibold ${
                    o.recommended ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {id}
                  {o.recommended && <span className="ml-0.5 text-[9px]">荐</span>}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-200 bg-slate-50 px-1.5 py-1 font-medium text-slate-500">
              里程
            </td>
            {ids.map((id) => (
              <td key={id} className="border border-slate-200 px-1.5 py-1 text-center text-slate-600">
                {ROUTE_OPTIONS.find((o) => o.id === id)!.distanceKm}km
              </td>
            ))}
          </tr>
          {attrs.map((attr) => (
            <tr key={attr.label}>
              <td className="border border-slate-200 bg-slate-50 px-1.5 py-1 font-medium text-slate-500">
                {attr.label}
              </td>
              {ids.map((id) => (
                <td
                  key={id}
                  className="border border-slate-200 px-1.5 py-1 text-center text-slate-600"
                >
                  {attr.get(id)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BookingCard({ item, index }: { item: BookingItem; index: number }) {
  const meta = URGENCY_META[item.urgency]
  return (
    <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-semibold text-slate-800">{item.name}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${meta.className}`}
          >
            {meta.label}
          </span>
        </div>
        <div className="mt-0.5 text-[11px] text-slate-500">
          {item.date}
          {item.price ? ` · ${item.price}` : ''}
        </div>
        {item.channel && (
          <div className="mt-0.5 text-[11px] text-slate-500">渠道：{item.channel}</div>
        )}
        <div className="mt-0.5 text-[11px] leading-4 text-slate-600">{item.reason}</div>
      </div>
    </div>
  )
}

export default function ReferencePanel() {
  return (
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-3">
      <section>
        <h3 className="mb-2 text-xs font-semibold text-slate-500">回程方案对比</h3>
        <CompareTable />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold text-slate-500">门票预定（按紧迫度）</h3>
        <div className="space-y-2">
          {TICKETS.map((t, i) => (
            <BookingCard key={t.name} item={t} index={i} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold text-slate-500">住宿预定（按紧俏程度）</h3>
        <div className="space-y-2">
          {LODGINGS.map((l, i) => (
            <BookingCard key={l.name} item={l} index={i} />
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-4 text-slate-400">
          大柴旦、扎尕那优先选"可免费取消"的房源，行程微调可无损退改。
        </p>
      </section>
    </div>
  )
}
