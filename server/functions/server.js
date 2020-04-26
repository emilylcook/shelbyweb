const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("request-promise-native");

const app = express();
app.use(bodyParser.json());

var corsOptions = {
  origin: function(origin, callback) {
    if ("https://shelbykcook.com" === origin || !origin) {
      // if ("http://localhost:3000" === origin || !origin) {
      callback(null, true);
    } else {
      console.log("ORIGIN NOT ALLOWED:" + origin);
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));

app.post("/signup/", async function(req, res, next) {
  const { email } = req.body;
  const LIST_ID = functions.config().mailchimp.listid;
  const ACCESS_TOKEN = functions.config().mailchimp.access_token;
  const BASE_URL = functions.config().mailchimp.base_url;

  const authRequest = request.defaults({
    headers: {
      "User-Agent": "workplace_app",
      Authorization: `Basic ${ACCESS_TOKEN}`
    },
    json: true
  });

  const body = {
    email_address: email,
    status: "subscribed"
  };

  const options = {
    method: "POST",
    uri: `${BASE_URL}/lists/${LIST_ID}/members`,
    body
  };

  try {
    await authRequest(options);
    return res.status(200).send({
      message: "Subscribed to newsletter!"
    });
  } catch (e) {
    console.error("Error from mailchimp API:");
    console.error(e.error);

    if (e.error.title === "Member Exists") {
      return res.status(200).send({
        message: "Email is already subscribed."
      });
    }

    return res.status(500).send({
      message: e.message
    });
  }
});

app.post("/sendEmail/", function(req, res, next) {
  const { name, email, paintingSize, inspiration, questions } = req.body;

  var text = `<div>
      <h4>Information</h4>
      <ul>
        <li>
          Name - ${name || ""}
        </li>
        <li>
          Email - ${email || ""}
        </li>
        <li>
          Desired Painting Size - ${paintingSize || ""}
        </li>
      </ul>
      <h4>Inspiration</h4>
      <p>${inspiration || ""}</p>

      <h4>Questions</h4>
      <p>${questions || ""}</p>
    </div>`;

  var sesAccessKey = functions.config().api.email;
  var sesSecretKey = functions.config().api.password;

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: sesAccessKey,
        pass: sesSecretKey
      }
    })
  );

  const mailOptions = {
    // to: "emilycookx@gmail.com",
    to: "shelbykcook.art@gmail.com",
    from: "no-reply@myemail.com",
    subject: `Shelbywebcommission: ${name} sent you a new message`,
    text: text,
    html: text
  };

  return transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error.message);
      return res.status(500).send({
        message: error.message
      });
    }
    return res.status(200).send({
      message: "success"
    });
  });
});

module.exports = app;
