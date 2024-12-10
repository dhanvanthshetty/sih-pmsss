const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'pmsss',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'pmsss-group' });

module.exports = { producer, consumer };
