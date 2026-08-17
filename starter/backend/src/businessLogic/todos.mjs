import { v4 as uuidv4 } from 'uuid'
import {
  getTodosForUser,
  createTodo as createTodoItem,
  updateTodo as updateTodoItem,
  deleteTodo as deleteTodoItem,
  updateAttachmentUrl
} from '../dataLayer/todosAccess.mjs'
import {
  getUploadUrl,
  getAttachmentUrl
} from '../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todos')

export async function getTodos(userId) {
  logger.info('Getting todos for user', { userId })
  return getTodosForUser(userId)
}

export async function createTodo(userId, newTodo) {
  const todoId = uuidv4()

  const newItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  }

  logger.info('Creating new todo', { todoId, userId })
  await createTodoItem(newItem)

  return newItem
}

export async function updateTodo(userId, todoId, updateData) {
  logger.info('Updating todo', { todoId, userId })
  await updateTodoItem(userId, todoId, updateData)
}

export async function deleteTodo(userId, todoId) {
  logger.info('Deleting todo', { todoId, userId })
  await deleteTodoItem(userId, todoId)
}

export async function generateUploadUrl(userId, todoId) {
  logger.info('Generating upload URL', { todoId, userId })

  const attachmentUrl = getAttachmentUrl(todoId)
  await updateAttachmentUrl(userId, todoId, attachmentUrl)

  const uploadUrl = await getUploadUrl(todoId)
  return uploadUrl
}
