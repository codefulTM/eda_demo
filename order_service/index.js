const express = require('express');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Cho phép frontend gọi API

const kafka = new Kafka({ clientId: 'order-service', brokers: ['localhost:9092'] });
const producer = kafka.producer();

app.post('/order', async (req, res) => {
  const { customer, pizza } = req.body;
  const orderId = uuidv4();

  await producer.connect();
  await producer.send({
    topic: 'order_events',
    messages: [
      {
        key: orderId,
        value: JSON.stringify({
          type: 'order_created',
          orderId,
          customer,
          pizza,
        }),
      },
    ],
  });
  await producer.disconnect();

  console.log(`📝 Order created: ${orderId}`);
  res.json({ orderId });
});

app.listen(4000, () => console.log('🧾 Order service on http://localhost:4000'));
