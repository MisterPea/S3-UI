# S3 UI  :seedling:
## !! An updated app is in the works as we speak !!
## You can follow the progress [here](https://github.com/MisterPea/S3_Sherpa).
### User interface for AWS's Simple Storage Service 

__Base functionality includes the ability to:__
* Create/Delete buckets
* Create/Delete folders
* Upload/download/delete files
* Upload via drag and drop
* Breadcrumb folder navigation
* Files uploaded with the same filename will be automatically renamed with a numeric iterator
* Bucket and folder navigation is done via query string; allowing bookmarking and sharing
* Usage across all screen sizes

__Features to be included in future iterations:__
* Send email links for file/folder download
* Ability to change filename
* File preview

## Configuration:
##### S3_UI can be run in either development or production mode.

* For both, modify the `.env` file in the `backend` folder as needed.
  Options within the .env file are as follows:
  
**`NODE_ENV`**
   - `dev` (webpack dev server)
   - `prod` (docker-compose)
  
 **`ENV`**
   - `localhost` (For local development using the webpack dev server. Initiated through `localstack start` in the cli)
   - `localstack` (Use the impermanent emulator - through docker-compose. `NODE_ENV` needs to be `prod`)
   - `aws` (Use the actual aws s3 server - provide access key and secret key. `NODE_ENV` needs to be `prod`)

---

_**Running locally:**_
* Adjust the `devServer` `host` and the argument within `DefinePlugin > HOSTNAME` in [webpack.config.js](https://github.com/MisterPea/S3-UI/blob/main-origin/frontend/webpack.config.js#L47-L53) to match your local IP address.
* `$ pip install localstack`
* `$ localstack start` - To start aws development server
* `$ cd frontend` `npm start`
* `$ cd backend` `nodemon server` or `node server`

_**Running via docker compose:**_
From the project, root level in your cli:
* For local usage, change the `HOSTNAME` endpoint from `s3ui.misterpea.me` to `localhost` within [`webpack.config.js`](https://github.com/MisterPea/s3-ui/blob/4c873e8d0c40c7dfa0c418e003f988a1b5822929/frontend/webpack.config.js#L47).
* To start: `docker-compose up`
* To stop and remove all docker images: `docker-compose down && docker rmi $(docker images -q)`


#### localStack CLI integration:
Your actual S3 buckets can be cloned and populated into your localstack[^1] mock with [this script.](https://github.com/MisterPea/S3-UI/blob/main-origin/shell%20scripts/CloneS3ToLocalstack.sh)

[^1]:Only works when running localstack via `localstack start`, with the project running locally


<hr />

#### Accessing/manipulating localstack S3 via CLI
Command line usage - s3:
`aws s3 ls --endpoint-url http://localhost:4566 s3://myS3Bucket`

Command line usage - s3api: 
`aws s3api put-object --endpoint-url http://localhost:4566 --bucket myS3Bucket --key folder_one/`

AWS S3 CLI Reference: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/index.html#cli-aws-s3

AWS S3api CLI Reference: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3api/index.html

## To do:
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
* [x] Remove Redux Logging
* [x] HTTPS
* [ ] Fix address bar retract on mobile/tablet - prolly will need to reconfigure the DOM construction
* [ ] Some notification from when a object is requested for download, and when the download starts
* [ ] Code splitting
* [ ] 404
* [ ] Handling for non-existent query string
* [ ] Handling and ZIP formats
<hr />

Longer-term development
* [ ] Conditional fetches for buckets utilizing cache control
* [ ] Change file/folder/bucket list to use event delegation
* [ ] Change Drag/Drop to use a specific drag-overlay-area, rather than a per list-item area
* [ ] Right click to delete/shift-click multiple files (via append current right-click menu)
* [ ] Send Email
* [ ] Generate a download url
* [ ] Upload folders with nested content
* [ ] Ability to change filename
* [ ] Preview files. Lo-res images or small text extracts
* [ ] Catches for incompatible filetypes like .app (which causes a hang)
* [ ] User/Error logs

<hr />

##### Stack:
* React
* SCSS
* Redux
* Axios
* ExpressJS
* AWS S3 Client V3 - `@aws-sdk/client-s3`
* Docker
* Nginx
* GCP Compute Engine
* localStack
* Jest/Enzyme
* Adobe XD
