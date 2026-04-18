import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import theme from './theme'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

const persitor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persitor}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider>
            <CssBaseline />
            <App />
            <ToastContainer autoClose={2000} theme="colored" />
          </ConfirmProvider>
        </ThemeProvider >
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
