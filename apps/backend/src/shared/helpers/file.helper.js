import fs from 'fs'
import path from 'path'

/**
 * Đọc file Lua (hoặc bất kỳ file text nào) và cache vào RAM
 * @param {string} relativePath - Đường dẫn tính từ thư mục 'src'
 * @returns {string} Nội dung file
 */
const loadLuaScript = (relativePath) => {
  try {
    const fullPath = path.join(process.cwd(), 'src', relativePath)
    return fs.readFileSync(fullPath, 'utf8')
  } catch (error) {
    console.error(`Can not read file lua at: ${relativePath}`, error)

    throw error
  }
}
export default {
  loadLuaScript
}