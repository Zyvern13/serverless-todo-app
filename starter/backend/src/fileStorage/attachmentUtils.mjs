import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('attachmentUtils')

const s3Client = AWSXRay.captureAWSv3Client(new S3Client())

const bucketName = process.env.ATTACHMENTS_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function getUploadUrl(todoId) {
  logger.info('Generating upload URL', { todoId, bucketName })

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })

  return url
}

export function getAttachmentUrl(todoId) {
  return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}
