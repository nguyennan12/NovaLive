/* eslint-disable no-unused-vars */
// import axios from 'axios'

const calculateFee = async ({ shopId, toAddress, weight }) => {
  // =========================================
  // FAKE
  // =========================================
  const fakeFee = weight > 1000 ? 50000 : 30000

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeFee)
    }, 200)
  })

  // =========================================
  // Gọi API Giao Hàng Nhanh thật
  // =========================================
}

export default { calculateFee }