// 教程关卡数据
export const TUTORIAL_LEVELS = [
  {
    id: "tutorial_1_straight",
    name: "Tutorial 1: Straight Lines",
    description: "Learn basic movement with straight line patterns",
    difficulty: "Beginner",
    property: {
      version: 1.0,
      song: {
        name: "Straight Path Tutorial",
        artists: [{ name: "PrismMark Tutorial", link: "" }],
        bpm: 100,
        offset: 0,
        volume: 1.0,
        href: "",
        thumb: "./circleArc.png",
      },
      level: {
        authors: [{ name: "Tutorial System", link: "" }],
        levelTags: ["tutorial", "beginner", "straight"],
        hitsoundVolume: 0.6,
        hitsound: {
          type: "internal",
          name: "Kick",
        },
        previewColor: "#00ff88ff",
        defaultRailColor: ["#00ff88ff", "#0088ffff"],
      },
    },
    content: [
      // 水平直线
      { positionOffset: [2, 0], timing: 2000, type: "tap" },
      { positionOffset: [2, 0], timing: 4000, type: "tap" },
      { positionOffset: [2, 0], timing: 6000, type: "tap" },
      { positionOffset: [2, 0], timing: 8000, type: "tap" },
      { positionOffset: [2, 0], timing: 10000, type: "tap" },

      // 垂直直线
      { positionOffset: [0, 2], timing: 12000, type: "tap" },
      { positionOffset: [0, 2], timing: 14000, type: "tap" },
      { positionOffset: [0, 2], timing: 16000, type: "tap" },
      { positionOffset: [0, 2], timing: 18000, type: "tap" },
      { positionOffset: [0, 2], timing: 20000, type: "tap" },

      // 反向水平
      { positionOffset: [-2, 0], timing: 22000, type: "tap" },
      { positionOffset: [-2, 0], timing: 24000, type: "tap" },
      { positionOffset: [-2, 0], timing: 26000, type: "tap" },
      { positionOffset: [-2, 0], timing: 28000, type: "tap" },
      { positionOffset: [-2, 0], timing: 30000, type: "tap" },

      // 反向垂直
      { positionOffset: [0, -2], timing: 32000, type: "tap" },
      { positionOffset: [0, -2], timing: 34000, type: "tap" },
      { positionOffset: [0, -2], timing: 36000, type: "tap" },
      { positionOffset: [0, -2], timing: 38000, type: "tap" },
      { positionOffset: [0, -2], timing: 40000, type: "tap" },
    ],
    addons: [],
  },

  {
    id: "tutorial_2_diagonal",
    name: "Tutorial 2: Diagonal Movement",
    description: "Practice diagonal and angled movements",
    difficulty: "Beginner",
    property: {
      version: 1.0,
      song: {
        name: "Diagonal Path Tutorial",
        artists: [{ name: "PrismMark Tutorial", link: "" }],
        bpm: 110,
        offset: 0,
        volume: 1.0,
        href: "",
        thumb: "./circleArc.png",
      },
      level: {
        authors: [{ name: "Tutorial System", link: "" }],
        levelTags: ["tutorial", "beginner", "diagonal"],
        hitsoundVolume: 0.6,
        hitsound: {
          type: "internal",
          name: "Kick",
        },
        previewColor: "#ffaa00ff",
        defaultRailColor: ["#ffaa00ff", "#ff6600ff"],
      },
    },
    content: [
      // 右上对角线
      { positionOffset: [1, 1], timing: 2000, type: "tap" },
      { positionOffset: [1, 1], timing: 3500, type: "tap" },
      { positionOffset: [1, 1], timing: 5000, type: "tap" },
      { positionOffset: [1, 1], timing: 6500, type: "tap" },
      { positionOffset: [1, 1], timing: 8000, type: "tap" },
      { positionOffset: [1, 1], timing: 9500, type: "tap" },

      // 左上对角线
      { positionOffset: [-1, 1], timing: 11000, type: "tap" },
      { positionOffset: [-1, 1], timing: 12500, type: "tap" },
      { positionOffset: [-1, 1], timing: 14000, type: "tap" },
      { positionOffset: [-1, 1], timing: 15500, type: "tap" },
      { positionOffset: [-1, 1], timing: 17000, type: "tap" },
      { positionOffset: [-1, 1], timing: 18500, type: "tap" },

      // 左下对角线
      { positionOffset: [-1, -1], timing: 20000, type: "tap" },
      { positionOffset: [-1, -1], timing: 21500, type: "tap" },
      { positionOffset: [-1, -1], timing: 23000, type: "tap" },
      { positionOffset: [-1, -1], timing: 24500, type: "tap" },
      { positionOffset: [-1, -1], timing: 26000, type: "tap" },
      { positionOffset: [-1, -1], timing: 27500, type: "tap" },

      // 右下对角线
      { positionOffset: [1, -1], timing: 29000, type: "tap" },
      { positionOffset: [1, -1], timing: 30500, type: "tap" },
      { positionOffset: [1, -1], timing: 32000, type: "tap" },
      { positionOffset: [1, -1], timing: 33500, type: "tap" },
      { positionOffset: [1, -1], timing: 35000, type: "tap" },
      { positionOffset: [1, -1], timing: 36500, type: "tap" },
    ],
    addons: [],
  },

  {
    id: "tutorial_3_zigzag",
    name: "Tutorial 3: Zigzag Pattern",
    description: "Master quick direction changes with zigzag movements",
    difficulty: "Intermediate",
    property: {
      version: 1.0,
      song: {
        name: "Zigzag Path Tutorial",
        artists: [{ name: "PrismMark Tutorial", link: "" }],
        bpm: 120,
        offset: 0,
        volume: 1.0,
        href: "",
        thumb: "./circleArc.png",
      },
      level: {
        authors: [{ name: "Tutorial System", link: "" }],
        levelTags: ["tutorial", "intermediate", "zigzag"],
        hitsoundVolume: 0.6,
        hitsound: {
          type: "internal",
          name: "Kick",
        },
        previewColor: "#ff6600ff",
        defaultRailColor: ["#ff6600ff", "#ff3300ff"],
      },
    },
    content: [
      // 水平锯齿
      { positionOffset: [2, 1], timing: 2000, type: "tap" },
      { positionOffset: [2, -2], timing: 3500, type: "tap" },
      { positionOffset: [2, 2], timing: 5000, type: "tap" },
      { positionOffset: [2, -2], timing: 6500, type: "tap" },
      { positionOffset: [2, 2], timing: 8000, type: "tap" },
      { positionOffset: [2, -2], timing: 9500, type: "tap" },
      { positionOffset: [2, 2], timing: 11000, type: "tap" },
      { positionOffset: [2, -2], timing: 12500, type: "tap" },

      // 垂直锯齿
      { positionOffset: [1, 2], timing: 14000, type: "tap" },
      { positionOffset: [-2, 2], timing: 15500, type: "tap" },
      { positionOffset: [2, 2], timing: 17000, type: "tap" },
      { positionOffset: [-2, 2], timing: 18500, type: "tap" },
      { positionOffset: [2, 2], timing: 20000, type: "tap" },
      { positionOffset: [-2, 2], timing: 21500, type: "tap" },
      { positionOffset: [2, 2], timing: 23000, type: "tap" },
      { positionOffset: [-2, 2], timing: 24500, type: "tap" },

      // 对角锯齿
      { positionOffset: [1, 1], timing: 26000, type: "tap" },
      { positionOffset: [-1, 1], timing: 27000, type: "tap" },
      { positionOffset: [1, 1], timing: 28000, type: "tap" },
      { positionOffset: [-1, 1], timing: 29000, type: "tap" },
      { positionOffset: [1, 1], timing: 30000, type: "tap" },
      { positionOffset: [-1, 1], timing: 31000, type: "tap" },
      { positionOffset: [1, 1], timing: 32000, type: "tap" },
      { positionOffset: [-1, 1], timing: 33000, type: "tap" },
    ],
    addons: [
      { type: "speed_change", noteIndex: 8, distanceOffset: 0, newSpeed: 1.2 },
      { type: "speed_change", noteIndex: 16, distanceOffset: 0, newSpeed: 1.4 },
    ],
  },

  {
    id: "tutorial_4_returns",
    name: "Tutorial 4: Return Patterns",
    description: "Learn to handle return movements and reversals",
    difficulty: "Intermediate",
    property: {
      version: 1.0,
      song: {
        name: "Return Path Tutorial",
        artists: [{ name: "PrismMark Tutorial", link: "" }],
        bpm: 130,
        offset: 0,
        volume: 1.0,
        href: "",
        thumb: "./circleArc.png",
      },
      level: {
        authors: [{ name: "Tutorial System", link: "" }],
        levelTags: ["tutorial", "intermediate", "returns"],
        hitsoundVolume: 0.6,
        hitsound: {
          type: "internal",
          name: "Kick",
        },
        previewColor: "#8800ffff",
        defaultRailColor: ["#8800ffff", "#aa00ffff"],
      },
    },
    content: [
      // 简单折返
      { positionOffset: [3, 0], timing: 2000, type: "tap" },
      { positionOffset: [3, 0], timing: 3500, type: "tap" },
      { positionOffset: [3, 0], timing: 5000, type: "tap" },
      { positionOffset: [-6, 0], timing: 6500, type: "tap" },
      { positionOffset: [-3, 0], timing: 8000, type: "tap" },
      { positionOffset: [-3, 0], timing: 9500, type: "tap" },
      { positionOffset: [6, 0], timing: 11000, type: "tap" },
      { positionOffset: [3, 0], timing: 12500, type: "tap" },

      // 垂直折返
      { positionOffset: [0, 3], timing: 14000, type: "tap" },
      { positionOffset: [0, 3], timing: 15500, type: "tap" },
      { positionOffset: [0, 3], timing: 17000, type: "tap" },
      { positionOffset: [0, -6], timing: 18500, type: "tap" },
      { positionOffset: [0, -3], timing: 20000, type: "tap" },
      { positionOffset: [0, -3], timing: 21500, type: "tap" },
      { positionOffset: [0, 6], timing: 23000, type: "tap" },
      { positionOffset: [0, 3], timing: 24500, type: "tap" },

      // 对角折返
      { positionOffset: [2, 2], timing: 26000, type: "tap" },
      { positionOffset: [2, 2], timing: 27000, type: "tap" },
      { positionOffset: [2, 2], timing: 28000, type: "tap" },
      { positionOffset: [-4, -4], timing: 29000, type: "tap" },
      { positionOffset: [-2, -2], timing: 30000, type: "tap" },
      { positionOffset: [-2, -2], timing: 31000, type: "tap" },
      { positionOffset: [4, 4], timing: 32000, type: "tap" },
      { positionOffset: [2, 2], timing: 33000, type: "tap" },
    ],
    addons: [
      { type: "speed_change", noteIndex: 3, distanceOffset: 0, newSpeed: 1.8 },
      { type: "speed_change", noteIndex: 6, distanceOffset: 0, newSpeed: 1.0 },
      { type: "speed_change", noteIndex: 11, distanceOffset: 0, newSpeed: 1.8 },
      { type: "speed_change", noteIndex: 14, distanceOffset: 0, newSpeed: 1.0 },
      { type: "speed_change", noteIndex: 19, distanceOffset: 0, newSpeed: 2.0 },
      { type: "speed_change", noteIndex: 22, distanceOffset: 0, newSpeed: 1.0 },
    ],
  },

  {
    id: "tutorial_5_spiral",
    name: "Tutorial 5: Spiral Movement",
    description: "Practice circular and spiral movement patterns",
    difficulty: "Advanced",
    property: {
      version: 1.0,
      song: {
        name: "Spiral Path Tutorial",
        artists: [{ name: "PrismMark Tutorial", link: "" }],
        bpm: 140,
        offset: 0,
        volume: 1.0,
        href: "",
        thumb: "./circleArc.png",
      },
      level: {
        authors: [{ name: "Tutorial System", link: "" }],
        levelTags: ["tutorial", "advanced", "spiral"],
        hitsoundVolume: 0.6,
        hitsound: {
          type: "internal",
          name: "Kick",
        },
        previewColor: "#ff0088ff",
        defaultRailColor: ["#ff0088ff", "#ff00aaff"],
      },
    },
    content: [
      // 外螺旋
      { positionOffset: [2, 0], timing: 2000, type: "tap" },
      { positionOffset: [1, 2], timing: 3000, type: "tap" },
      { positionOffset: [-1, 2], timing: 4000, type: "tap" },
      { positionOffset: [-2, 0], timing: 5000, type: "tap" },
      { positionOffset: [-1, -2], timing: 6000, type: "tap" },
      { positionOffset: [1, -2], timing: 7000, type: "tap" },
      { positionOffset: [3, 0], timing: 8000, type: "tap" },
      { positionOffset: [1, 3], timing: 9000, type: "tap" },
      { positionOffset: [-2, 3], timing: 10000, type: "tap" },
      { positionOffset: [-3, 0], timing: 11000, type: "tap" },
      { positionOffset: [-1, -3], timing: 12000, type: "tap" },
      { positionOffset: [2, -3], timing: 13000, type: "tap" },
      { positionOffset: [4, 0], timing: 14000, type: "tap" },
      { positionOffset: [1, 4], timing: 15000, type: "tap" },
      { positionOffset: [-3, 4], timing: 16000, type: "tap" },
      { positionOffset: [-4, 0], timing: 17000, type: "tap" },

      // 内螺旋
      { positionOffset: [1, -2], timing: 18000, type: "tap" },
      { positionOffset: [2, -2], timing: 19000, type: "tap" },
      { positionOffset: [2, 1], timing: 20000, type: "tap" },
      { positionOffset: [0, 2], timing: 21000, type: "tap" },
      { positionOffset: [-2, 1], timing: 22000, type: "tap" },
      { positionOffset: [-2, -1], timing: 23000, type: "tap" },
      { positionOffset: [0, -2], timing: 24000, type: "tap" },
      { positionOffset: [1, -1], timing: 25000, type: "tap" },
      { positionOffset: [1, 0], timing: 26000, type: "tap" },
      { positionOffset: [0, 1], timing: 27000, type: "tap" },
      { positionOffset: [-1, 0], timing: 28000, type: "tap" },
      { positionOffset: [0, -1], timing: 29000, type: "tap" },
      { positionOffset: [0, 0], timing: 30000, type: "tap" },
    ],
    addons: [
      { type: "easing_change", noteIndex: 6, distanceOffset: 0, newEasing: "easeInOutSine" },
      { type: "easing_change", noteIndex: 16, distanceOffset: 0, newEasing: "easeOutCubic" },
      { type: "speed_change", noteIndex: 16, distanceOffset: 0, newSpeed: 0.8 },
    ],
  },

  {
    id: "tutorial_6_mixed",
    name: "Tutorial 6: Mixed Patterns",
    description: "Master all movement types in a comprehensive challenge",
    difficulty: "Expert",
    property: {
      version: 1.0,
      song: {
        name: "Mixed Pattern Challenge",
        artists: [{ name: "PrismMark Tutorial", link: "" }],
        bpm: 150,
        offset: 0,
        volume: 1.0,
        href: "",
        thumb: "./circleArc.png",
      },
      level: {
        authors: [{ name: "Tutorial System", link: "" }],
        levelTags: ["tutorial", "expert", "mixed"],
        hitsoundVolume: 0.6,
        hitsound: {
          type: "internal",
          name: "Kick",
        },
        previewColor: "#00ffffff",
        defaultRailColor: ["#00ffffff", "#0088ffff"],
      },
    },
    content: [
      // 快速直线
      { positionOffset: [2, 0], timing: 1500, type: "tap" },
      { positionOffset: [2, 0], timing: 2500, type: "tap" },
      { positionOffset: [2, 0], timing: 3500, type: "tap" },

      // 对角转换
      { positionOffset: [-1, 2], timing: 4500, type: "tap" },
      { positionOffset: [-1, 2], timing: 5500, type: "tap" },
      { positionOffset: [-1, 2], timing: 6500, type: "tap" },

      // 锯齿段
      { positionOffset: [2, -1], timing: 7500, type: "tap" },
      { positionOffset: [2, 2], timing: 8250, type: "tap" },
      { positionOffset: [2, -2], timing: 9000, type: "tap" },
      { positionOffset: [2, 2], timing: 9750, type: "tap" },
      { positionOffset: [2, -2], timing: 10500, type: "tap" },

      // 大折返
      { positionOffset: [-8, 4], timing: 12000, type: "tap" },
      { positionOffset: [2, -1], timing: 13000, type: "tap" },
      { positionOffset: [2, -1], timing: 14000, type: "tap" },

      // 螺旋段
      { positionOffset: [1, 2], timing: 15000, type: "tap" },
      { positionOffset: [-1, 2], timing: 15750, type: "tap" },
      { positionOffset: [-2, 0], timing: 16500, type: "tap" },
      { positionOffset: [-1, -2], timing: 17250, type: "tap" },
      { positionOffset: [1, -2], timing: 18000, type: "tap" },
      { positionOffset: [2, 0], timing: 18750, type: "tap" },

      // 快速连击
      { positionOffset: [1, 1], timing: 19500, type: "tap" },
      { positionOffset: [1, 1], timing: 20000, type: "tap" },
      { positionOffset: [1, 1], timing: 20500, type: "tap" },
      { positionOffset: [1, 1], timing: 21000, type: "tap" },

      // 最终挑战
      { positionOffset: [-2, -2], timing: 22000, type: "tap" },
      { positionOffset: [3, 0], timing: 22750, type: "tap" },
      { positionOffset: [-1, 3], timing: 23500, type: "tap" },
      { positionOffset: [-2, -3], timing: 24250, type: "tap" },
      { positionOffset: [4, 1], timing: 25000, type: "tap" },
      { positionOffset: [0, 0], timing: 26000, type: "tap" },
    ],
    addons: [
      { type: "speed_change", noteIndex: 6, distanceOffset: 0, newSpeed: 1.3 },
      { type: "speed_change", noteIndex: 11, distanceOffset: 0, newSpeed: 2.0 },
      { type: "speed_change", noteIndex: 13, distanceOffset: 0, newSpeed: 1.0 },
      { type: "easing_change", noteIndex: 14, distanceOffset: 0, newEasing: "easeInOutSine" },
      { type: "speed_change", noteIndex: 20, distanceOffset: 0, newSpeed: 1.5 },
      { type: "speed_change", noteIndex: 24, distanceOffset: 0, newSpeed: 1.8 },
    ],
  },
]
