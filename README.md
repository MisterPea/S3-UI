## S3 UI  :seedling:
### User interface for AWS's Simple Storage Service 

__Base functionality includes the ability to:__
* Create/Delete buckets
* Create/Delete folders
* Upload/download/delete files
* Upload via drag and drop
* Breadcrumb folder navigation
* Files uploaded with the same filename will be automatically renamed with a numeric iterator
* Bucket and folder navigation is done via query string; allowing bookmarking and sharing
* Usages across all screen sizes

__Features to be included in future iterations:__
* Send email links for file/folder download
* Ability to change filename
* File preview

<hr />

### To do:
* [x] Get List of Buckets - Name - Date Created - AWS Region
* [x] Create New Bucket
* [x] Prevent the addition of buckets of the same name
* [x] Delete Buckets
* [x] Error catching - Bucket Creation
* [x] Get Files/Folders
* [x] Framer Motion integration
* [x] Add Folder
* [x] Prevent the addition of folders of the same name
* [x] Generate new incremented filename for same name
* [x] Delete Folder
* [x] Error catching - Folder Creation
* [x] Drag and drop
* [x] Add File(s)
* [x] Deal with duplicate file names
* [x] Error catching - File Upload
* [x] Delete Files
* [x] Error catching - File Deletion
* [x] Get/Subscribe to Loading Percentage
* [x] Upload progress bar
* [x] Mobile Layout
* [x] Tablet Layout
* [x] Desktop Layout
* [x] Drag and drop when in an empty folder
* [x] Docker deployment
<hr />

Longer-term development
* [ ] Change Drag/Drop to use a specific drag-overlay-area, rather than a per list-item area
* [ ] Right click to delete/shift-click multiple files (via append current right-click menu)
* [ ] Send Email
* [ ] Generate a download url
* [ ] Upload folders with nested content
* [ ] Ability to change filename
* [ ] Preview files. Lo-res images or small text extracts
* [ ] Catches for incompatible filetypes like .app (which causes a hang) 

<hr />

#### Modes:
* Create a `.env` file in the `backend` folder.
  Options within the environment file are as follows:
  * `NODE_ENV`
   - `dev` (webpack dev server)
   - `prod` (docker-compose)
  
  * `ENV`
   - `localhost` (For local development using the webpack dev server. Initiated through `localstack start` in the cli)
   - `localstack` (Use the impermanent emulator - through docker-compose. `NODE_ENV` needs to be `prod`)
   - `aws` (Use the actual aws s3 server - provide access key and secret key. `NODE_ENV` needs to be `prod`)

##### Running locally:
Adjust the `devServer` `host` in [webpack.config.js] to match your local IP address.
* `$ localstack start` - To start aws development server
* `$ cd frontend` `npm start`
* `$ cd backend` `nodemon server` or `node server`

##### Running via docker compose:
From the project, root level in you cli:
To start: `docker-compose up`
To stop and remove all docker images: `docker-compose down && docker rmi $(docker images -q)`


#### localStack CLI integration:
Your actual S3 buckets can be cloned and populated into your localstack mock with [this script.](https://github.com/MisterPea/S3-Uploader/blob/d03793e7afabbc8ad6cc0580a94cbafae822fda2/shell%20scripts/CloneS3ToLocalstack.sh)

<hr />

#### Accessing/manipulating localstact S3 via CLI
Command line usage - s3:
`aws s3 ls --endpoint-url http://localhost:4566 s3://myS3Bucket`

Command line usage - s3api: 
`aws s3api put-object --endpoint-url http://localhost:4566 --bucket myS3Bucket --key folder_one/`

AWS S3 CLI Reference: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/index.html#cli-aws-s3

AWS S3api CLI Reference: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3api/index.html

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

##### Stack:
* React
* SCSS
* Redux
* Axios
* ExpressJS
* AWS S3 Client V3 - `@aws-sdk/client-s3`
* localStack
* Jest/Enzyme
* Adobe XD
