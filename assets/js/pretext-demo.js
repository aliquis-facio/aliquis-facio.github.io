import { prepare, layout } from 'https://esm.sh/@chenglou/pretext'

const state = {
  prepared: null,
  font: '16px Pretendard, "Noto Sans KR", sans-serif',
  lineHeight: 28,
}

function updateMeasurement() {
  const input = document.getElementById('pretext-input')
  const widthInput = document.getElementById('pretext-width')
  const preview = document.getElementById('pretext-preview')
  const heightEl = document.getElementById('pretext-height')
  const linesEl = document.getElementById('pretext-lines')
  const widthEl = document.getElementById('pretext-width-value')

  if (!input || !widthInput || !preview || !heightEl || !linesEl || !widthEl) {
    return
  }

  const text = input.value
  const width = Number(widthInput.value)

  state.prepared = prepare(text, state.font, {
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all',
  })

  const { height, lineCount } = layout(state.prepared, width, state.lineHeight)

  preview.style.width = `${width}px`
  preview.style.font = state.font
  preview.style.lineHeight = `${state.lineHeight}px`
  preview.style.whiteSpace = 'pre-wrap'
  preview.style.wordBreak = 'keep-all'
  preview.textContent = text

  heightEl.textContent = `${height}px`
  linesEl.textContent = `${lineCount}`
  widthEl.textContent = `${width}px`
}

function bootstrapPretextDemo() {
  const input = document.getElementById('pretext-input')
  const widthInput = document.getElementById('pretext-width')

  if (!input || !widthInput) {
    return
  }

  input.addEventListener('input', updateMeasurement)
  widthInput.addEventListener('input', updateMeasurement)

  updateMeasurement()
}

window.addEventListener('DOMContentLoaded', bootstrapPretextDemo)