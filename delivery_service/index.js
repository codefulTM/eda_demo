const { Kafka } = require('kafkajs');

const kafka = new Kafka({ clientId: 'delivery-service', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'delivery-group' });
const producer = kafka.producer();

const run = async () => {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: 'order_events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      if (data.type === 'pizza_prepared') {
        console.log(`🚚 Bắt đầu giao đơn ${data.orderId}`);

        setTimeout(async () => {
          await producer.send({
            topic: 'order_events',
            messages: [
              {
                key: data.orderId,
                value: JSON.stringify({
                  type: 'pizza_delivered',
                  orderId: data.orderId,
                  customer: data.customer,
                  pizza: data.pizza,
                }),
              },
            ],
          });
          console.log(`🏁 Pizza delivered for ${data.orderId}`);
        }, 5000);
      }
    },
  });
};

run().catch(console.error);
