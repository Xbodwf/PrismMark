export const calculateNotePositions = (content) => {
  const positions = [{ x: 0, y: 0 }]
  let currentPos = { x: 0, y: 0 }

  if (content && content.length > 0) {
    content.forEach((note) => {
      if (note.positionOffset) {
        currentPos = {
          x: currentPos.x + note.positionOffset[0] * 50,
          y: currentPos.y + note.positionOffset[1] * 50,
        }
        positions.push({ ...currentPos })
      }
    })
  }

  return positions
}

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
