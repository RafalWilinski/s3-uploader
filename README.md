## s3-uploader
macOS app for uploading files
 
Simply drag & drop files you'd like to upload on bucket icon displayed on your status bar

![Upload Animation](/upload_anim.gif?raw=true "Upload Anim")

#### Configuration
Simply click on bucket and follow instructions. You'll need access key and secret key for AWS user with S3 Exec Role.
You can also try modifying `.awscredentials.json` file on your own. 

#### Features
- logging in to AWS S3 account with access + secret keys
- upload files by dragging them on status bar icon and on window
- settings permissions and storage classes for uploads
- get S3 link by clicking uploaded file from list
- support for dropping many files at once and directories

#### Todo
- [x] Automatic login on start (no need to enter credentials with every start)
- [ ] Add possibility to abort uploads
- [ ] Tests!
- [ ] Packages for distribution
- [ ] Possibility to disable notifications & automatic URL-to-clipboard write

#### Credits
Special thanks to [parkjisun](https://thenounproject.com/naripuru/), [Sergey Furtaev](https://thenounproject.com/furtaev/), [Timothy Miller](https://thenounproject.com/tmthymllr/), [Joe Mortell](https://thenounproject.com/JoeMortell/) for Icons from [nounproject.com](https://thenounproject.com/)
