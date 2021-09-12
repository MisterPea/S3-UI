const {
  S3Client,
  ListBucketsCommand,
  GetBucketLocationCommand,
  CreateBucketCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteBucketCommand,
} = require('@aws-sdk/client-s3');
const { tree } = require('./utilities');

const region = 'us-east-1';
const endpoint = encodeURI('http://localhost:4566');

/**
 * Method to create a new S3Client
 * @param {string} locale Location to bind the Client to
 * @return {S3Client} Return is a new instance of a S3Client
 */
const newClient = (locale) => new S3Client({
  region: locale,
  endpoint: endpoint,
  forcePathStyle: true,
});
// const newClient = (locale) => new S3Client({
//   region: locale,
// });

/**
 * Method standardizing error error reporting
 * @param {string} message Message pointing to location of the error
 * @param {string} error Error generated by .catch
 */
const logError = (message, error) => {
  throw new Error(`${error}: ${message}`);
};

/**
 * Root method to retrieve all S3 buckets associated with the client
 * @return {Promise[]} Returns a promise that yields an array of objects
 * - Keys: `Name`, `Region`, `CreationDate`
 */
function getAllBuckets() {
  const s3 = newClient(region);
  return getBuckets(s3).then((data) => appendBucketRegion(s3, data.Buckets));
}

/**
 * Pseudo-private method to retrieve a list of buckets
 * associated with the current S3 client
 * @param {S3Client} client S3 Client
 * @return {Promise[]} Array of objects with keys: `Name` and `CreationDate`
 */
function getBuckets(client) {
  return client.send(new ListBucketsCommand({}))
    .then((data) => data)
    .catch((err) => {
      logError('Getting buckets', err);
      return err;
    });
}

/**
 * Pseudo-private method to retrieve and append the region of S3 buckets
 * to buckets object array
 * @param {S3Client} client S3 Client
 * @param {Object[]} buckets Array of objects containing Name and CreationDate
 * @return {Promise[]} Returns an array of objects with the keys:
 *`Name`,`Region` and `CreationDate`
 */
function appendBucketRegion(client, buckets) {
  return Promise.all(
    buckets.map(({ Name, CreationDate }) => getRegion(client, Name)
      .then((Region) => ({
        Name,
        Region: Region.LocationConstraint || region,
        CreationDate,
      }))),
  ).then((results) => results);
}

/**
 * Method to determine the region of the S3 bucket
 * @param {S3Client} client S3 Client
 * @param {string} Name Name of bucket, which to find region
 * @return {Promise<string>} Return is a Promise that will resolve to a string
 */
function getRegion(client, Name) {
  return client.send(new GetBucketLocationCommand({ Bucket: Name }))
    .then((region) => region)
    .catch((err) => {
      logError(`Getting region for ${Name}`, err);
      return err;
    });
}

/**
 * Method to create a new S3 bucket
 * @param {string} bucketName Lowercase 3-63 characters a-z, 0-9, dots,hyphens.
 * @param {string} accessControlLevel Visibility of bucket
 * - Other accessControlLevel options are:
 * -- `public-read`, `public-read-write` and `authenticated-read`
 * @param {string} locale region the bucket will reside - default: `us-east-1`
 * - Other North American regions are:
 * -- `us-east-2`
 * -- `us-west-1`
 * -- `us-west-2`
 * - Errors:
 * -- `BucketAlreadyExists: BucketAlreadyExists`
 * -- - Buckets must have a globally unique name
 * -- `InvalidBucketName: The specified bucket is not valid.`
 * -- - Buckets must follow the naming convention set forth here:
 * https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
 *  - Other options are available, and this function can be extended
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
 * @return {Promise}
 */
function createBucket(bucketName, accessControlLevel = 'private', locale = region) {
  const s3 = newClient(locale);

  const params = {
    Bucket: bucketName,
    ACL: accessControlLevel,
  };
  return s3.send(new CreateBucketCommand(params))
    .then((data) => data)
    .catch((err) => {
      logError('Creating bucker', err);
      return err;
    });
}

/**
 * Method to delete a bucket from your account
 * @param {string} locale The region the bucket is located
 * @param {string} bucketName The bucket to be deleted
 * @return {Promise}
 */
function deleteBucket(locale, bucketName) {
  const s3 = newClient(locale);

  return s3.send(new DeleteBucketCommand({ Bucket: bucketName }))
    .then(() => ({ status: 200 }))
    .catch((err) => {
      logError('Deleting bucket', err);
      return { status: err };
    });
}

/**
 * Method to empty/delete files from a bucket
 * @param {string} locale The region the bucket is located
 * @param {string} bucketName Name of the bucket to be emptied
 */
function emptyBucket(locale, bucketName) {
  getBucketContents(locale, bucketName)
    .then((data) => {
      const contents = data.map(({ Key }) => ({ Key }));
      deleteBucketContents(bucketName, locale, contents);
    })
    .catch((err) => console.log(err));
}

/**
 * Method to empty/delete files/folders from a bucket.
 * @param {string} bucketName
 * @param {string} locale The region the bucket is located
 * @param {array<object>} keys Array of items to be deleted.
 * - Objects must have the key: Key. e.g. [{Key: 'myFolder/', Key: 'file.txt'}]
 * @return {Promise<object>}
 */
function deleteBucketContents(bucketName, locale, keys) {
  const s3 = newClient(locale);

  const params = {
    Bucket: bucketName,
    Delete: { Objects: keys },
  };
  return s3.send(new DeleteObjectsCommand(params))
    .then((data) => data)
    .catch((err) => {
      logError('Deleting bucket contents', err);
      return err;
    });
}

/**
 * Method to retrieve the contents of the bucket
 * @param {string} locale The region the bucket is located
 * @param {string} bucketName Bucket name
 * @return {Promise<array>} Returns an array of objects.
 * - Keys: `Key`, `LastModified`,`ETag`,`Size`,`StorageClass` and `Owner`
 */
function getBucketContents(locale, bucketName) {
  const s3 = newClient(locale);
  return s3.send(new ListObjectsV2Command({ Bucket: bucketName }))
    .then(({ Contents }) => tree(Contents))
    .catch((err) => { throw new TypeError(err); });
}

/**
 * Method to create an empty folder
 * @param {string} locale The region the bucket is located
 * @param {string} folderName The name of the new folder
 * @param {string} bucketName The name of the bucket
 * @return {Promise}
 */
function addFolder(locale = region, folderName, bucketName) {
  const s3 = newClient(locale);
  const params = {
    Bucket: bucketName,
    Key: `${folderName}/`,
    Body: '',
  };
  return s3.send(new PutObjectCommand(params))
    .then((data) => data)
    .catch((err) => {
      logError('Adding folder', err);
      return err;
    });
}

module.exports = {
  getAllBuckets,
  createBucket,
  getBucketContents,
  emptyBucket,
  deleteBucketContents,
  addFolder,
  deleteBucket,
};
