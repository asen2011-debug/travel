import { useEffect, useRef } from 'react'
import L from 'leaflet'
import {
  DAYS,
  PHASE_META,
  PLACES,
  ROUTE_OPTIONS,
  type Coord,
  type DayPlan,
  type RouteOption,
} from '../data/itinerary'
import routeGeometry from '../data/routeGeometry.json'

const GEOMETRY = routeGeometry as unknown as Record<string, Coord[]>

export type OptionId = 'A' | 'B' | 'C' | 'D'

interface TripMapProps {
  optionId: OptionId
  selectedDay: number | null
  onSelectDay: (day: number | null) => void
}

function dayLatLngs(day: DayPlan): Coord[] {
  return GEOMETRY[`day-${day.day}`] ?? day.path
}

function optionLatLngs(option: RouteOption): Coord[] {
  return GEOMETRY[`option-${option.id}`] ?? option.path
}

function popupHtml(day: DayPlan): string {
  const phase = PHASE_META[day.phase]
  const highlights = day.highlights.map((h) => `<li>${h}</li>`).join('')
  const note = day.note
    ? `<div style="margin-top:6px;color:#b45309">提示：${day.note}</div>`
    : ''
  return `
    <div style="min-width:210px">
      <div style="font-weight:700;font-size:14px">D${day.day} · ${day.date} ${day.weekday}${day.holiday ? ` · ${day.holiday}` : ''}</div>
      <div style="margin:2px 0;color:${phase.color};font-weight:600">${phase.label}｜住：${day.lodging}</div>
      <div style="color:#64748b">${day.title} · ${day.mileageKm}km / 约${day.driveHours}h</div>
      <ul style="margin:6px 0 0;padding-left:18px">${highlights}</ul>
      ${note}
    </div>`
}

const ALL_POINTS: Coord[] = [...DAYS.flatMap((d) => d.path), ...ROUTE_OPTIONS[0].path]

export default function TripMap({ optionId, selectedDay, onSelectDay }: TripMapProps) {
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

    map.fitBounds(L.latLngBounds(ALL_POINTS), { padding: [30, 30] })

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

    const option = ROUTE_OPTIONS.find((o) => o.id === optionId) ?? ROUTE_OPTIONS[0]
    const returnDaysVisible = optionId === 'A' || optionId === 'D'
    const bounds: Coord[] = []

    // 未选中的方案：灰色虚线弱显示，便于对比
    for (const o of ROUTE_OPTIONS) {
      if (o.id === optionId) continue
      if (o.id === 'A' && returnDaysVisible) continue
      const latlngs = optionLatLngs(o)
      L.polyline(latlngs, {
        color: '#94a3b8',
        weight: 2,
        dashArray: '6 8',
        opacity: 0.55,
        interactive: false,
      }).addTo(group)
      const mid = latlngs[Math.floor(latlngs.length / 2)]
      L.tooltip({ permanent: true, direction: 'center', className: 'option-label', interactive: false })
        .setLatLng(mid)
        .setContent(o.name)
        .addTo(group)
    }

    // 起点（家）
    L.marker(PLACES.home, {
      icon: L.divIcon({
        className: '',
        html: '<div class="home-marker">家</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    })
      .bindTooltip('家 · 获嘉县亢村镇', {
        permanent: true,
        direction: 'bottom',
        offset: [0, 16],
        className: 'lodging-label',
      })
      .addTo(group)

    // 逐日主线路段 + 住宿点
    const seenLodging = new Map<string, number>()
    for (const day of DAYS) {
      if (day.phase === 'return' && !returnDaysVisible) continue
      if (optionId === 'D' && option.replacesDays?.includes(day.day)) continue

      const latlngs = dayLatLngs(day)
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
        .bringToFront()

      // 同一城市多晚住宿时错开标记
      const count = seenLodging.get(day.lodging) ?? 0
      seenLodging.set(day.lodging, count + 1)
      const angle = count * 2.1
      const r = 0.035 * count
      const mCoord: Coord = [
        day.lodgingCoord[0] + r * Math.sin(angle),
        day.lodgingCoord[1] + r * Math.cos(angle),
      ]

      const marker = L.marker(mCoord, {
        icon: L.divIcon({
          className: '',
          html: `<div class="lodging-marker" style="--marker-color:${color}">${day.day}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
      })
        .bindTooltip(`${day.date} ${day.lodging}`, {
          permanent: true,
          direction: 'top',
          offset: [0, -15],
          className: 'lodging-label',
        })
        .bindPopup(popupHtml(day), { className: 'trip-popup' })
        .on('click', () => onSelectDay(day.day))
        .addTo(group)
      markersRef.current[day.day] = marker
    }

    // 选中的备选方案（B/C/D）：实线路径 + 途经点
    if (optionId !== 'A') {
      const latlngs = optionLatLngs(option)
      bounds.push(...latlngs)
      L.polyline(latlngs, {
        color: optionId === 'D' ? PHASE_META.loop.color : PHASE_META.return.color,
        weight: 5,
        opacity: 0.9,
      }).addTo(group)
      for (const stop of option.stops) {
        L.circleMarker(stop.coord, {
          radius: 6,
          color: '#0f766e',
          weight: 2,
          fillColor: '#fff',
          fillOpacity: 1,
        })
          .bindTooltip(`${stop.date ? `${stop.date} ` : ''}${stop.name}`, {
            permanent: true,
            direction: 'top',
            offset: [0, -8],
            className: 'option-stop-label',
          })
          .addTo(group)
      }
    }

    // 切换方案时重新取景
    if (prevOptionRef.current !== optionId) {
      prevOptionRef.current = optionId
      map.flyToBounds(L.latLngBounds(bounds), { padding: [40, 40] })
    }
  }, [optionId, selectedDay, onSelectDay])

  // 选中某天：飞行定位 + 打开弹窗
  useEffect(() => {
    const map = mapRef.current
    if (!map || selectedDay == null) return
    const day = DAYS.find((d) => d.day === selectedDay)
    if (!day) return
    map.flyToBounds(L.latLngBounds(dayLatLngs(day)), { padding: [60, 60], maxZoom: 9 })
    markersRef.current[selectedDay]?.openPopup()
  }, [selectedDay])

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
