// 构建期调用 OSRM 公共接口，把每天的行程路径贴到真实公路上。
// 结果写入 src/data/routeGeometry.json；个别路段失败时前端回退为直线连线。
import { writeFileSync } from 'node:fs'
import { DAYS, ROUTE_OPTIONS } from '../src/data/itinerary.ts'

const OSRM = 'https://router.project-osrm.org/route/v1/driving'

// Douglas-Peucker 抽稀：概览缩放下 100m 精度足够，体积可降一个量级
function simplify(points, tolerance = 0.001) {
  if (points.length <= 2) return points
  const sqTol = tolerance * tolerance
  const sqDistToSegment = (p, a, b) => {
    let [x, y] = a
    let [dx, dy] = [b[0] - x, b[1] - y]
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy)
      if (t > 1) [x, y] = b
      else if (t > 0) [x, y] = [x + dx * t, y + dy * t]
    }
    return (p[0] - x) ** 2 + (p[1] - y) ** 2
  }
  const keep = new Uint8Array(points.length)
  keep[0] = keep[points.length - 1] = 1
  const stack = [[0, points.length - 1]]
  while (stack.length) {
    const [first, last] = stack.pop()
    let maxSq = 0
    let index = -1
    for (let i = first + 1; i < last; i++) {
      const sq = sqDistToSegment(points[i], points[first], points[last])
      if (sq > maxSq) {
        maxSq = sq
        index = i
      }
    }
    if (maxSq > sqTol && index > 0) {
      keep[index] = 1
      stack.push([first, index], [index, last])
    }
  }
  return points.filter((_, i) => keep[i])
}

async function fetchRoute(path) {
  const coords = path.map(([lat, lng]) => `${lng},${lat}`).join(';')
  const url = `${OSRM}/${coords}?overview=full&geometries=geojson`
  const res = await fetch(url, { signal: AbortSignal.timeout(25000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (json.code !== 'Ok') throw new Error(json.code)
  const pts = json.routes[0].geometry.coordinates.map(([lng, lat]) => [
    Math.round(lat * 1e5) / 1e5,
    Math.round(lng * 1e5) / 1e5,
  ])
  return simplify(pts)
}

const tasks = [
  ...DAYS.map((d) => [`day-${d.day}`, d.path]),
  ...ROUTE_OPTIONS.map((o) => [`option-${o.id}`, o.path]),
]

const out = {}
for (const [key, path] of tasks) {
  try {
    out[key] = await fetchRoute(path)
    console.log(`ok   ${key} (${out[key].length} pts)`)
  } catch (e) {
    console.warn(`fail ${key}: ${e.message} -> 前端将回退为直线`)
  }
  await new Promise((r) => setTimeout(r, 400))
}

writeFileSync('src/data/routeGeometry.json', JSON.stringify(out))
console.log(`done: ${Object.keys(out).length}/${tasks.length} routes written`)
