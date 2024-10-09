// import Stripe from "stripe";
// const stripe = new Stripe(
//   "sk_test_51Q3WDVRo7iossoEVhaKcRmTp9xsWMvkqlu1Z6E7kzLavIGD3dq5kVcrIwm73WdUhCLNepb3LUzFt0Eh5fM3IDAb700Qkl8nyPP"
// );

// // Importing Express and creating an app instance
// import express from "express";
// // const app = express();

// // Serving static files from the 'public' directory
// // app.use(express.static('public'));

// // Define the domain where your app is running
// const YOUR_DOMAIN = "http://localhost:5173";

// const router = express.Router();

// // Route to create a checkout session
// router.post("/create-checkout-session", async (req, res) => {
//   const customer = await stripe.customers.create({
//     metadata: {
//       userId: req.body.userId,
//       cart: JSON.stringify(req.body.cartItems),
//     },
//   });

//   const line_items = req.body.items.map((item) => {
//     return {
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.mealId.name,
//           images: [item.mealId.imageUrl],
//           description: item.mealId.description,
//           metadata: {
//             id: item.mealId._id,
//           },
//         },
//         unit_amount: item.mealId.price * 100,
//       },
//       quantity: item.quantity,
//     };
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items,
//     phone_number_collection: {
//       enabled: true,
//     },
//     customer: customer.id,

//     mode: "payment",
//     success_url: `${YOUR_DOMAIN}/success-true`,
//     cancel_url: `${YOUR_DOMAIN}/canceled-true`,
//   });

//   // console.log("ascdacwefwefw", customer);
//   res.send({ url: session.url }); // Redirect to the checkout session URL
// });

// router.post(
//   "/webhook",
//   express.json({ type: "application/json" }),
//   async (req, res) => {
//     let data;
//     let eventType;

//     // Check if webhook signing is configured.
//     let webhookSecret;
//     webhookSecret =
//       "whsec_7e8ea00c19c84e59c2298289c40ffc56646f6e65bbc4249c391cb866368df497";

//     if (webhookSecret) {
//       // Retrieve the event by verifying the signature using the raw body and secret.
//       let event;
//       let signature = req.headers["stripe-signature"];

//       try {
//         event = stripe.webhooks.constructEvent(
//           req.body,
//           signature,
//           webhookSecret
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed:  ${err}`);
//         return res.sendStatus(400);
//       }
//       // Extract the object from the event.
//       data = event.data.object;
//       eventType = event.type;
//     } else {
//       // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//       // retrieve the event data directly from the request body.
//       data = req.body.data.object;
//       eventType = req.body.type;
//     }

//     // Handle the checkout.session.completed event
//     if (eventType === "checkout.session.completed") {
//       stripe.customers
//         .retrieve(data.customer)
//         .then(async (customer) => {
//           console.log(customer);
//           console.log("data:", data);
//           // try {
//           //   // CREATE ORDER
//           //   createOrder(customer, data);
//           // } catch (err) {
//           //   console.log(typeof createOrder);
//           //   console.log(err);
//           // }
//         })
//         .catch((err) => console.log(err.message));
//     }

//     res.status(200).end();
//   }
// );
// export default router;
import Stripe from "stripe";
import express from "express";
import bodyParser from "body-parser";
import orderModel from "../models/Order.js";

const stripe = new Stripe(
  "sk_test_51Q3WDVRo7iossoEVhaKcRmTp9xsWMvkqlu1Z6E7kzLavIGD3dq5kVcrIwm73WdUhCLNepb3LUzFt0Eh5fM3IDAb700Qkl8nyPP"
);

// Define the domain where your app is running
const YOUR_DOMAIN = "http://localhost:5173";

const router = express.Router();
router.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
); // Route to create a checkout session

let cart = [];

router.post("/create-checkout-session", async (req, res) => {
  console.log("Aafa", req.body.items);

  cart = req.body.items;
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      // cart: JSON.stringify(req.body.items), // storing cart details in metadata
    },
  });

  const line_items = req.body.items.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.mealId.name,
          images: [item.mealId.imageUrl],
          description: item.mealId.description,
        },
        unit_amount: item.mealId.price * 100, // convert price to cents
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    phone_number_collection: {
      enabled: true,
    },

    shipping_address_collection: {
      allowed_countries: ["US", "CA", "KE", "EG"],
    },

    customer: customer.id, // attaching the customer to the session
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success-true`,
    cancel_url: `${YOUR_DOMAIN}/canceled-true`,
  });

  res.send({ url: session.url }); // Redirect to the checkout session URL
});

const createOrder = async (customer, data) => {
  // const Items = JSON.parse(cart);

  const products = cart.map((item) => {
    return {
      mealId: item.mealId._id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    };
  });

  const newOrder = new orderModel({
    userId: customer.metadata.userId,
    // customerId: data.customer,
    // customerName: String,
    customerName: data.customer_details.name,
    mealItems: products,
    totalPrice: data.amount_total,
    shippingDetails: {
      phone: customer.phone,

      address: data.shipping_details.address,
    },
    paymentStatus: data.payment_status,

    // userId: customer.metadata.userId,
    // paymentIntentId: data.payment_intent,
    // products,
    // subtotal: data.amount_subtotal,
    // total: data.amount_total,
    // shipping: data.customer_details,
    // payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

// Webhook handler for Stripe
router.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
);
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), // Using raw body parser for webhook signature verification
  async (req, res) => {
    let data;
    let eventType;

    const webhookSecret =
      "whsec_7e8ea00c19c84e59c2298289c40ffc56646f6e65bbc4249c391cb866368df497"; // Your webhook secret
    const signature = req.headers["stripe-signature"];

    try {
      // Verifying the event using the raw body and Stripe signature
      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret
      );
      data = event.data.object;
      eventType = event.type;
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err.message}`);
      return res.sendStatus(400);
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          console.log("Customer:", customer);
          console.log("Session Data:", data);
          createOrder(customer, data);
          // Here, you can create the order in your database using customer and session data
          // Example: createOrder(customer, data);
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end(); // Respond to Stripe
  }
);

export default router;
