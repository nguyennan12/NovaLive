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