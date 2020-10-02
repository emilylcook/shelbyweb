const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("request-promise-native");
const crypto = require("crypto");

const squareConnect = require("square-connect");

const buildReceipt = require("./receiptTemplate");

const app = express();
app.use(bodyParser.json());

var corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigin = functions.config().allowedOrigin;
    if (allowedOrigin === origin || !origin) {
      callback(null, true);
    } else {
      console.log("ORIGIN NOT ALLOWED:" + origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications["oauth2"];
oauth2.accessToken = functions.config().sandbox.squareaccesstoken;

// Set 'basePath' to switch between sandbox env and production env
// sandbox: https://connect.squareupsandbox.com
// production: https://connect.squareup.com

// SANDBOX
defaultClient.basePath = "https://connect.squareupsandbox.com";

// PRODUCTION
// defaultClient.basePath = "https://connect.squareup.com";

app.post("/checkout/", async function (req, res, next) {
  const {
    email,
    shippingContact: shipping_address,
    billingContact: billing_address,
    currencyCode,
    countryCode,
    total,
    lineItems,
    nonce,
  } = req.body;

  // const request_params = req.body;

  // length of idempotency_key should be less than 45
  const idempotency_key = crypto.randomBytes(22).toString("hex");

  // Charge the customer's card
  const payments_api = new squareConnect.PaymentsApi();

  const totalInCents = parseInt((total * 100).toFixed(0));

  const request_body = {
    source_id: nonce,
    billing_address,
    buyer_email_address: email,
    amount_money: {
      amount: totalInCents,
      currency: "USD",
    },
    idempotency_key: idempotency_key,
  };

  try {
    const response = await payments_api.createPayment(request_body);

    // TODO handle not success? if card is declined? etc.
    console.log("PAYMENT RESPONSE", response);

    // if fail we need to do not continue, obviously

    let last_four = "";
    let receipt_number = "";

    if (
      response &&
      response.payment &&
      response.payment.card_details &&
      response.payment.card_details.card
    ) {
      last_four = response.payment.card_details.card.last_4;
      receipt_number = response.payment.receipt_number;
    }

    const mailBody = buildReceipt({
      lineItems,
      total,
      shipping_address,
      billing_address,
      last_four: last_four,
      receipt_number: receipt_number,
    });

    // send to user and shelby
    const mailOptions = {
      to: "emilycookx@gmail.com",
      cc: "shelbykcook.art@gmail.com",
      from: "no-reply@myemail.com",
      subject: `Receipt from shelbykcook.art`,
      text: JSON.stringify(mailBody),
      html: mailBody,
    };

    var sesAccessKey = functions.config().api.email;
    var sesSecretKey = functions.config().api.password;

    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: sesAccessKey,
          pass: sesSecretKey,
        },
      })
    );

    transporter.sendMail(mailOptions, function (error, info) {
      console.log("errorEmail", error);
      console.log("errorInfo", info);
    });

    return res.status(200).send({
      message: "Payment Successful",
      orderNumber: response.payment.receipt_number,
    });
  } catch (error) {
    console.log("-----ERROR1------");
    console.log(error.response.text);

    let errorCode = -1;
    at;
    try {
      const errorJson = JSON.parse(error.response.text);
      errorCode = errorJson.errors[0].code;
    } catch (e) {}

    let errorMessage = "Unable to complete order";
    switch (errorCode) {
      case "CARD_TOKEN_USED":
        errorMessage = "Unable to complete payment";
        break;
      case "CVV_FAILURE":
        errorMessage = "Invalid CVV number";
        break;
      case "ADDRESS_VERIFICATION_FAILURE":
        errorMessage = "Invalid billing address";
        break;
      case "INVALID_EXPIRATION":
        errorMessage = "Invalid expiration";
        break;
      case "GENERIC_DECLINE":
        errorMessage = "Card was declined";
        break;
      default:
        errorMessage = "Unable to complete payment";
    }

    return res.status(400).send({
      message: errorMessage,
    });
  }
});

app.post("/signup/", async function (req, res, next) {
  const { email } = req.body;
  const LIST_ID = functions.config().mailchimp.listid;
  const ACCESS_TOKEN = functions.config().mailchimp.access_token;
  const BASE_URL = functions.config().mailchimp.base_url;

  const authRequest = request.defaults({
    headers: {
      "User-Agent": "workplace_app",
      Authorization: `Basic ${ACCESS_TOKEN}`,
    },
    json: true,
  });

  const body = {
    email_address: email,
    status: "subscribed",
  };

  const options = {
    method: "POST",
    uri: `${BASE_URL}/lists/${LIST_ID}/members`,
    body,
  };

  try {
    await authRequest(options);
    return res.status(200).send({
      message: "Subscribed to newsletter!",
    });
  } catch (e) {
    console.error("Error from mailchimp API:");
    console.error(e.error);

    if (e.error.title === "Member Exists") {
      return res.status(200).send({
        message: "Email is already subscribed.",
      });
    }

    return res.status(500).send({
      message: e.message,
    });
  }
});

app.post("/sendEmail/", function (req, res, next) {
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
        pass: sesSecretKey,
      },
    })
  );

  const mailOptions = {
    // to: "emilycookx@gmail.com",
    to: "shelbykcook.art@gmail.com",
    from: "no-reply@myemail.com",
    subject: `Shelbywebcommission: ${name} sent you a new message`,
    text: text,
    html: text,
  };

  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
      return res.status(500).send({
        message: error.message,
      });
    }
    return res.status(200).send({
      message: "success",
    });
  });
});

module.exports = app;
