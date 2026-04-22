import ImageIcon from '@mui/icons-material/Image'
import { Box, FormHelperText, Paper, Typography, useColorScheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const ThumbnailUpload = () => {
  const { control } = useFormContext() // Lấy context từ form cha
  const [preview, setPreview] = useState(null)
  const { mode } = useColorScheme()

  //hiển thị ảnh xem trước
  const generatePreview = (file) => {
    if (!file) {
      setPreview(null)
      return
    }
    if (typeof file === 'string') {
      setPreview(file)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <Controller
      name="spu_thumb"
      control={control}
      rules={{ required: 'Product thumbnail is required' }}
      //field quản lý input nhập vào ,fieldState quản lý trạng thái
      render={({ field: { onChange, value }, fieldState: { error } }) => {

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          generatePreview(value)//nếu value thay đổi thì gen lại ảnh
        }, [value])

        const handleFile = (file) => {
          if (!file) return
          onChange(file)
        }

        return (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                border: '1.5px dashed',
                borderColor: error ? 'error.main' : 'secondary.main',
                background: error ? 'error.50' : 'rgba(52,101,200,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => document.getElementById('thumb-upload').click()}
            >
              <input
                id="thumb-upload"
                type="file"
                accept=".png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0])
                  }
                }}
              />

              {preview ? (
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 2 }}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: error ? 'transparent' :
                        mode === 'light' ? 'linear-gradient(135deg, #eef2ff, #dbeafe)'
                          : 'linear-gradient(135deg, #eefff6, #dcfedb)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1
                    }}
                  >
                    <ImageIcon sx={{ color: error ? 'error.main' : mode === 'light' ? 'primary.main' : 'secondary.main', fontSize: 28 }} />
                  </Box>
                  <Typography variant="body2" fontWeight={600} color={error ? 'error.main' : 'primary.contrastText'}>
                    Click to browse
                  </Typography>
                  <Typography variant="caption" color={error ? 'error.main' : 'primary.contrastText'}>
                    Only *.png, *.jpg and *.jpeg accepted
                  </Typography>
                </>
              )}

            </Paper>

            {error && (
              <FormHelperText error sx={{ mt: 1, fontWeight: 500 }}>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        )
      }}
    />
  )
}

export default ThumbnailUpload