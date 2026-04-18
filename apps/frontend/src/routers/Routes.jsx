import { Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import Live from '~/pages/Live/Live'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Box> he</Box>} />
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/verify' element={<Auth />} />
      <Route path='/live' element={<Live />} />
    </Routes>
  )
}

export default AppRoutes