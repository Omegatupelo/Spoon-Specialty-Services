const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

// ======================
// SETTINGS
// ======================

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ======================
// EMAIL SETUP
// ======================

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  secure: true,

  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.YAHOO_APP_PASSWORD
  }
});

// ======================
// ROUTES
// ======================

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/travel', (req, res) => {
  res.render('travel');
});

app.get('/webdesign', (req, res) => {
  res.render('webdesign');
});

app.get('/courier', (req, res) => {
  res.render('courier');
});

app.get('/bookshelf', (req, res) => {
  res.redirect('https://www.prophecyomega.com');
});

// ======================
// COURIER FORM
// ======================

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

      subject: 'New Courier Request',

      html: `
        <h2>New Courier Request</h2>

        <p><strong>Name:</strong> ${fullName}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Phone:</strong> ${phone}</p>

        <p><strong>Pickup Address:</strong> ${pickupAddress}</p>

        <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>

        <p><strong>Package Type:</strong> ${packageType}</p>

        <p><strong>Pickup Date:</strong> ${pickupDate}</p>

        <p><strong>Details:</strong> ${details}</p>
      `
    });

    res.send(`
      <h1 style="font-family: Arial; text-align:center; margin-top:100px;">
        Courier Request Submitted Successfully
      </h1>

      <p style="text-align:center;">
        Spoon Specialty Services will contact you soon.
      </p>
    `);

  } catch (error) {

    console.log(error);

    res.send('Error sending request.');

  }

});

// ======================
// SERVER
// ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});