import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { getTodos } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('getTodos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    // TODO: Get all TODO items for a current user
    logger.info('Processing getTodos event', { event })

    const userId = getUserId(event)
    const items = await getTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({ items })
    }
  })
