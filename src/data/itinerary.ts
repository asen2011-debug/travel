export type Phase = 'outbound' | 'loop' | 'return'

export type Coord = [number, number] // [lat, lng]

export type OptionId = 'A' | 'B' | 'C' | 'D'

export interface DayPlan {
  day: number
  /** 路线几何的 key（routeGeometry.json），同一天可能被多个方案复用 */
  legId: string
  date: string
  weekday: string
  holiday?: string
  /** 已完成的行程（实际出发早于计划时标记） */
  done?: boolean
  title: string
  lodging: string
  lodgingCoord: Coord
  mileageKm: number
  driveHours: number
  highlights: string[]
  note?: string
  phase: Phase
  /** 途经点（几何抓取失败时回退为直线连线） */
  path: Coord[]
}

export interface RouteOption {
  id: OptionId
  name: string
  days: string
  distanceKm: number
  description: string
  pros: string[]
  cons: string[]
  recommended?: boolean
  /** 对比虚线路径（从西宁到家） */
  path: Coord[]
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
  hanzhong: [33.07, 107.02] as Coord, // 汉中
  // 方案 B 川北线
  ruoergai: [33.58, 102.96] as Coord, // 若尔盖
  tangke: [33.79, 102.45] as Coord, // 唐克 九曲黄河第一湾
  hongyuan: [32.79, 102.54] as Coord, // 红原
  wenchuan: [31.48, 103.59] as Coord,
  chengdu: [30.57, 104.07] as Coord,
  // 青藏线（主方案 D7-D8）
  golmud: [36.4, 94.9] as Coord, // 格尔木
  kunlunPass: [35.66, 94.07] as Coord, // 昆仑山口
  hohxil: [35.6, 93.88] as Coord, // 可可西里索南达杰保护站
  // 方案 D 果洛线
  huashixia: [35.03, 98.9] as Coord, // 花石峡
  animaqing: [34.77, 99.7] as Coord, // 阿尼玛卿观景台（雪山乡）
  maqen: [34.48, 100.24] as Coord, // 玛沁（大武镇）
  jiuzhi: [33.43, 101.48] as Coord, // 久治
  aba: [32.9, 101.71] as Coord, // 阿坝县
  lixian: [31.44, 103.16] as Coord, // 理县
}

const P = PLACES

/** 去程 + 环线（含可可西里），所有方案共用 */
const BASE_DAYS: DayPlan[] = [
  {
    day: 1,
    legId: 'day-1',
    date: '9/20',
    weekday: '周日',
    done: true,
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
    legId: 'day-2',
    date: '9/21',
    weekday: '周一',
    title: '洛阳 → 西安',
    lodging: '西安',
    lodgingCoord: P.xian,
    mileageKm: 370,
    driveHours: 4.5,
    highlights: ['兵马俑', '大唐不夜城'],
    note: '今天出发：上午可逛洛阳老城，午后到西安，傍晚前去兵马俑或留在市区',
    phase: 'outbound',
    path: [P.luoyang, P.sanmenxia, P.weinan, P.xian],
  },
  {
    day: 3,
    legId: 'day-3',
    date: '9/22',
    weekday: '周二',
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
    legId: 'day-4',
    date: '9/23',
    weekday: '周三',
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
    legId: 'day-5',
    date: '9/24',
    weekday: '周四',
    title: '茶卡盐湖 → 大柴旦',
    lodging: '大柴旦',
    lodgingCoord: P.dachaidan,
    mileageKm: 400,
    driveHours: 4.5,
    highlights: ['茶卡盐湖（赶早进）', '大柴旦翡翠湖（傍晚）'],
    note: '明天起中秋小长假，大柴旦住宿紧俏，提前订',
    phase: 'loop',
    path: [P.chaka, P.delingha, P.dachaidan],
  },
  {
    day: 6,
    legId: 'day-6',
    date: '9/25',
    weekday: '周五',
    holiday: '中秋节',
    title: 'G315 → 水上雅丹（往返）',
    lodging: '大柴旦',
    lodgingCoord: P.dachaidan,
    mileageKm: 430,
    driveHours: 6,
    highlights: ['U型公路', '东台吉乃尔湖（顺路看水情）', '乌素特水上雅丹'],
    note: '中秋节在大柴旦；满油出发，G315 加油站间距远；勿在 U 型公路路中拍照',
    phase: 'loop',
    path: [P.dachaidan, P.uRoad, P.dongtai, P.waterYadan, P.dongtai, P.uRoad, P.dachaidan],
  },
  {
    day: 7,
    legId: 'x-6',
    date: '9/26',
    weekday: '周六',
    title: '大柴旦 → 格尔木 → 昆仑山口 → 可可西里 → 格尔木',
    lodging: '格尔木',
    lodgingCoord: P.golmud,
    mileageKm: 530,
    driveHours: 8,
    highlights: ['昆仑山口（海拔4768m）', '可可西里', '藏羚羊', '青藏铁路'],
    note: '海拔 2780m→4768m 再回落，当晚住格尔木很安全；带氧气瓶，山口勿剧烈活动；状态不好到昆仑山口就折返（省 1 小时）',
    phase: 'loop',
    path: [P.dachaidan, P.golmud, P.kunlunPass, P.hohxil, P.kunlunPass, P.golmud],
  },
  {
    day: 8,
    legId: 'x-7',
    date: '9/27',
    weekday: '周日',
    title: '格尔木 → 大柴旦 → 当金山 → 敦煌',
    lodging: '敦煌',
    lodgingCoord: P.dunhuang,
    mileageKm: 550,
    driveHours: 7,
    highlights: ['柴达木盆地戈壁', '当金山口', '鸣沙山月牙泉日落'],
    note: '8:00 出发约 17:00 到敦煌，日落约 19:10；赶不上就改到 D9 傍晚',
    phase: 'loop',
    path: [P.golmud, P.dachaidan, P.dangjinshan, P.aksai, P.dunhuang],
  },
  {
    day: 9,
    legId: 'day-8',
    date: '9/28',
    weekday: '周一',
    title: '敦煌一日游',
    lodging: '敦煌',
    lodgingCoord: P.dunhuang,
    mileageKm: 50,
    driveHours: 1,
    highlights: ['莫高窟（上午）', '沙洲夜市'],
    note: '莫高窟 A 类票大概率已售罄；9/27 起在"莫高窟参观预约网"抢 B 类应急票（6000 张/天），或当天早 8 点现场排队',
    phase: 'loop',
    path: [P.dunhuang, P.mogaoku, P.dunhuang],
  },
  {
    day: 10,
    legId: 'day-9',
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
    day: 11,
    legId: 'day-10',
    date: '9/30',
    weekday: '周三',
    title: '张掖 → 祁连草原 → 门源 → 西宁',
    lodging: '西宁',
    lodgingCoord: P.xining,
    mileageKm: 380,
    driveHours: 6.5,
    highlights: ['七彩丹霞（赶早）', '扁都口', '祁连草原', '达坂山观景台'],
    note: 'G227 国道为主；达坂山 10 月初可能降雪，出发前看天气',
    phase: 'loop',
    path: [P.zhangye, P.biandukou, P.ebao, P.menyuan, P.dabanshan, P.xining],
  },
]

/** 方案 A 回程：甘南线（推荐） */
const RETURN_A: DayPlan[] = [
  {
    day: 12,
    legId: 'day-11',
    date: '10/1',
    weekday: '周四',
    holiday: '国庆节',
    title: '西宁 → 甘加草原 → 夏河',
    lodging: '夏河',
    lodgingCoord: P.xiahe,
    mileageKm: 240,
    driveHours: 4,
    highlights: ['甘加草原', '拉卜楞寺'],
    note: '国庆首日，甘南方向车流中等，早出发；高速起免费',
    phase: 'return',
    path: [P.xining, P.tongren, P.xiahe],
  },
  {
    day: 13,
    legId: 'day-12',
    date: '10/2',
    weekday: '周五',
    title: '夏河 → 桑科草原 → 郎木寺 → 扎尕那',
    lodging: '扎尕那',
    lodgingCoord: P.zhagana,
    mileageKm: 285,
    driveHours: 5.5,
    highlights: ['桑科草原', '郎木寺镇', '扎尕那日落'],
    note: '扎尕那正值国庆高峰，住宿务必提前订，当天早进景区',
    phase: 'return',
    path: [P.xiahe, P.sangke, P.gahai, P.langmusi, P.diebu, P.zhagana],
  },
  {
    day: 14,
    legId: 'day-13',
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
    day: 15,
    legId: 'day-14',
    date: '10/4',
    weekday: '周日',
    title: '陇南 → 天水 → 宝鸡 → 西安',
    lodging: '西安',
    lodgingCoord: P.xian,
    mileageKm: 530,
    driveHours: 6.5,
    highlights: ['纯赶路（高速免费）'],
    note: '假期中段车流中等，8 点前出发',
    phase: 'return',
    path: [P.longnan, P.chengxian, P.tianshui, P.baoji, P.xian],
  },
  {
    day: 16,
    legId: 'day-15',
    date: '10/5',
    weekday: '周一',
    title: '西安 → 洛阳 → 获嘉',
    lodging: '家',
    lodgingCoord: P.home,
    mileageKm: 550,
    driveHours: 6.5,
    highlights: ['傍晚到家', '10/6-10/7 在家休息'],
    note: '7:00 前出发，中午前过洛阳；10/5-6 是返程高峰，早出发避开',
    phase: 'return',
    path: [P.xian, P.weinan, P.sanmenxia, P.luoyang, P.home],
  },
]

/** 方案 B 回程：川北若尔盖线（D12 与 A 相同，D16 与 A 相同） */
const RETURN_B: DayPlan[] = [
  RETURN_A[0],
  {
    day: 13,
    legId: 'b-12',
    date: '10/2',
    weekday: '周五',
    title: '夏河 → 郎木寺 → 若尔盖 → 唐克',
    lodging: '唐克',
    lodgingCoord: P.tangke,
    mileageKm: 330,
    driveHours: 6,
    highlights: ['桑科草原', '郎木寺镇', '九曲黄河第一湾日落'],
    note: '10 月初草原已枯黄，看苍茫感；唐克住宿条件一般',
    phase: 'return',
    path: [P.xiahe, P.sangke, P.gahai, P.langmusi, P.ruoergai, P.tangke],
  },
  {
    day: 14,
    legId: 'b-13',
    date: '10/3',
    weekday: '周六',
    title: '唐克 → 红原 → 汶川 → 成都',
    lodging: '成都',
    lodgingCoord: P.chengdu,
    mileageKm: 560,
    driveHours: 9,
    highlights: ['红原草原', '晚上成都吃火锅'],
    note: '全天驾驶强度大，山区路段多，两人轮换',
    phase: 'return',
    path: [P.tangke, P.hongyuan, P.wenchuan, P.chengdu],
  },
  {
    day: 15,
    legId: 'b-14',
    date: '10/4',
    weekday: '周日',
    title: '成都 → 汉中 → 西安',
    lodging: '西安',
    lodgingCoord: P.xian,
    mileageKm: 720,
    driveHours: 8.5,
    highlights: ['京昆高速全程赶路（免费）'],
    note: '8 点前出发，避开午后高峰',
    phase: 'return',
    path: [P.chengdu, P.hanzhong, P.xian],
  },
  RETURN_A[4],
]

/** 方案 C 回程：原路高速返回（全程在免费时段内） */
const RETURN_C: DayPlan[] = [
  {
    day: 12,
    legId: 'c-11',
    date: '10/1',
    weekday: '周四',
    holiday: '国庆节',
    title: '西宁 → 兰州',
    lodging: '兰州',
    lodgingCoord: P.lanzhou,
    mileageKm: 220,
    driveHours: 3,
    highlights: ['上午西宁休整补给', '黄河铁桥', '正宁路夜市'],
    note: '轻松短途日，高速免费',
    phase: 'return',
    path: [P.xining, P.lanzhou],
  },
  {
    day: 13,
    legId: 'c-12',
    date: '10/2',
    weekday: '周五',
    title: '兰州 → 西安',
    lodging: '西安',
    lodgingCoord: P.xian,
    mileageKm: 630,
    driveHours: 7.5,
    highlights: ['全高速返程（免费）'],
    note: '假期中段车流中等，上午出发',
    phase: 'return',
    path: [P.lanzhou, P.tianshui, P.baoji, P.xian],
  },
  {
    ...RETURN_A[4],
    day: 14,
    date: '10/3',
    weekday: '周六',
    highlights: ['傍晚到家', '10/4-10/7 在家休息 4 天'],
  },
]

/** 方案 D 回程：果洛神山线（阿尼玛卿、黄河源方向） */
const RETURN_D: DayPlan[] = [
  {
    day: 12,
    legId: 'd-12',
    date: '10/1',
    weekday: '周四',
    holiday: '国庆节',
    title: '西宁 → 花石峡 → 阿尼玛卿 → 玛沁',
    lodging: '玛沁',
    lodgingCoord: P.maqen,
    mileageKm: 420,
    driveHours: 5,
    highlights: ['阿尼玛卿雪山（四大神山，高速旁观景台）', '高原草甸', '拉加寺（路过）'],
    note: '国庆冷门方向不堵车；玛沁海拔 3750m 为全程最高住宿点，到早休息，别喝酒',
    phase: 'return',
    path: [P.xining, P.huashixia, P.animaqing, P.maqen],
  },
  {
    day: 13,
    legId: 'd-13',
    date: '10/2',
    weekday: '周五',
    title: '玛沁 → 久治 → 阿坝县',
    lodging: '阿坝',
    lodgingCoord: P.aba,
    mileageKm: 300,
    driveHours: 5.5,
    highlights: ['黄河源高原草甸', '牦牛群', '藏区村落'],
    note: '久治→阿坝若高速未全通则走国道，路况良好但弯多；见加油站就加满',
    phase: 'return',
    path: [P.maqen, P.jiuzhi, P.aba],
  },
  {
    day: 14,
    legId: 'd-14',
    date: '10/3',
    weekday: '周六',
    title: '阿坝 → 红原 → 理县 → 汶川 → 成都',
    lodging: '成都',
    lodgingCoord: P.chengdu,
    mileageKm: 500,
    driveHours: 8,
    highlights: ['红原草原', '晚上成都吃火锅'],
    note: '全程强度最大的一天，两人轮换；想轻松可改走阿坝→绵阳（约 450km）',
    phase: 'return',
    path: [P.aba, P.hongyuan, P.lixian, P.wenchuan, P.chengdu],
  },
  {
    day: 15,
    legId: 'b-14',
    date: '10/4',
    weekday: '周日',
    title: '成都 → 汉中 → 西安',
    lodging: '西安',
    lodgingCoord: P.xian,
    mileageKm: 720,
    driveHours: 8.5,
    highlights: ['京昆高速全程赶路（免费）'],
    note: '8 点前出发，避开午后高峰',
    phase: 'return',
    path: [P.chengdu, P.hanzhong, P.xian],
  },
  RETURN_A[4],
]

export const ITINERARIES: Record<OptionId, DayPlan[]> = {
  A: [...BASE_DAYS, ...RETURN_A],
  B: [...BASE_DAYS, ...RETURN_B],
  C: [...BASE_DAYS, ...RETURN_C],
  D: [...BASE_DAYS, ...RETURN_D],
}

export const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'A',
    name: '方案 A · 甘南线',
    days: '回程 5 天',
    distanceKm: 1900,
    recommended: true,
    description:
      '青藏高原东北缘：草原、峡谷、藏寨、寺庙，与环线的盐湖戈壁沙漠丹霞完全不同，与去程零重复。海拔 2000-3500m，不深入藏区。10/5 到家，10/6-7 休息。',
    pros: ['风景类型与环线互补', '与去程零重复', '5 天从容，含 2 天纯赶路', '海拔相对温和'],
    cons: ['扎尕那国庆住宿紧张需早订', '迭部—陇南段山路弯多'],
    path: [P.xining, P.tongren, P.xiahe, P.sangke, P.gahai, P.langmusi, P.diebu, P.zhagana, P.lazikou, P.dangchang, P.longnan, P.chengxian, P.tianshui, P.baoji, P.xian, P.luoyang, P.home],
  },
  {
    id: 'B',
    name: '方案 B · 川北若尔盖线',
    days: '回程 5 天',
    distanceKm: 2400,
    description:
      '经若尔盖草原、九曲黄河第一湾、成都返程。能顺路进成都，但回程多约 500km，且 D14/D15 两天驾驶强度很大；10 月初草原已枯黄、花湖无花。本次不推荐，适合以后夏季专程走。',
    pros: ['若尔盖草原、九曲黄河第一湾', '可顺路成都吃火锅'],
    cons: ['D14 约 560km 山路 + D15 约 720km 高速，强度大', '10 月初草原枯黄、花湖无花', '比方案 A 多约 500km'],
    path: [P.xining, P.tongren, P.xiahe, P.langmusi, P.ruoergai, P.tangke, P.hongyuan, P.wenchuan, P.chengdu, P.hanzhong, P.xian, P.luoyang, P.home],
  },
  {
    id: 'C',
    name: '方案 C · 原路高速返回',
    days: '回程 3 天',
    distanceKm: 1400,
    description:
      '西宁 → 兰州 → 西安 → 家，全程高速且全在免费时段内。10/3 傍晚到家，可在家休息 4 天。完全重复去程，作为恶劣天气、身体不适或时间失控时的兜底方案。',
    pros: ['10/3 到家，在家休息 4 天', '全高速免费，每天不超过 7.5 小时', '路况最熟最省心'],
    cons: ['完全重复去程风景', '无新增景点'],
    path: [P.xining, P.lanzhou, P.tianshui, P.baoji, P.xian, P.luoyang, P.home],
  },
  {
    id: 'D',
    name: '方案 D · 果洛神山线',
    days: '回程 5 天',
    distanceKm: 2350,
    description:
      '西宁 → 玛沁 → 阿坝 → 成都返程：阿尼玛卿雪山（四大神山）近在咫尺，黄河源高原草甸，国庆最冷门方向，不堵车不排队。海拔比甘南线高（玛沁 3750m），适合想看更原始高原的你们。玉树方向回程需 6-7 天、没有休息日，本次假期装不下，故不作方案。',
    pros: ['国庆最冷门，不堵车住宿不紧张', '阿尼玛卿雪山 + 黄河源高原，风景最"青藏"', '与主方案、甘南线风景都不重复'],
    cons: ['玛沁 3750m 是全程最高住宿点', 'D14/D15 两天驾驶强度大', '果洛段服务设施稀疏，见加油站就加满'],
    path: [P.xining, P.huashixia, P.animaqing, P.maqen, P.jiuzhi, P.aba, P.hongyuan, P.lixian, P.wenchuan, P.chengdu, P.hanzhong, P.xian, P.luoyang, P.home],
  },
]

export function totalMileage(days: DayPlan[]): number {
  return days.reduce((sum, d) => sum + d.mileageKm, 0)
}

/** 根据到家日期推算休息说明（假期到 10/7 结束） */
export function restNote(days: DayPlan[]): string {
  const last = days[days.length - 1]
  const homeDay = Number(last.date.split('/')[1])
  if (homeDay >= 7) return '假期结束'
  return `10/${homeDay + 1}-10/7 在家休息`
}

export const KEY_TIPS = [
  '莫高窟 9/28 参观：A 类票大概率已售罄，9/27 起在"莫高窟参观预约网"抢 B 类应急票（或当天早 8 点现场排队）',
  '国庆高速免费：10/1 0:00 - 10/7 24:00，7 座及以下，以出高速时间为准；中秋不免费',
  '10/5 返程 7:00 前出发，中午前过洛阳；10/5-6 是返程高峰',
]
