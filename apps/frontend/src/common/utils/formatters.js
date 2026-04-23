export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '00')}`
}

export const generateCombinations = (variations) => {
  const validVars = variations.filter(v => v.name?.trim() && v.options?.length > 0)
  if (validVars.length === 0) return []

  let results = [{ options: [], indices: [] }]

  validVars.forEach((v) => {
    const nextResults = []
    results.forEach(res => {
      v.options.forEach((opt, oIdx) => {
        nextResults.push({
          options: [...res.options, opt], // (Đỏ, S)
          indices: [...res.indices, oIdx] // ( 0, 1)
        })
      })
    })
    results = nextResults
  })
  return results
}

export function formatValue(type, value) {
  if (type === 'percentage') return `${value}%`
  if (value >= 1000) return `${Math.round(value / 1000)}k ₫`
  return `${value} ₫`
}


export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export const formatVND = (value) => {
  if (!value && value !== 0) return '0 ₫'

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

export const getStockStatus = (stock) => {
  if (stock === 0) return 'out'
  if (stock <= 10) return 'low'
  return 'in'
}