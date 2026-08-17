import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    // TODO: Implement creating a new TODO item
    logger.info('Processing createTodo event', { event })

    const userId = getUserId(event)
    const newTodo = JSON.parse(event.body)

    const newItem = await createTodo(userId, newTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({ item: newItem })
    }
  })
