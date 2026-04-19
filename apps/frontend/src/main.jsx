import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App'
import { store } from './redux/store'
import theme from './theme'

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
