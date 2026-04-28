import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, IconButton } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

// ← Thêm ảnh vào đây
const mainSlides = [
  { id: 1, image: 'https://res.cloudinary.com/nguyennan12/image/upload/v1777387470/Livestream-ecommerce/Shops/69e364dfdf24f31846f15580/Products/gstp4pfnvjaohn6oqjak.jpg' },
  { id: 2, image: 'https://res.cloudinary.com/nguyennan12/image/upload/v1777387363/Livestream-ecommerce/wlvujjxht3rrvggulws1.jpg' },
  { id: 3, image: 'https://res.cloudinary.com/nguyennan12/image/upload/v1777387348/Livestream-ecommerce/xaou64ix5ryp8wviivwt.jpg' }
]


const leftSlides = 'https://res.cloudinary.com/nguyennan12/image/upload/v1777389114/Livestream-ecommerce/Shops/69e364dfdf24f31846f15580/Products/tnr7e4ybaso0fa33no65.jpg'


export const BannerHomePage = ({ autoPlayInterval = 4000 }) => {
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)

  const next = useCallback(() => setActive(p => (p + 1) % mainSlides.length), [])
  const prev = () => setActive(p => (p - 1 + mainSlides.length) % mainSlides.length)

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, autoPlayInterval)
  }, [next, autoPlayInterval])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  return (
    <Box sx={{ display: 'flex', gap: '6px', width: '100%' }}>

      <Box sx={{ position: 'relative', flex: '0 0 65%', borderRadius: 1.5, overflow: 'hidden' }}>
        <Box sx={{
          display: 'flex',
          transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: `translateX(-${active * 100}%)`
        }}>
          {mainSlides.map(slide => (
            <Box
              key={slide.id}
              component="img"
              src={slide.image}
              sx={{
                minWidth: '100%',
                height: { xs: 250, sm: 350, md: 500 },
                objectFit: 'cover',
                display: 'block'
              }}
            />
          ))}
        </Box>

        <IconButton
          onClick={() => { prev(); resetTimer() }}
          sx={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32,
            bgcolor: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(6px)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.48)' }
          }}
        >
          <KeyboardArrowLeft sx={{ color: '#fff', fontSize: 20 }} />
        </IconButton>


        <IconButton
          onClick={() => { next(); resetTimer() }}
          sx={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32,
            bgcolor: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(6px)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.48)' }
          }}
        >
          <KeyboardArrowRight sx={{ color: '#fff', fontSize: 20 }} />
        </IconButton>

        <Box sx={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '5px'
        }}>
          {mainSlides.map((_, i) => (
            <Box
              key={i}
              onClick={() => { setActive(i); resetTimer() }}
              sx={{
                width: i === active ? 18 : 7, height: 7,
                borderRadius: '4px',
                bgcolor: i === active ? '#fff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
            />
          ))}
        </Box>
      </Box>
      <Box
        component="img"
        src={leftSlides}
        sx={{
          width: '100%',
          height: { xs: 250, sm: 350, md: 500 },
          objectFit: 'cover',
          borderRadius: 1.5,
          display: 'block',
          minHeight: 0
        }}
      />
    </Box>
  )
}

const poster1 = 'https://res.cloudinary.com/nguyennan12/image/upload/v1777389315/Livestream-ecommerce/Shops/69e364dfdf24f31846f15580/Products/fvkesky0osiktsrtgwf5.jpg'
const poster2 = 'https://res.cloudinary.com/nguyennan12/image/upload/v1777391686/Livestream-ecommerce/Shops/69e364dfdf24f31846f15580/Products/lgj7vebaqzyhlwzhxeay.jpg'
export const PosterFirst = () => {
  return (
    <Box
      component="img"
      src={poster1}
      sx={{
        width: '100%',
        height: 160,
        objectFit: 'cover',
        display: 'block',
        borderRadius: 2
      }}
    />
  )
}
export const PosterSecond = () => {
  return (
    <Box
      component="img"
      src={poster2}
      sx={{
        width: '100%',
        height: 160,
        objectFit: 'cover',
        display: 'block',
        borderRadius: 2
      }}
    />
  )
}