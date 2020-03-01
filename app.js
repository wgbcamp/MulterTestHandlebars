const express = require('express');
const exhbs = require('express-handlebars');
const multer = require('multer');
const path = require('path');

//Set storage engine
const storage = multer.diskStorage({
    destination: './images',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage, 
    limits:{fileSize: 10000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

//Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: Images Only!');
    }
}

//Initialize app
const app = express();

//Set engine to handlebars, main is default layout
app.engine('handlebars', exhbs({
    defaultLayout:'main'
}));

app.set('view engine','handlebars');


//sets images folder to be the default directory for local images
app.use(express.static('images'));

//show index and feed greeting
app.get('/', (req,res) =>{
    res.render('index', {
        greeting: "Welcome to my Home Page"
    });
});


//page for user to upload images
app.get('/upload', (req,res) =>{
    res.render('uploader', {

    })
})

//post request to send images to client webpage
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('uploader', {
               msg: err 
            });
        } else {
            if(req.file == undefined){
                res.render('uploader', {
                    msg: 'Error: No File Selected!'
                }); 
            }else {
                res.render('uploader', {
                    msg: 'File Uploaded!',
                    file: `${req.file.filename}`
                });
            }
        }
    });
});

//port 5005
const port = 5005;

//lets us know the server has started
app.listen(port, ()=> {
    console.log(`Server started on ${port}`);
});

