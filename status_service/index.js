const { Kafka } = require('kafkajs');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const kafka = new Kafka({ clientId: 'status-service', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'status-group' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let sockets = [];

wss.on('connection', (ws) => {
  sockets.push(ws);
  ws.on('close', () => {
    sockets = sockets.filter(s => s !== ws);
  });
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order_events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = message.value.toString();
      sockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(event);
        }
      });
    },
  });
};

run().catch(console.error);

server.listen(5000, () => {
  console.log('📡 Status WebSocket on ws://localhost:5000');
});
