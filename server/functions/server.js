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
    // if ("https://shelbykcook.com" === origin || !origin) {
    if ("http://localhost:3000" === origin || !origin) {
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

  console.log("-----", totalInCents);
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

  console.log("-----------");
  console.log(request_body);

  try {
    const response = await payments_api.createPayment(request_body);

    // TODO handle not success? if card is declined? etc.

    console.log("response", response);
    const mailBody = buildReceipt({
      lineItems,
      total,
      shipping_address,
      billing_address,
      last_four: response?.payment?.card_details?.card?.last_4,
      receipt_number: response?.payment?.receipt_number,
    });

    // send to user and shelby
    const mailOptions = {
      to: "emilycookx@gmail.com",
      cc: "shelbykcook.art@gmail.com",
      from: "no-reply@myemail.com",
      subject: `PURCHASE`,
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

    // TODO put this at end
    transporter.sendMail(mailOptions, function (error, info) {
      console.log("errorEmail", error);
      console.log("errorInfo", info);
    });

    return res.status(200).send({
      message: "Payment Successful",
      orderNumber: response.payment.receipt_number,
    });
  } catch (error) {
    console.log(error);
    console.log("error", error.response?.text);

    return res.status(500).send({
      message: error,
    });

    // res.render("process-payment", {
    //   title: "Payment Failure",
    //   result: error.response.text,
    // });
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
