// payment-service/index.js
import express from "express";
import amqp from "amqplib";

const app = express();
let payments = [];

// Connect to RabbitMQ and listen for payment requests
amqp.connect("amqp://rabbitmq", (err, connection) => {
  if (err) throw err;
  connection.createChannel((err, channel) => {
    if (err) throw err;
    const queue = "paymentQueue";

    channel.assertQueue(queue, { durable: false });
    console.log(" [*] Waiting for messages in", queue);

    channel.consume(
      queue,
      (msg) => {
        const paymentRequest = JSON.parse(msg.content.toString());
        const payment = {
          id: payments.length + 1,
          orderId: paymentRequest.orderId,
          amount: paymentRequest.amount,
        };
        payments.push(payment);

        console.log(" [x] Processed payment:", paymentRequest);
      },
      { noAck: true }
    );
  });
});

app.listen(3003, () => console.log("Payment service running on port 3003"));
