export const DEFAULT_LEVEL = {
  property: {
    version: 1.0,
    song: {
      name: "Sample Track",
      artists: [{ name: "PrismMark", link: "" }],
      bpm: 120,
      offset: 0,
      volume: 1.0,
      href: "", // 新增音频路径字段
      thumb: "./circleArc.png",
    },
    level: {
      authors: [{ name: "Editor", link: "" }],
      levelTags: ["sample", "tutorial"],
      hitsoundVolume: 0.5,
      hitsound: {
        type: "internal",
        name: "Kick",
      },
      previewColor: "#00ff88ff",
      defaultRailColor: ["#00ff88ff", "#0088ffff"],
    },
  },
  content: [
    {
      positionOffset: [2, 0],
      timing: 1000,
      type: "tap",
    },
    {
      positionOffset: [1, 2],
      timing: 2000,
      type: "tap",
    },
    {
      positionOffset: [-1, 2],
      timing: 3000,
      type: "tap",
    },
    {
      positionOffset: [-2, 0],
      timing: 4000,
      type: "tap",
    },
    {
      positionOffset: [-1, -2],
      timing: 5000,
      type: "tap",
    },
    {
      positionOffset: [1, -2],
      timing: 6000,
      type: "tap",
    },
    {
      positionOffset: [3, 1],
      timing: 7000,
      type: "tap",
    },
    {
      positionOffset: [0, 3],
      timing: 8000,
      type: "tap",
    },
  ],
  addons: [
    {
      type: "speed_change",
      noteIndex: 3,
      distanceOffset: 0,
      newSpeed: 1.5,
    },
    {
      type: "easing_change",
      noteIndex: 5,
      distanceOffset: 0,
      newEasing: "easeOutSine",
    },
  ],
}
