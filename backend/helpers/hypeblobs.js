const { StorageSharedKeyCredential } = require("@azure/storage-blob");
const dotenv = require('dotenv')
dotenv.config()
// @ts-check
const { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters, ContainerClient } = require('@azure/storage-blob')
const { v1: uuidv1 } = require('uuid')

const connectionUrl = process.env.HYPE_BLOBS_CONNECTION_URL
const containerName = process.env.HYPE_BLOBS_CONTAINER_NAME
const accountName = process.env.HYPE_BLOBS_ACCOUNT_NAME
const accountKey = process.env.HYPE_BLOBS_ACCOUNT_KEY

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionUrl, sharedKeyCredential)
const containerClient = blobServiceClient.getContainerClient(containerName)

const uploadFileUrl = async () => {
  // generate temp url for client to upload data directly on azure
  try {
    const blobName = uuidv1()
    // const blobClient = containerClient.getBlobClient(blobName)
    // const blockBlobClient = blobClient.getBlockBlobClient()
    // const uploadBlobResponse = await blockBlobClient.upload(content, Buffer.byteLength(content))

    const uploadUrl = getBlobSasUri(
      containerClient,
      blobName,
      sharedKeyCredential,
      null,
      'wd');

    return {
      blobName: blobName,
      uploadUrl
    }
  } catch (err) {
    return {
      blobName: null,
      uploadUrl: null,
      error: err
    }
  }
}

const readFileUrl = async (fileUUID) => {
  // generate temp url for client to read file directly from azure

  try {
    const blobName = fileUUID

    const uploadUrl = getBlobSasUri(
      containerClient,
      blobName,
      sharedKeyCredential,
      null,
      'r')

    return {
      blobName: blobName,
      uploadUrl
    }
  } catch (err) {
    return {
      blobName: null,
      uploadUrl: null,
      error: err
    }
  }
}

// Create a service SAS for a blob
function getBlobSasUri(
  containerClient,
  blobName,
  sharedKeyCredential,
  storedPolicyName,
  permission
) {
  const sasOptions = {
    containerName: containerClient.containerName,
    blobName: blobName
  };

  if (storedPolicyName == null) {
    sasOptions.startsOn = new Date();
    sasOptions.expiresOn = new Date(new Date().valueOf() + 3600 * 1000);
    sasOptions.permissions = permission ? permission : BlobSASPermissions.parse("r");;
  } else {
    sasOptions.identifier = storedPolicyName;
  }

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
  // console.log(`SAS token for blob is: ${sasToken}`);

  return `${containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
}

// A helper method used to read a Node.js readable stream into a Buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}

module.exports = {
  uploadFileUrl,
  readFileUrl,
  streamToBuffer
}