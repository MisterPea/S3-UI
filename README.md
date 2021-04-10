## S3 Uploader

Methods to operate buckets and upload files to S3.
<hr />
The basic setup for multipart-uploading is:

- A user chooses which file(s) to upload and the bucket they'll reside.
- On Submit, Express calls the `CreateMultipartUpload` method, which returns an `UploadId`.
- The file/Blob is sliced into 5MB chunks and each chunk is converted to a `base64` string via `FileReader()`.
- This is then passed in body data, via `FormData()` to the server.
  * Within the server, a class instance is created for each upload instance.
- On the server-side the file chunk is encoded into a `Buffer` and is sent to the `UploadPart` method along with `UploadId`, `PartNumber`, `Key` and `Bucket`.
- `UploadPart` returns a promise that gives an `ETag` which is stored in an array along with its corresponding `PartNumber`.
- Upon the completion of all uploaded parts `UploadId`, `Key`, `Bucket`, and a `Parts` array with all the `ETag` and `PartNumber` is sent to `CompleteMultipartUpload`.
- At this point the file chunks are stitched back together into a recognizable file.
<hr />

#### To do:
* [ ] Abstract-out the server-side actions to allow it to more behave like an api.
* [ ] Look into ways to abstract-out front end calls by, perhaps, moving them to the server.
* [ ] Have the `UploadId` derived on-the-fly rather than passed in. This will allow the front end to just send info without worrying about routing. 
* [ ] Add flag to allow user to receive upload confirmation and file location.
* [ ] Add method to track upload progress.
