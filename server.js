const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();


// =============================
// APP SETTINGS
// =============================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// =============================
// EMAIL TRANSPORTER
// =============================

const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.YAHOO_APP_PASSWORD
  }
});


// =============================
// ROUTES
// =============================


// HOME
app.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'Spoon Specialty Services'
  });
});


// ABOUT
app.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About Us'
  });
});


// TRAVEL
app.get('/travel', (req, res) => {
  res.render('travel', {
    pageTitle: 'Travel Services'
  });
});


// WEB DESIGN
app.get('/webdesign', (req, res) => {
  res.render('webdesign', {
    pageTitle: 'Web Design'
  });
});


// COURIER
app.get('/courier', (req, res) => {
  res.render('courier', {
    pageTitle: 'Courier Services'
  });
});


// CONTACT
app.get('/contact', (req, res) => {
  res.render('contact', {
    pageTitle: 'Contact Us'
  });
});


// BOOKING
app.get('/booking', (req, res) => {
  res.render('booking', {
    pageTitle: 'Book a Service'
  });
});


// ADMIN
app.get('/admin', (req, res) => {
  res.render('admin', {
    pageTitle: 'Admin Dashboard'
  });
});


// BOOKSHELF REDIRECT
app.get('/bookshelf', (req, res) => {
  res.redirect('https://www.prophecyomega.com');
});


// SUCCESS PAGE
app.get('/success', (req, res) => {
  res.render('success', {
    pageTitle: 'Success'
  });
});


// =============================
// CONTACT FORM SUBMISSION
// =============================

app.post('/contact-request', async (req, res) => {

  const {
    fullName,
    email,
    phone,
    serviceNeeded,
    message
  } = req.body;

  const mailOptions = {
    from: process.env.BUSINESS_EMAIL,
    to: process.env.BUSINESS_EMAIL,
    subject: `New Contact Request from ${fullName}`,
    html: `
      <h2>New Contact Request</h2>

      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service Needed:</strong> ${serviceNeeded}</p>

      <h3>Message</h3>
      <p>${message}</p>
    `
  };

  try {

    await transporter.sendMail(mailOptions);

    res.redirect('/success');

  } catch (error) {

    console.log(error);

    res.send('Error sending contact request.');

  }

});


// =============================
// BOOKING FORM SUBMISSION
// =============================

app.post('/booking-request', async (req, res) => {

  const {
    fullName,
    email,
    phone,
    serviceType,
    preferredDate,
    preferredTime,
    details
  } = req.body;

  const mailOptions = {
    from: process.env.BUSINESS_EMAIL,
    to: process.env.BUSINESS_EMAIL,
    subject: `New Booking Request from ${fullName}`,
    html: `
      <h2>New Booking Request</h2>

      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>

      <p><strong>Service Type:</strong> ${serviceType}</p>

      <p><strong>Preferred Date:</strong> ${preferredDate}</p>

      <p><strong>Preferred Time:</strong> ${preferredTime}</p>

      <h3>Details</h3>

      <p>${details}</p>
    `
  };

  try {

    await transporter.sendMail(mailOptions);

    res.redirect('/success');

  } catch (error) {

    console.log(error);

    res.send('Error sending booking request.');

  }

});


// =============================
// COURIER FORM SUBMISSION
// =============================

app.post('/courier-request', async (req, res) => {

  const {
    fullName,
    email,
    phone,
    pickupAddress,
    deliveryAddress,
    deliveryType,
    pickupDate,
    notes
  } = req.body;

  const mailOptions = {
    from: process.env.BUSINESS_EMAIL,
    to: process.env.BUSINESS_EMAIL,
    subject: `New Courier Request from ${fullName}`,
    html: `
      <h2>New Courier Request</h2>

      <p><strong>Name:</strong> ${fullName}</p>

      <p><strong>Email:</strong> ${email}</p>

      <p><strong>Phone:</strong> ${phone}</p>

      <p><strong>Pickup Address:</strong> ${pickupAddress}</p>

      <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>

      <p><strong>Delivery Type:</strong> ${deliveryType}</p>

      <p><strong>Pickup Date:</strong> ${pickupDate}</p>

      <h3>Delivery Notes</h3>

      <p>${notes}</p>
    `
  };

  try {

    await transporter.sendMail(mailOptions);

    res.redirect('/success');

  } catch (error) {

    console.log(error);

    res.send('Error sending courier request.');

  }

});


// =============================
// SERVER
// =============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});