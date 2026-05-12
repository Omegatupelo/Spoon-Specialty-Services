const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// SETTINGS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.YAHOO_APP_PASSWORD
  }
});

// PAGE ROUTES
app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Spoon Specialty Services' });
});

app.get('/about', (req, res) => {
  res.render('about', { pageTitle: 'About Spoon Specialty Services' });
});

app.get('/travel', (req, res) => {
  res.render('travel', { pageTitle: 'Travel Services' });
});

app.get('/webdesign', (req, res) => {
  res.render('webdesign', { pageTitle: 'Web Design' });
});

app.get('/courier', (req, res) => {
  res.render('courier', { pageTitle: 'Courier Services' });
});

app.get('/booking', (req, res) => {
  res.render('booking', { pageTitle: 'Book a Service' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { pageTitle: 'Contact Us' });
});

app.get('/admin', (req, res) => {
  res.render('admin', { pageTitle: 'Admin Dashboard' });
});

app.get('/success', (req, res) => {
  res.render('success', { pageTitle: 'Request Submitted' });
});

app.get('/bookshelf', (req, res) => {
  res.redirect('https://www.prophecyomega.com');
});

// CONTACT FORM
app.post('/contact-request', async (req, res) => {
  const { fullName, email, phone, serviceNeeded, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.BUSINESS_EMAIL,
      replyTo: email,
      to: process.env.BUSINESS_EMAIL,
      subject: `New Contact Request from ${fullName}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Service Needed:</strong> ${serviceNeeded}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.redirect('/success');
  } catch (error) {
    console.error(error);
    res.send('Error sending contact request.');
  }
});

// BOOKING FORM
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

  try {
    await transporter.sendMail({
      from: process.env.BUSINESS_EMAIL,
      replyTo: email,
      to: process.env.BUSINESS_EMAIL,
      subject: `New Booking Request from ${fullName}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate || 'Not provided'}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime || 'Not provided'}</p>
        <p><strong>Details:</strong></p>
        <p>${details}</p>
      `
    });

    res.redirect('/success');
  } catch (error) {
    console.error(error);
    res.send('Error sending booking request.');
  }
});

// COURIER FORM
app.post('/courier-request', async (req, res) => {
  const {
    fullName,
    email,
    phone,
    pickupAddress,
    deliveryAddress,
    packageType,
    pickupDate,
    details
  } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.BUSINESS_EMAIL,
      replyTo: email,
      to: process.env.BUSINESS_EMAIL,
      subject: `New Courier Request from ${fullName}`,
      html: `
        <h2>New Courier Request</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Pickup Address:</strong> ${pickupAddress}</p>
        <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
        <p><strong>Package Type:</strong> ${packageType}</p>
        <p><strong>Pickup Date:</strong> ${pickupDate || 'Not provided'}</p>
        <p><strong>Details:</strong></p>
        <p>${details}</p>
      `
    });

    res.redirect('/success');
  } catch (error) {
    console.error(error);
    res.send('Error sending courier request.');
  }
});

// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});