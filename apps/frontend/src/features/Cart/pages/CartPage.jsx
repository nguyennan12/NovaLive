import { Container, Grid, Typography } from '@mui/material'
import CartList from '../components/CartList'
import CartSummary from '../components/CartSummary'

function CartPage() {
  return (
    <Container
      maxWidth="lg"
      sx={{ pt: { xs: 2.5, md: 4 }, pb: { xs: '110px', md: '100px' } }}
    >
      <Typography sx={{
        fontWeight: 800, mb: 3,
        color: 'primary.contrastText',
        fontSize: { xs: '1.15rem', md: '1.45rem' }
      }}>
        Giỏ hàng
      </Typography>

      <Grid container columns={10} spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
        <Grid size={{ xs: 10, md: 7 }}>
          <CartList />
        </Grid>

        <Grid size={{ xs: 10, md: 3 }}>
          <CartSummary />
        </Grid>
      </Grid>
    </Container>
  )
}

export default CartPage
