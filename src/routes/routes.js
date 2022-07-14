const express = require('express');
const router = express.Router();
var multer = require('multer');
const path = require('path')
const passport = require('passport');
require("../controller/passportlocal")(passport);
const csrf = require("csurf");

router.use(csrf());

const uploadPath = path.join(__dirname, "../../public/uploads");

// image upload
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, cb) {
        cb(null, 'Image' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var validextension = ['.png', '.jpg', '.jpeg'];
        var ext = path.extname(file.originalname);
        if (!validextension.includes(ext)) {
            return cb(new Error("please choose .png,.jpg of .jpeg files !"));
        }
        cb(null, true)
    },
    limits: { fileSize: 125000 * 10 },
}).single('file');


const {
    home,
    about,
    gallery,
    event,
    contact,
    contactUser,
    getLogin,
    getSignup,
    getGallery,
    getTestimonial,
    addImage,
    addTestimonial,
    editImage,
    editTestimonial,
    signUp,
    Login,
    Logout,
    getEmails,
    uploadImage,
    deleteImage,
    editGallery,
    uploadTestimonial,
    deleteTestimonial,
    editTestimonialData,
    addReview,
    eventContact,
    getEvents
} = require('../controller/homeController');


//* admin authentication 
const checkAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == 'admin') {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();

    } else {
        req.flash('error_messages', "Please Login to continue !");
        res.render('login', { csrfToken: req.csrfToken(), error: "Please Login to continue !" });
    }
}


//  home controller
router.get('/', home);
//  about get controller
router.get('/about', about);
//  gallery get controller
router.get('/gallery', gallery);
//  event get controller
router.get('/event', event);
//  contact get controller
router.get('/contact', contact);



//  contact post  controller
router.post('/contactUser', contactUser);
// event contact details post controller
router.post('/eventContact', eventContact)
// add review post controller
router.post('/addReview', addReview);



// admin controller
//  login get controller
router.get('/getLogin', getLogin);
//  Signup get controller
router.get('/getSignup', getSignup);
//  gallery get controller
router.get('/getGallery', checkAuth, getGallery);
//  Testimonial get controller
router.get('/getTestimonial', checkAuth, getTestimonial);
// add Image get controller
router.get('/addImage', checkAuth, addImage);
// add Testimonial get controller
router.get('/addTestimonial', checkAuth, addTestimonial);
// edit Image get controller
router.get('/editImage/:id', checkAuth, editImage);
// edit Testimonial get controller
router.get('/editTestimonial/:id', checkAuth, editTestimonial);
// logout get controller
router.get('/Logout', checkAuth, Logout);
// emails get controller
router.get('/getEmails', checkAuth, getEmails);
//delete image get controller
router.get('/deleteImage/:id', checkAuth, deleteImage);
//delete testimonial get controller
router.get('/deleteTestimonial/:id', checkAuth, deleteTestimonial)
// event contact details get controller
router.get('/getEvents', checkAuth, getEvents)

//  sign up post controller
router.post('/signUp', signUp);
//  login post controller
router.post('/Login', Login);
//  upload image post controller
router.post('/uploadImage', upload, uploadImage);
// edit gallery post controller
router.post('/editGallery', upload, editGallery)
// upload testimonials post controller
router.post('/uploadTestimonial', uploadTestimonial)
// edit testimonials post controller
router.post('/editTestimonialData', checkAuth, editTestimonialData);

// export routes
module.exports = router;
