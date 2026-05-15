// ===============================
// Spoon Specialty Services LLC
// Full server.js
// ===============================

require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const session = require("express-session");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// ===============================
// App Configuration
// ===============================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "spoonSecretSession",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// ===============================
// Global Variables
// ===============================

app.use((req, res, next) => {
  res.locals.pageTitle = "Spoon Specialty Services";
  next();
});

// ===============================
// Email Transporter
// ===============================

const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================
// Routes
// ===============================

// HOME
app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Home",
  });
});

// ABOUT
app.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "About",
  });
});

// TRAVEL
app.get("/travel", (req, res) => {
  res.render("travel", {
    pageTitle: "Travel",
  });
});

// WEB DESIGN
app.get("/webdesign", (req, res) => {
  res.render("webdesign", {
    pageTitle: "Web Design",
  });
});

// COURIER
app.get("/courier", (req, res) => {
  res.render("courier", {
    pageTitle: "Courier Services",
  });
});

// BOOKING
app.get("/booking", (req, res) => {
  res.render("booking", {
    pageTitle: "Booking",
  });
});

// CONTACT
app.get("/contact", (req, res) => {
  res.render("contact", {
    pageTitle: "Contact",
  });
});

// BOOKSHELF
app.get("/bookshelf", (req, res) => {
  res.render("bookshelf", {
    pageTitle: "Bookshelf",
  });
});

// PAYMENT PAGE
app.get("/payment", (req, res) => {
  res.render("payment", {
    pageTitle: "Make Payment",
  });
});

// SUCCESS PAGE
app.get("/success", (req, res) => {
  res.render("success", {
    pageTitle: "Payment Successful",
  });
});

// ===============================
// CONTACT FORM
// ===============================

app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Website Contact Form",
      html: `
        <h2>New Contact Submission</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.redirect("/success");
  } catch (error) {
    console.error(error);
    res.send("Error sending form.");
  }
});

// ===============================
// STRIPE PAYMENT
// ===============================

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { service, amount } = req.body;

    const amountInCents = Math.round(Number(amount) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: service,
            },

            unit_amount: amountInCents,
          },

          quantity: 1,
        },
      ],

      success_url:
        "https://www.spoonspecialtyservices.com/success",

      cancel_url:
        "https://www.spoonspecialtyservices.com/payment",
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error(error);
    res.send("Stripe payment failed.");
  }
});

// ===============================
// Travel Redirect
// ===============================

app.get("/travel-site", (req, res) => {
  res.redirect(
    "https://spoonspecialtyservices.cruisebrothers.com/"
  );
});

// ===============================
// PORT
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});