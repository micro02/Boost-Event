const express = require("express");
const contactModel = require("../models/contact");
const nodemailer = require('nodemailer');
const bcryptjs = require("bcryptjs");
const passportAdmin = require("passport");
require("./passportlocal")(passportAdmin);
const userAdmin = require("../models/admin");
const galleryModel = require("../models/gallery");
const testimonialModel = require("../models/testimonial")
const eventModel = require("../models/event");
require('dotenv').config();


// home get method
const home = (req, res) => {
  try {
    console.log(req.csrfToken())
    res.render("index", { title: "home", op: "contactUser", csrfToken: req.csrfToken() });
  }
  catch (err) {
    res.status(500).send(err);
    console.log(err);
  }

}

const addReview = async (req, res) => {
  try {
    const { name, message, date } = req.body;
    if (!name || !message || !date) {
      res.render("about", {
        err: "All Fields Required !",
        logged: true,
        csrfToken: req.csrfToken(),
        user: req.user,
        testimonial: testimonialData,
        op: "addReview"
      });
    } else {
      const testimonialData = await testimonialModel.find({});
      // validate Testimonial if already present in the database
      testimonialModel.findOne(
        { $or: [{ name: name }, { message: message }] },
        async function (err, data) {
          if (err) throw err;
          if (data) {
            res.render("about", {
              err: "review Exists, add another one !",
              csrfToken: req.csrfToken(),
              logged: true,
              user: req.user,
              testimonial: testimonialData,
              op: "addReview"
            });
          } else {
            const testimonials = new testimonialModel({
              name,
              message,
              date,
            });
            await testimonials.save();
            const testimonialUpdateData = await testimonialModel.find({});
            console.log(testimonialUpdateData)
            res.status(201).render("about", {
              csrfToken: req.csrfToken(),
              logged: true,
              msg: "Review added successfully!",
              testimonial: testimonialUpdateData,
              op: "addReview"
            });
          }
        }
      );
    }
  }
  catch (err) {
    res.status(500).send(err);
    console.log(err)
  }
}

// about get method
const about = async (req, res) => {
  try {
    const testimonialData = await testimonialModel.find({});
    console.log(testimonialData)
    res.render('about', { title: "about", testimonial: testimonialData, op: "addReview", csrfToken: req.csrfToken() })
  }
  catch (err) {
    res.status(500).send(err);
    Console.log(err)
  }
}

// gallery get method
const gallery = async (req, res) => {
  try {
    const ImageData = await galleryModel.find({});
    console.log(ImageData)
    res.render('gallery', { title: "Gallery", Image: ImageData });
  }
  catch (err) {
    res.status(400).send(err)
    console.log(err);
  }


}


// event get method
const event = (req, res) => {
  res.render('event', { title: 'Event' });
}

// contact get method
const contact = (req, res) => {
  res.render('contact', { title: 'Contact', csrfToken: req.csrfToken() });
}

// contact post method
const contactUser = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!email || !name || !phone || !message) {
      res.render("contact", {
        err: "All Fields Required !"
      });
    }
    else {
      var userData = new contactModel({
        name,
        email,
        phone,
        message
      });
      const newUser = await userData.save()
      const transporter = nodemailer.createTransport({ 
	service: "gmail",
	auth: {
		user: 'trialjust71@gmail.com',
		pass: 'lnvqfwtkjlucgrvf'
	       }
	});
      const mailOptions = {
        from: 'trialjust71@gmail.com',
        to: 'info@boostevent.in',
        subject: 'User Information',
        text: `Name - ${req.body.name}, Email - ${req.body.email}, Phone Number - ${req.body.phone}, Message - ${req.body.message}`,
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).render('404');
          console.log(error);
        } else {
          res.status(200).render('contact', { msg: 'email send successful' });
          console.log('Email sent: ' + info.response);
        }
      });
    }
  }
  catch (err) {
    res.status(400).render('404');
  }
}


// login get method
const getLogin = (req, res) => {
  res.render('login', { title: 'login', csrfToken: req.csrfToken() });
}

// register get method
const getSignup = (req, res) => {
  res.render('register', { title: 'register', csrfToken: req.csrfToken() });
}

// gallery get method
const getGallery = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const ImageData = await galleryModel.find({});
      console.log(ImageData)
      res.render("galleryList", { title: "Gallery List", logged: true, user: req.user, csrfToken: req.csrfToken(), Image: ImageData });
    }
    catch (err) {
      res.status(400).send(err)
      console.log(err);
    }
  } else {
    res.render('galleryList', { title: 'Gallery List', logged: false });
  }
}

// add gallery get method
const addImage = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("addImage", { title: "Add Image", logged: true, user: req.user, csrfToken: req.csrfToken(), op: "uploadImage" });
  } else {
    res.render('addImage', { title: 'Add Image', logged: false });
  }
}

// edit gallery get method
const editImage = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const Id = req.params.id;
      const ImageData = await galleryModel.findById({ _id: Id });
      console.log(ImageData)
      res.render("addImage", { title: "Edit Image", logged: true, user: req.user, csrfToken: req.csrfToken(), Image: ImageData, op: "editGallery", warning: true });
    }
    catch (err) {
      res.status(404).send(err)
      console.log(err)
    }
  } else {
    res.render('addImage', { title: 'Edit Image', logged: false });
  }
}

// Testimonial get method
const getTestimonial = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const testimonialData = await testimonialModel.find({});
      console.log(testimonialData)
      res.render("testimonialList", { title: "  Testimonial", logged: true, user: req.user, csrfToken: req.csrfToken(), testimonial: testimonialData })
    }
    catch (err) {
      res.status(500).send(err);
      Console.log(err)
    }
  } else {
    res.render('testimonialList', { title: ' Testimonial', logged: false });
  }
}

// add Testimonial get method
const addTestimonial = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("addTestimonial", { title: "Add Testimonial", op: "uploadTestimonial", logged: true, user: req.user, csrfToken: req.csrfToken() });
  } else {
    res.render('addTestimonial', { title: 'Add Testimonial', logged: false });
  }
}

// edit Testimonial get method
const editTestimonial = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const Id = req.params.id;
      const testimonialData = await testimonialModel.findById({ _id: Id });
      res.render("addTestimonial", { title: "Edit Testimonial", logged: true, user: req.user, csrfToken: req.csrfToken(), testimonial: testimonialData, op: "editTestimonialData" });
    }
    catch (err) {
      res.status(404).send(err)
      console.log(err)
    }
  } else {
    res.render('addTestimonial', { title: 'Edit Testimonial', logged: false });
  }
}


// emails get method
const getEmails = async (req, res) => {
  if (req.isAuthenticated()) {
    const data = await contactModel.find({});
    if (data != null) {
      res.render("emails", { title: "Emails", logged: true, user: req.user, emailData: data, csrfToken: req.csrfToken() });
    }
    else {
      res.render("emails", { title: "Emails", logged: true, user: req.user, emailData: null, csrfToken: req.csrfToken() });

    }
  } else {
    res.render('emails', { title: 'gallery', logged: false });
  }
}

// signup  post method
const signUp = (req, res) => {
  try {
    // get all the values
    const { email, username, password, confirmpassword } = req.body;
    // check if the are empty
    if (!email || !username || !password || !confirmpassword) {
      res.render("signup", {
        err: "All Fields Required !",
        csrfToken: req.csrfToken(),
      });
    } else if (password != confirmpassword) {
      res.render("register", {
        err: "Password Don't Match !",
        csrfToken: req.csrfToken(),
      });
    } else {
      // validate email and username and password
      // skipping validation
      // check if a user exists
      userAdmin.findOne(
        { $or: [{ email: email }, { username: username }] },
        function (err, data) {
          if (err) throw err;
          if (data) {
            res.render("register", {
              err: "User Exists, Try Logging In !",
              csrfToken: req.csrfToken(),
            });
          } else {
            // generate a salt
            bcryptjs.genSalt(12, (err, salt) => {
              if (err) throw err;
              // hash the password
              bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                // save user in db
                userAdmin({
                  username: username,
                  email: email,
                  password: hash,
                  googleId: null,
                  provider: 'email',
                }).save((err, data) => {
                  if (err) throw err;
                  // login the user
                  // use req.login
                  // redirect , if you don't want to login
                  res.redirect("/getLogin");
                });
              });
            });
          }
        }
      );
    }
  } catch (err) {
    console.log("In Catch Block");
    console.log(err);
  }
};


// login  get method
const Login = (req, res, next) => {
  passportAdmin.authenticate("local", {
    failureRedirect: "getLogin",
    successRedirect: "/getGallery",
    failureFlash: true,
    logged: true,
    user: req.user,
  })(req, res, next);
};

//  logout get method
const Logout = (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    res.redirect("/getLogin");
  });
};

// upload image post method
const uploadImage = (req, res) => {
  try {
    console.log(req.file);
    const image = req.file.filename;
    const { name, details } = req.body;
    if (!name || !details) {
      res.render("addImage", {
        err: "All Fields Required !",
        logged: true,
        csrfToken: req.csrfToken(),
        user: req.user,
      });
    } else {
      // validate Image if already present in the database
      galleryModel.findOne(
        { $or: [{ name: name }, { details: details }] },
        function (err, data) {
          if (err) throw err;
          if (data) {
            res.render("addImage", {
              err: "Image Exists, add another one !",
              csrfToken: req.csrfToken(),
              logged: true,
              user: req.user,
            });
          } else {
            const galleries = new galleryModel({
              name,
              details,
              image,
            });
            galleries.save();
            // res.status(201).render("addImage", {
            //   csrfToken: req.csrfToken(),
            //   logged: true,
            //   msg: "Image added successfully!",
            // });
            res.status(201).redirect('/addimage');
          }
        }
      );
    }
  }
  catch (err) {
    res.status(500).send(err);
    console.log(err)
  }
}

// delete image get method
const deleteImage = async (req, res) => {
  try {

    const id = req.params.id;
    galleryModel.findByIdAndRemove(id, (err, doc) => {
      if (!err) {
        res.redirect('back');
      }
      else {
        console.log('Error during delete : ' + err);
      }
    })
  }
  catch (err) {
    res.status(500).send(err);
    console.log(err)
  }
}

// edit gallery post method
const editGallery = async (req, res) => {
  try {
    const id = req.body.id;
    const ImageData = await galleryModel.findById({ _id: id });
    const galleries = {
      name: req.body.name,
      details: req.body.details,
      image: req.file.filename
    }
    galleryModel.findByIdAndUpdate(id, galleries, { new: true }, (err, docs) => {
      if (!err) {
        res.status(201).render("addImage", {
          logged: true,
          Image: docs,
          msg: "image updated successfully!",
          csrfToken: req.csrfToken(),
          user: req.user,
        });
      }
      else {
        res.render("addImage", {
          err: "Something wrong when updating image !",
          logged: true,
          Image: ImageData,
          csrfToken: req.csrfToken(),
          user: req.user,
        });
      }
    });

  }
  catch (err) {
    res.status(404).send(err);
    console.log(err)
  }
}

// upload testimonial post method 
const uploadTestimonial = async (req, res) => {
  try {
    const { name, message, date } = req.body;
    if (!name || !message || !date) {
      res.render("addTestimonial", {
        err: "All Fields Required !",
        logged: true,
        csrfToken: req.csrfToken(),
        user: req.user,
      });
    } else {
      // validate Testimonial if already present in the database
      testimonialModel.findOne(
        { $or: [{ name: name }, { message: message }] },
        function (err, data) {
          if (err) throw err;
          if (data) {
            res.render("addTestimonial", {
              err: "Testimonial Exists, add another one !",
              csrfToken: req.csrfToken(),
              logged: true,
              user: req.user,
            });
          } else {
            const testimonials = new testimonialModel({
              name,
              message,
              date,
            });
            testimonials.save();
            res.status(201).render("addTestimonial", {
              csrfToken: req.csrfToken(),
              logged: true,
              msg: "Testimonial added successfully!",
            });
          }
        }
      );
    }
  }
  catch (err) {
    res.status(500).send(err);
    console.log(err)
  }

}

// delete testimonial get method
const deleteTestimonial = async (req, res) => {
  try {
    const id = req.params.id;
    testimonialModel.findByIdAndRemove(id, (err, doc) => {
      if (!err) {
        res.redirect('back');
      }
      else {
        console.log('Error during delete : ' + err);
      }
    })
  }
  catch (err) {
    res.status(500).send(err);
    console.log(err)
  }

}

// edit testimonials post method
const editTestimonialData = async (req, res) => {
  try {
    const id = req.body.id;
    const testimonialData = await galleryModel.findById({ _id: id });
    const testimonials = {
      name: req.body.name,
      message: req.body.message,
      date: req.body.date
    }
    testimonialModel.findByIdAndUpdate(id, testimonials, { new: true }, (err, docs) => {
      if (!err) {
        res.status(201).render("addTestimonial", {
          logged: true,
          testimonial: docs,
          msg: "Testimonial updated successfully!",
          csrfToken: req.csrfToken(),
          user: req.user,
        });
      }
      else {
        res.render("addTestimonial", {
          err: "Something wrong when updating Testimonial !",
          logged: true,
          testimonial: testimonialData,
          csrfToken: req.csrfToken(),
          user: req.user,
        });
      }
    });

  }
  catch (err) {
    res.status(404).send(err);
    console.log(err)
  }

}


//event contact details post method
const eventContact = async (req, res) => {
  try {
    const { name, event, phone } = req.body;
    if (!name || !phone || !event) {
      res.render("index", {
        err: "All Fields Required !",
        success: false
      });
    }
    else {
      var eventData = new eventModel({
        name,
        event,
        phone
      });
      console.log(eventData);
      const newEvent = await eventData.save()
      const transporter = nodemailer.createTransport({ 
	service: "gmail",
	auth: {
		user: 'trialjust71@gmail.com',
		pass: 'lnvqfwtkjlucgrvf'
	       }
	});
      const mailOptions = {
        from: 'trialjust71@gmail.com',
        to: 'info@boostevent.in',
        subject: 'User Information',
        text: `client name = ${req.body.name} , client phone = ${req.body.phone}, Event name =  ${req.body.event}`,
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).render('404');
          console.log(error);
        } else {
          res.status(200).render('contact', { msg: 'email send successful' });
          console.log('Email sent: ' + info.response);
        }
      });
    }
  }
  catch (err) {
    res.status(400).render('404');
  }

}


// event contact details get method
const getEvents = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const eventData = await eventModel.find({});
      res.render("eventList", { title: "Event List", logged: true, user: req.user, csrfToken: req.csrfToken(), event: eventData });
    }
    catch (err) {
      res.status(400).send(err)
      console.log(err);
    }
  } else {
    res.render('eventList', { title: 'eventList', logged: false });
  }
}

module.exports = {
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

};
