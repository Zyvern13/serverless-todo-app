import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { generateUploadUrl } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('generateUploadUrl')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    logger.info('Processing generateUploadUrl event', { event })

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    const uploadUrl = await generateUploadUrl(userId, todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl })
    }
  })
