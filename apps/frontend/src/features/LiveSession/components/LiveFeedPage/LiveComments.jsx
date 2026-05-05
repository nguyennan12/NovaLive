import SendIcon from '@mui/icons-material/Send'
import { Avatar, Box, IconButton, InputBase, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

const CommentItem = ({ comment }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.6, mb: 0.55 }}>
    <Avatar src={comment.avatar} sx={{ width: 22, height: 22, flexShrink: 0, fontSize: '0.6rem' }}>
      {comment.userName?.[0]?.toUpperCase()}
    </Avatar>
    <Box sx={{
      bgcolor: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(4px)',
      borderRadius: '10px', px: 1, py: 0.35,
      maxWidth: '90%', wordBreak: 'break-word'
    }}>
      <Box component="span" sx={{ color: '#ffd166', fontWeight: 700, fontSize: '0.68rem' }}>
        {comment.userName}
      </Box>
      <Box component="span" sx={{ color: 'rgba(255,255,255,0.92)', fontSize: '0.68rem', ml: 0.5 }}>
        {comment.message}
      </Box>
    </Box>
  </Box>
)

const LiveComments = ({ comments, onSend, commentError }) => {
  const [text, setText] = useState('')
  const listRef = useRef(null)

  // Auto-scroll khi có comment mới
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [comments.length])

  const handleSend = () => {
    const msg = text.trim()
    if (!msg) return
    onSend(msg)
    setText('')
  }

  return (
    <Box sx={{
      position: 'absolute', bottom: 0, left: 0, right: 54,
      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 50%, transparent 100%)',
      px: 1, pb: 1, pt: 3,
      pointerEvents: 'none'
    }}>
      {/* Danh sách comment */}
      <Box
        ref={listRef}
        sx={{
          maxHeight: 128,
          overflowY: 'auto',
          mb: 0.6,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none'
        }}
      >
        {comments.length === 0 && (
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', pl: 0.5 }}>
            Hãy là người đầu tiên bình luận...
          </Typography>
        )}
        {comments.map(c => <CommentItem key={c.id} comment={c} />)}
      </Box>

      {commentError && (
        <Typography sx={{ color: '#ff6b6b', fontSize: '0.65rem', mb: 0.4, pl: 0.5 }}>
          {commentError}
        </Typography>
      )}

      {/* Input gửi comment */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 0.5,
        bgcolor: 'rgba(255,255,255,0.12)',
        borderRadius: '20px', px: 1.5, py: 0.3,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)',
        pointerEvents: 'auto'
      }}>
        <InputBase
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend() } }}
          placeholder="Nhắn tin..."
          sx={{
            flex: 1, color: 'white', fontSize: '0.8rem',
            '& input::placeholder': { color: 'rgba(255,255,255,0.5)' }
          }}
          inputProps={{ maxLength: 200 }}
        />
        <IconButton
          onClick={handleSend}
          size="small"
          disabled={!text.trim()}
          sx={{ color: 'white', p: 0.3, '&.Mui-disabled': { color: 'rgba(255,255,255,0.28)' } }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default LiveComments
