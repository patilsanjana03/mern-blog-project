const redis = require('redis');

// In development, this connects to localhost:6379 by default
// In production, you would pass your cloud Redis URL (like Upstash or AWS ElastiCache)
const client = redis.createClient({
    url: process.env.REDIS_URL 
});

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('  Redis Connected Successfully'));

// Connect immediately
//client.connect();

module.exports = client;