import { useEffect, useRef } from 'react'
import L from 'leaflet'
import {
  ITINERARIES,
  PHASE_META,
  ROUTE_OPTIONS,
  type Coord,
  type DayPlan,
  type OptionId,
} from '../data/itinerary'
import routeGeometry from '../data/routeGeometry.json'

const GEOMETRY = routeGeometry as unknown as Record<string, Coord[]>

interface TripMapProps {
  days: DayPlan[]
  optionId: OptionId
  selectedDay: number | null
  onSelectDay: (day: number | null) => void
}

interface LodgingGroup {
  city: string
  coord: Coord
  days: DayPlan[]
}

/** 同一城市的多个住宿日期合并为一个标记组 */
function buildGroups(days: DayPlan[]): LodgingGroup[] {
  const byCity = new Map<string, LodgingGroup>()
  for (const day of days) {
    let g = byCity.get(day.lodging)
    if (!g) {
      g = { city: day.lodging, coord: day.lodgingCoord, days: [] }
      byCity.set(day.lodging, g)
    }
    g.days.push(day)
  }
  return [...byCity.values()]
}

/** ["9/25","9/26"] -> "9/25·26"；["9/22","10/4"] -> "9/22·10/4" */
function compactDates(days: DayPlan[]): string {
  const parts: string[] = []
  let prevMonth = ''
  for (const d of days) {
    const [m, dd] = d.date.split('/')
    parts.push(m === prevMonth ? dd : d.date)
    prevMonth = m
  }
  return parts.join('·')
}

function dayBlockHtml(day: DayPlan): string {
  const phase = PHASE_META[day.phase]
  const highlights = day.highlights.map((h) => `<li>${h}</li>`).join('')
  const note = day.note
    ? `<div style="margin-top:6px;color:#b45309">提示：${day.note}</div>`
    : ''
  return `
    <div>
      <div style="font-weight:700;font-size:14px">D${day.day} · ${day.date} ${day.weekday}${day.holiday ? ` · ${day.holiday}` : ''}</div>
      <div style="margin:2px 0;color:${phase.color};font-weight:600">${phase.label}｜住：${day.lodging}</div>
      <div style="color:#64748b">${day.title} · ${day.mileageKm}km / 约${day.driveHours}h</div>
      <ul style="margin:6px 0 0;padding-left:18px">${highlights}</ul>
      ${note}
    </div>`
}

function groupPopupHtml(g: LodgingGroup): string {
  const sep = '<hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0">'
  return `<div style="min-width:220px">${g.days.map(dayBlockHtml).join(sep)}</div>`
}

export default function TripMap({ days, optionId, selectedDay, onSelectDay }: TripMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const groupRef = useRef<L.LayerGroup | null>(null)
  const markersRef = useRef<Record<number, L.Marker>>({})
  const prevOptionRef = useRef<OptionId>(optionId)

  // 初始化地图（仅一次）
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      center: [36.5, 102],
      zoom: 5,
      minZoom: 4,
      zoomControl: true,
    })

    const gaode = L.tileLayer(
      'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      { subdomains: ['1', '2', '3', '4'], attribution: '&copy; 高德地图', maxZoom: 18 },
    )
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    })
    gaode.addTo(map)
    L.control
      .layers({ 高德地图: gaode, OpenStreetMap: osm }, undefined, { position: 'topright' })
      .addTo(map)
    L.control.scale({ position: 'bottomright' }).addTo(map)

    const allPoints = ITINERARIES.A.flatMap((d) => GEOMETRY[d.legId] ?? d.path)
    map.fitBounds(L.latLngBounds(allPoints), { padding: [30, 30] })

    const group = L.layerGroup().addTo(map)
    groupRef.current = group
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      groupRef.current = null
    }
  }, [])

  // 绘制/重绘路线与标记
  useEffect(() => {
    const map = mapRef.current
    const group = groupRef.current
    if (!map || !group) return

    group.clearLayers()
    markersRef.current = {}
    const bounds: Coord[] = []

    // 未选中的方案：灰色虚线弱显示，便于对比
    for (const o of ROUTE_OPTIONS) {
      if (o.id === optionId) continue
      const latlngs = GEOMETRY[`option-${o.id}`] ?? o.path
      L.polyline(latlngs, {
        color: '#94a3b8',
        weight: 2,
        dashArray: '6 8',
        opacity: 0.55,
        interactive: false,
      }).addTo(group)
      const mid = latlngs[Math.floor(latlngs.length / 2)]
      L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'option-label',
        interactive: false,
      })
        .setLatLng(mid)
        .setContent(o.name)
        .addTo(group)
    }

    // 当前方案：逐日路段
    for (const day of days) {
      const latlngs = GEOMETRY[day.legId] ?? day.path
      bounds.push(...latlngs)
      const color = PHASE_META[day.phase].color
      const isSelected = selectedDay === day.day
      L.polyline(latlngs, {
        color,
        weight: isSelected ? 7 : 4,
        opacity: isSelected ? 1 : 0.85,
      })
        .on('click', () => onSelectDay(day.day))
        .addTo(group)
    }

    // 当前方案：住宿点（同一城市多晚合并为一个标记）
    for (const g of buildGroups(days)) {
      const isHome = g.city === '家'
      const multi = g.days.length > 1
      const containsSelected = g.days.some((d) => d.day === selectedDay)
      const color = PHASE_META[g.days[0].phase].color
      const html = isHome
        ? `<div class="home-marker${containsSelected ? ' selected' : ''}">家</div>`
        : `<div class="lodging-marker${multi ? ' lodging-marker-multi' : ''}${containsSelected ? ' selected' : ''}" style="--marker-color:${color}">${g.days.map((d) => d.day).join('·')}</div>`
      const size: [number, number] = isHome ? [30, 30] : multi ? [42, 26] : [26, 26]

      const marker = L.marker(g.coord, {
        icon: L.divIcon({
          className: '',
          html,
          iconSize: size,
          iconAnchor: [size[0] / 2, size[1] / 2],
        }),
      })
        .bindTooltip(`${compactDates(g.days)} ${g.city}`, {
          permanent: true,
          direction: 'top',
          offset: [0, -15],
          className: 'lodging-label',
        })
        .bindPopup(groupPopupHtml(g), { className: 'trip-popup' })
        .on('click', () => {
          // 同城多晚：重复点击在各天之间循环切换
          const idx = g.days.findIndex((d) => d.day === selectedDay)
          onSelectDay(g.days[(idx + 1) % g.days.length].day)
        })
        .addTo(group)
      for (const d of g.days) markersRef.current[d.day] = marker
    }

    // 切换方案时重新取景
    if (prevOptionRef.current !== optionId) {
      prevOptionRef.current = optionId
      map.flyToBounds(L.latLngBounds(bounds), { padding: [40, 40] })
    }
  }, [days, optionId, selectedDay, onSelectDay])

  // 选中某天：飞行定位 + 打开弹窗
  useEffect(() => {
    const map = mapRef.current
    if (!map || selectedDay == null) return
    const day = days.find((d) => d.day === selectedDay)
    if (!day) return
    map.flyToBounds(L.latLngBounds(GEOMETRY[day.legId] ?? day.path), {
      padding: [60, 60],
      maxZoom: 9,
    })
    markersRef.current[selectedDay]?.openPopup()
  }, [selectedDay, days])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute top-24 left-3 z-[1000] rounded-lg bg-white/90 px-3 py-2 text-xs leading-6 shadow-md backdrop-blur">
        {(Object.keys(PHASE_META) as Array<keyof typeof PHASE_META>).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="inline-block h-1 w-6 rounded"
              style={{ background: PHASE_META[key].color }}
            />
            <span>{PHASE_META[key].label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-slate-400">
          <span className="inline-block h-0 w-6 border-t-2 border-dashed border-slate-400" />
          <span>备选方案</span>
        </div>
      </div>
    </div>
  )
}
