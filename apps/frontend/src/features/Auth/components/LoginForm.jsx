import { Card as MuiCard } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import FieldErrorAlert from '~/components/common/Form/FieldErrorAlert'
import { loginUserAPI } from '~/redux/user/userSlice'
import { useColorScheme } from '@mui/material'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE,
  PASSWORD_RULE
} from '~/utils/validators'

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  let [searchParams] = useSearchParams()
  const { mode } = useColorScheme()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const onSubmitLogin = (data) => {
    const { email, password } = data
    toast.promise(dispatch(loginUserAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then(res => {
      if (!res.error) navigate('/')
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmitLogin)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: '380px', maxWidth: '380px' }}>
          <Box sx={{ margin: '1em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ fontWeight: '600' }}>Welcome Back!</Typography>
            <Typography variant='b2' sx={{ color: '#838383' }}>Enter your credentials to access your account</Typography>
          </Box>

          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
            {verifiedEmail &&
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>
                &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
              </Alert>
            }
            {registeredEmail &&
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
                <br />Please check and verify your account before logging in!
              </Alert>
            }
          </Box>

          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter Password..."
                type="text"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_CONFIRMATION_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                background: mode === 'dark'
                  ? 'linear-gradient(90deg, #0d6d08, #2cb92f, #8dd654)'
                  : 'linear-gradient(90deg, #3465c8, #69aedc, #8acdde)',
                color: '#ffffff'
              }}

            >
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center', display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Typography>{'Don\'t have an account?'}</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'secondary.main' }}>Create account</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form >
  )
}

export default LoginForm