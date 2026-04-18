import { Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Box> he</Box>} />
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/verify' element={<Auth />} />
    </Routes>
  )
}

export default AppRoutes