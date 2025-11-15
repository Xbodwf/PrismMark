import { JUDGMENT_TYPES } from "../constants/judgmentTypes"

export class JudgmentSystem {
  constructor() {
    this.judgmentRanges = {
      [JUDGMENT_TYPES.PERFECT]: 20,
      [JUDGMENT_TYPES.SLIGHTLY_FAST]: 40,
      [JUDGMENT_TYPES.FAST]: 60,
      [JUDGMENT_TYPES.TOO_FAST]: 80,
    }

    this.scoreValues = {
      [JUDGMENT_TYPES.PERFECT]: 100,
      [JUDGMENT_TYPES.SLIGHTLY_FAST]: 80,
      [JUDGMENT_TYPES.SLIGHTLY_SLOW]: 80,
      [JUDGMENT_TYPES.FAST]: 60,
      [JUDGMENT_TYPES.SLOW]: 60,
      [JUDGMENT_TYPES.TOO_FAST]: 0,
      [JUDGMENT_TYPES.TOO_SLOW]: 0,
      [JUDGMENT_TYPES.MISS]: 0,
      [JUDGMENT_TYPES.EMPTY_HIT]: 0,
    }

    this.comboBreakers = [
      JUDGMENT_TYPES.TOO_FAST,
      JUDGMENT_TYPES.TOO_SLOW,
      JUDGMENT_TYPES.MISS,
      JUDGMENT_TYPES.EMPTY_HIT,
    ]
  }

  // 计算两点之间的距离
  calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // 根据距离判定结果
  judgeByDistance(distance) {
    if (distance <= this.judgmentRanges[JUDGMENT_TYPES.PERFECT]) {
      return JUDGMENT_TYPES.PERFECT
    }
    if (distance <= this.judgmentRanges[JUDGMENT_TYPES.SLIGHTLY_FAST]) {
      return JUDGMENT_TYPES.SLIGHTLY_FAST
    }
    if (distance <= this.judgmentRanges[JUDGMENT_TYPES.FAST]) {
      return JUDGMENT_TYPES.FAST
    }
    if (distance <= this.judgmentRanges[JUDGMENT_TYPES.TOO_FAST]) {
      return JUDGMENT_TYPES.TOO_FAST
    }
    return JUDGMENT_TYPES.MISS
  }

  // 执行判定
  executeJudgment(ballPosition, targetPosition, noteIndex = 0) {
    // 第0个物量自动完美，但仍然计分和连击
    if (noteIndex === 0) {
      return {
        judgment: JUDGMENT_TYPES.PERFECT,
        distance: 0,
        score: this.scoreValues[JUDGMENT_TYPES.PERFECT],
        breaksCombo: false,
        position: { ...ballPosition },
      }
    }

    const distance = this.calculateDistance(ballPosition, targetPosition)
    const judgment = this.judgeByDistance(distance)
    const score = this.scoreValues[judgment] || 0
    const breaksCombo = this.comboBreakers.includes(judgment)

    return {
      judgment,
      distance,
      score,
      breaksCombo,
      position: { ...ballPosition },
    }
  }

  // 检查是否在判定范围内
  isInJudgmentRange(ballPosition, targetPosition, maxRange = 100) {
    const distance = this.calculateDistance(ballPosition, targetPosition)
    return distance <= maxRange
  }

  // 获取判定颜色
  getJudgmentColor(judgment) {
    switch (judgment) {
      case JUDGMENT_TYPES.PERFECT:
        return "#00ff88"
      case JUDGMENT_TYPES.SLIGHTLY_FAST:
      case JUDGMENT_TYPES.SLIGHTLY_SLOW:
        return "#88ff00"
      case JUDGMENT_TYPES.FAST:
      case JUDGMENT_TYPES.SLOW:
        return "#ffaa00"
      case JUDGMENT_TYPES.TOO_FAST:
      case JUDGMENT_TYPES.TOO_SLOW:
        return "#ff6600"
      case JUDGMENT_TYPES.MISS:
        return "#ff0000"
      default:
        return "#666666"
    }
  }

  // 格式化判定文本
  formatJudgmentText(judgment) {
    return judgment.replace(/_/g, " ").toUpperCase()
  }
}

export default JudgmentSystem
