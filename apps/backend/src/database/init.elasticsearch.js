import { Client } from '@elastic/elasticsearch'
import { env } from '#config/environment.config.js'

export const ElasticClient = new Client({
  node: `http://${env.ELASTIC_HOST}:${env.ELASTIC_PORT}`,
  auth: {
    username: env.ELASTIC_USER_NAME,
    password: env.ELASTIC_PASSWORD
  }
})

const connectElastic = async (retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await ElasticClient.info()
      console.log('Elastic Search connected')
      return
    } catch (err) {
      await new Promise(r => setTimeout(r, delay))
    }
  }
  console.error('Elastic Search connected error')
}

connectElastic()