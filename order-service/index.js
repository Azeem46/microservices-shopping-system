// order-service/index.js
import express from "express";
import bodyParser from "body-parser";
import amqp from "amqplib";

const app = express();
app.use(bodyParser.json());

let orders = [];

// Place an order and send payment request via RabbitMQ
app.post("/orders", (req, res) => {
  const { productId, quantity, amount } = req.body;
  const order = { id: orders.length + 1, productId, quantity, amount };
  orders.push(order);

  // Connect to RabbitMQ and send the payment message
  amqp.connect("amqp://rabbitmq", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      const queue = "paymentQueue";
      const message = JSON.stringify({ orderId: order.id, amount });

      channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(message));

      console.log(" [x] Sent payment request:", message);
      res.json({ message: "Order placed and payment request sent", order });
    });
  });
});

app.listen(3002, () => console.log("Order service running on port 3002"));
