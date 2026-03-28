import express from 'express'

const Router = express.Router()

Router.get('/', (req, res) => {
  res.send('Run server successfully')
})

export default Router;