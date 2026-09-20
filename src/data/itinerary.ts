export type Phase = 'outbound' | 'loop' | 'return'

export type Coord = [number, number] // [lat, lng]

export interface DayPlan {
  day: number
  date: string
  weekday: string
  holiday?: string
  title: string
  lodging: string
  lodgingCoord: Coord
  mileageKm: number
  driveHours: number
  highlights: string[]
  note?: string
  phase: Phase
  path: Coord[]
}

export interface OptionStop {
  name: string
  coord: Coord
  date?: string
}

export interface RouteOption {
  id: 'A' | 'B' | 'C' | 'D'
  name: string
  days: string
  distanceKm: number
  description: string
  pros: string[]
  cons: string[]
  recommended?: boolean
  /** 回程路径（从西宁到家）；方案 D 为环线改道路径 */
  path: Coord[]
  stops: OptionStop[]
  /** 方案 D 专用：替换主线第几天 */
  replacesDays?: number[]
}

export const PHASE_META: Record<Phase, { label: string; color: string }> = {
  outbound: { label: '去程', color: '#2563eb' },
  loop: { label: '环线', color: '#ea580c' },
  return: { label: '回程', color: '#16a34a' },
}

// 主要地点坐标 [lat, lng]
export const PLACES = {
  home: [35.2, 113.69] as Coord, // 新乡获嘉县亢村镇
  luoyang: [34.62, 112.45] as Coord,
  xian: [34.34, 108.94] as Coord,
  baoji: [34.36, 107.24] as Coord,
  tianshui: [34.58, 105.72] as Coord,
  lanzhou: [36.06, 103.83] as Coord,
  xining: [36.62, 101.78] as Coord,
  taersi: [36.49, 101.57] as Coord, // 塔尔寺
  qinghaihu: [36.59, 100.47] as Coord, // 青海湖二郎剑
  heimahe: [36.78, 99.79] as Coord,
  chaka: [36.79, 99.08] as Coord, // 茶卡镇
  delingha: [37.37, 97.36] as Coord,
  dachaidan: [37.85, 95.36] as Coord, // 大柴旦
  uRoad: [38.02, 93.95] as Coord, // G315 U型公路
  dongtai: [37.86, 93.6] as Coord, // 东台吉乃尔湖
  waterYadan: [38.17, 92.65] as Coord, // 水上雅丹
  dangjinshan: [39.2, 94.42] as Coord, // 当金山口
  aksai: [39.63, 94.34] as Coord,
  dunhuang: [40.14, 94.66] as Coord,
  mogaoku: [40.04, 94.81] as Coord, // 莫高窟
  jiayuguan: [39.77, 98.29] as Coord,
  zhangye: [38.93, 100.45] as Coord,
  biandukou: [38.35, 100.93] as Coord, // 扁都口
  ebao: [37.79, 101.05] as Coord, // 峨堡/祁连草原
  menyuan: [37.38, 101.62] as Coord, // 门源
  dabanshan: [37.2, 101.5] as Coord, // 达坂山
  tongren: [35.52, 102.02] as Coord, // 同仁
  xiahe: [35.2, 102.52] as Coord, // 夏河
  sangke: [35.1, 102.4] as Coord, // 桑科草原
  gahai: [34.48, 102.57] as Coord, // 尕海
  langmusi: [34.09, 102.63] as Coord, // 郎木寺
  diebu: [34.06, 103.22] as Coord, // 迭部
  zhagana: [34.23, 103.34] as Coord, // 扎尕那
  lazikou: [34.28, 103.65] as Coord, // 腊子口
  dangchang: [34.05, 104.39] as Coord, // 宕昌
  longnan: [33.4, 104.92] as Coord, // 陇南
  chengxian: [33.74, 105.72] as Coord, // 成县
  sanmenxia: [34.77, 111.2] as Coord,
  weinan: [34.5, 109.5] as Coord,
  // 方案 B 川北线
  ruoergai: [33.58, 102.96] as Coord, // 若尔盖
  tangke: [33.79, 102.45] as Coord, // 唐克 九曲黄河第一湾
  hongyuan: [32.79, 102.54] as Coord, // 红原
  wenchuan: [31.48, 103.59] as Coord,
  chengdu: [30.57, 104.07] as Coord,
  // 方案 D 青藏线
  golmud: [36.4, 94.9] as Coord, // 格尔木
  kunlunPass: [35.66, 94.07] as Coord, // 昆仑山口
  hohxil: [35.6, 93.88] as Coord, // 可可西里索南达杰保护站
}

const P = PLACES

export const DAYS: DayPlan[] = [
  {
    day: 1,
    date: '9/21',
    weekday: '周一',
    title: '亢村 → 洛阳',
    lodging: '洛阳',
    lodgingCoord: P.luoyang,
    mileageKm: 180,
    driveHours: 2.5,
    highlights: ['龙门石窟', '应天门/洛邑古城夜景'],
    phase: 'outbound',
    path: [P.home, P.sanmenxia, P.luoyang],
  },
  {
    day: 2,
    date: '9/22',
    weekday: '周二',
    title: '洛阳 → 西安',
    lodging: '西安',
    lodgingCoord: P.xian,
    mileageKm: 370,
    driveHours: 4.5,
    highlights: ['兵马俑', '大唐不夜城'],
    phase: 'outbound',
    path: [P.luoyang, P.sanmenxia, P.weinan, P.xian],
  },
  {
    day: 3,
    date: '9/23',
    weekday: '周三',
    title: '西安 → 西宁',
    lodging: '西宁',
    lodgingCoord: P.xining,
    mileageKm: 850,
    driveHours: 10,
    highlights: ['全程高速赶路', '中午兰州吃牛肉面'],
    note: '全程最辛苦的一天，两人每 2-3 小时轮换',
    phase: 'outbound',
    path: [P.xian, P.baoji, P.tianshui, P.lanzhou, P.xining],
  },
  {
    day: 4,
    date: '9/24',
    weekday: '周四',
    title: '西宁 → 塔尔寺 → 青海湖 → 茶卡',
    lodging: '茶卡',
    lodgingCoord: P.chaka,
    mileageKm: 330,
    driveHours: 6,
    highlights: ['塔尔寺', '青海湖（二郎剑）'],
    note: '早 7:30 出发，塔尔寺游览约 2 小时',
    phase: 'loop',
    path: [P.xining, P.taersi, P.qinghaihu, P.heimahe, P.chaka],
  },
  {
    day: 5,
    date: '9/25',
    weekday: '周五',
    holiday: '中秋节',
    title: '茶卡盐湖 → 大柴旦',
    lodging: '大柴旦',
    lodgingCoord: P.dachaidan,
    mileageKm: 400,
    driveHours: 4.5,
    highlights: ['茶卡盐湖（赶早进）', '大柴旦翡翠湖（傍晚）'],
    note: '中秋小长假，大柴旦住宿紧俏，提前订',
    phase: 'loop',
    path: [P.chaka, P.delingha, P.dachaidan],
  },
  {
    day: 6,
    date: '9/26',
    weekday: '周六',
    title: 'G315 → 水上雅丹（往返）',
    lodging: '大柴旦',
    lodgingCoord: P.dachaidan,
    mileageKm: 430,
    driveHours: 6,
    highlights: ['U型公路', '东台吉乃尔湖（顺路看水情）', '乌素特水上雅丹'],
    note: '大柴旦满油出发，G315 加油站间距远；勿在 U 型公路路中拍照',
    phase: 'loop',
    path: [P.dachaidan, P.uRoad, P.dongtai, P.waterYadan, P.dongtai, P.uRoad, P.dachaidan],
  },
  {
    day: 7,
    date: '9/27',
    weekday: '周日',
    title: '大柴旦 → 当金山 → 敦煌',
    lodging: '敦煌',
    lodgingCoord: P.dunhuang,
    mileageKm: 350,
    driveHours: 5,
    highlights: ['当金山口（海拔3648m）', '鸣沙山月牙泉日落'],
    phase: 'loop',
    path: [P.dachaidan, P.dangjinshan, P.aksai, P.dunhuang],
  },
  {
    day: 8,
    date: '9/28',
    weekday: '周一',
    title: '敦煌一日游',
    lodging: '敦煌',
    lodgingCoord: P.dunhuang,
    mileageKm: 50,
    driveHours: 1,
    highlights: ['莫高窟（上午）', '沙洲夜市'],
    note: '莫高窟 A 类票提前 30 天抢；抢不到用 B 类应急票（提前一天线上或当日现场）',
    phase: 'loop',
    path: [P.dunhuang, P.mogaoku, P.dunhuang],
  },
  {
    day: 9,
    date: '9/29',
    weekday: '周二',
    title: '敦煌 → 嘉峪关 → 张掖',
    lodging: '张掖',
    lodgingCoord: P.zhangye,
    mileageKm: 590,
    driveHours: 7,
    highlights: ['嘉峪关关城（停留约 2 小时）'],
    phase: 'loop',
    path: [P.dunhuang, P.jiayuguan, P.zhangye],
  },
  {
    day: 10,
    date: '9/30',
    weekday: '周三',
    title: '张掖 → 祁连草原 → 门源 → 西宁',
    lodging: '西宁',
    lodgingCoord: P.xining,
    mileageKm: 380,
    driveHours: 6.5,
    highlights: ['七彩丹霞（赶早）', '扁都口', '祁连草原', '达坂山观景台'],
    note: 'G227 国道为主，避开高速出城高峰；达坂山 10 月初可能降雪',
    phase: 'loop',
    path: [P.zhangye, P.biandukou, P.ebao, P.menyuan, P.dabanshan, P.xining],
  },
  {
    day: 11,
    date: '10/1',
    weekday: '周四',
    holiday: '国庆节',
    title: '西宁 → 甘加草原 → 夏河',
    lodging: '夏河',
    lodgingCoord: P.xiahe,
    mileageKm: 240,
    driveHours: 4,
    highlights: ['甘加草原', '拉卜楞寺'],
    note: '国庆首日，早出发；高速开始免费',
    phase: 'return',
    path: [P.xining, P.tongren, P.xiahe],
  },
  {
    day: 12,
    date: '10/2',
    weekday: '周五',
    title: '夏河 → 桑科草原 → 郎木寺 → 扎尕那',
    lodging: '扎尕那',
    lodgingCoord: P.zhagana,
    mileageKm: 285,
    driveHours: 5.5,
    highlights: ['桑科草原', '郎木寺镇', '扎尕那日落'],
    note: '扎尕那国庆高峰，住宿务必提前订',
    phase: 'return',
    path: [P.xiahe, P.sangke, P.gahai, P.langmusi, P.diebu, P.zhagana],
  },
  {
    day: 13,
    date: '10/3',
    weekday: '周六',
    title: '扎尕那 → 腊子口 → 陇南',
    lodging: '陇南',
    lodgingCoord: P.longnan,
    mileageKm: 280,
    driveHours: 5.5,
    highlights: ['扎尕那晨景', '腊子口峡谷'],
    note: '山区弯道多，控制车速',
    phase: 'return',
    path: [P.zhagana, P.diebu, P.lazikou, P.dangchang, P.longnan],
  },
  {
    day: 14,
    date: '10/4',
    weekday: '周日',
    title: '陇南 → 天水 → 宝鸡 → 西安',
    lodging: '西安',
    lodgingCoord: P.xian,
    mileageKm: 530,
    driveHours: 6.5,
    highlights: ['纯赶路（高速免费）'],
    note: '8 点前出发，避开午后高峰',
    phase: 'return',
    path: [P.longnan, P.chengxian, P.tianshui, P.baoji, P.xian],
  },
  {
    day: 15,
    date: '10/5',
    weekday: '周一',
    title: '西安 → 洛阳 → 获嘉',
    lodging: '家',
    lodgingCoord: P.home,
    mileageKm: 550,
    driveHours: 6.5,
    highlights: ['傍晚到家', '10/6-10/7 在家休息'],
    note: '6:30-7:00 出发，中午前过洛阳，避开返程车流',
    phase: 'return',
    path: [P.xian, P.weinan, P.sanmenxia, P.luoyang, P.home],
  },
]

export const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'A',
    name: '方案 A · 甘南线',
    days: '5 天',
    distanceKm: 1900,
    recommended: true,
    description:
      '青藏高原东北缘：草原、峡谷、藏寨、寺庙，与环线的盐湖戈壁沙漠丹霞完全不同，与去程零重复。海拔 2000-3500m，不深入藏区。',
    pros: ['风景类型与环线互补', '与去程零重复', '国庆期间甘南相对小众', '5 天从容，含 2 天纯赶路'],
    cons: ['扎尕那国庆住宿紧张需早订', '迭部—陇南段山路弯多'],
    path: [P.xining, P.tongren, P.xiahe, P.sangke, P.gahai, P.langmusi, P.diebu, P.zhagana, P.lazikou, P.dangchang, P.longnan, P.chengxian, P.tianshui, P.baoji, P.xian, P.luoyang, P.home],
    stops: [
      { name: '夏河', coord: P.xiahe, date: '10/1' },
      { name: '扎尕那', coord: P.zhagana, date: '10/2' },
      { name: '陇南', coord: P.longnan, date: '10/3' },
      { name: '西安', coord: P.xian, date: '10/4' },
      { name: '家', coord: P.home, date: '10/5' },
    ],
  },
  {
    id: 'B',
    name: '方案 B · 川北若尔盖线',
    days: '6-7 天',
    distanceKm: 2600,
    description:
      '经若尔盖草原、九曲黄河第一湾、成都返程。风景顶级但多约 700km、至少多 1-2 天，会压缩休息时间；10 月初草原已枯黄、花湖无花。本次不推荐，适合以后夏季专程走。',
    pros: ['若尔盖草原、九曲黄河第一湾', '可顺路成都'],
    cons: ['时间不够，压缩在家休息日', '10 月初草原枯黄、花湖无花', '多 700km 路程'],
    path: [P.xining, P.tongren, P.xiahe, P.langmusi, P.tangke, P.ruoergai, P.hongyuan, P.wenchuan, P.chengdu, P.xian, P.luoyang, P.home],
    stops: [
      { name: '夏河', coord: P.xiahe },
      { name: '郎木寺', coord: P.langmusi },
      { name: '唐克', coord: P.tangke },
      { name: '红原', coord: P.hongyuan },
      { name: '成都', coord: P.chengdu },
      { name: '西安', coord: P.xian },
      { name: '家', coord: P.home },
    ],
  },
  {
    id: 'C',
    name: '方案 C · 原路高速返回',
    days: '2 天',
    distanceKm: 1400,
    description:
      '西宁 → 兰州 → 西安 → 家，全程高速 2 天到家。完全重复去程，仅作为恶劣天气、身体不适或时间失控时的兜底方案。',
    pros: ['最快最省事', '全高速，路况好'],
    cons: ['完全重复去程风景', '不符合"看不重复风景"的需求'],
    path: [P.xining, P.lanzhou, P.tianshui, P.baoji, P.xian, P.luoyang, P.home],
    stops: [
      { name: '兰州', coord: P.lanzhou },
      { name: '西安', coord: P.xian },
      { name: '家', coord: P.home },
    ],
  },
  {
    id: 'D',
    name: '方案 D · 青藏线变体',
    days: '环线 D6-D7 改道',
    distanceKm: 1000,
    description:
      '把环线第 6-7 天改为：大柴旦 → 格尔木 → 昆仑山口（4768m）→ 可可西里索南达杰保护站 → 格尔木 → 敦煌。适合对昆仑山/可可西里有执念的情况，回程仍走甘南线。',
    pros: ['昆仑山、可可西里、藏羚羊', '体验 G109 青藏线'],
    cons: ['放弃水上雅丹', '当天从 2800m 猛升至 4768m，高反风险大'],
    path: [P.dachaidan, P.golmud, P.kunlunPass, P.hohxil, P.kunlunPass, P.golmud, P.dachaidan, P.dangjinshan, P.aksai, P.dunhuang],
    stops: [
      { name: '格尔木', coord: P.golmud },
      { name: '昆仑山口', coord: P.kunlunPass },
      { name: '可可西里', coord: P.hohxil },
    ],
    replacesDays: [6, 7],
  },
]

export const TOTAL_MILEAGE = DAYS.reduce((sum, d) => sum + d.mileageKm, 0)

export const KEY_TIPS = [
  '莫高窟 9/28 门票：立即在"莫高窟参观预约网"小程序查 A 类票，抢不到则 9/27 线上抢 B 类应急票',
  '国庆高速免费：10/1 0:00 - 10/7 24:00，7 座及以下，以出高速时间为准；中秋不免费',
  '10/5 返程务必 6:30-7:00 出发，中午前过洛阳，避开 10/6-7 返程最高峰',
]
