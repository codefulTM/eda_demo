const { Kafka } = require('kafkajs');

// const kafka = new Kafka({ clientId: 'kitchen-service', brokers: ['localhost:9092'] });
const kafka = new Kafka({ clientId: 'kitchen-service', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'kitchen-group' });
const producer = kafka.producer();

const run = async () => {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: 'order_events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      if (data.type === 'order_created') {
        console.log(`👨‍🍳 Bắt đầu nấu pizza cho đơn ${data.orderId}`);

        setTimeout(async () => {
          await producer.send({
            topic: 'order_events',
            messages: [
              {
                key: data.orderId,
                value: JSON.stringify({
                  type: 'pizza_prepared',
                  orderId: data.orderId,
                  customer: data.customer,
                  pizza: data.pizza,
                }),
              },
            ],
          });
          console.log(`✅ Pizza prepared for ${data.orderId}`);
        }, 5000);
      }
    },
  });
};

run().catch(console.error);
