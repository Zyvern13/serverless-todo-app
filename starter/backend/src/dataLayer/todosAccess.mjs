import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todosAccess')

const dynamoClient = AWSXRay.captureAWSv3Client(new DynamoDB())
const docClient = DynamoDBDocument.from(dynamoClient)

const todosTable = process.env.TODOS_TABLE
const todosIndex = process.env.TODOS_CREATED_AT_INDEX

export async function getTodosForUser(userId) {
  logger.info('Getting all todos for user', { userId })

  const result = await docClient.query({
    TableName: todosTable,
    IndexName: todosIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })

  return result.Items
}

export async function createTodo(todo) {
  logger.info('Creating a todo', { todoId: todo.todoId })

  await docClient.put({
    TableName: todosTable,
    Item: todo
  })

  return todo
}

export async function updateTodo(userId, todoId, updateData) {
  logger.info('Updating a todo', { todoId, userId })

  await docClient.update({
    TableName: todosTable,
    Key: { userId, todoId },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': updateData.name,
      ':dueDate': updateData.dueDate,
      ':done': updateData.done
    }
  })
}

export async function deleteTodo(userId, todoId) {
  logger.info('Deleting a todo', { todoId, userId })

  await docClient.delete({
    TableName: todosTable,
    Key: { userId, todoId }
  })
}

export async function updateAttachmentUrl(userId, todoId, attachmentUrl) {
  logger.info('Updating attachment URL', { todoId, userId })

  await docClient.update({
    TableName: todosTable,
    Key: { userId, todoId },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  })
}
