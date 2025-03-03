import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3001';
const TEST_ROOM_ID = process.argv[2]; // Pass room ID as command line argument
const TOKEN = process.argv[3]; // Pass token as command line argument
const WEBSITE_ID = process.argv[4]; // Pass website ID as command line argument

if (!TEST_ROOM_ID || !TOKEN || !WEBSITE_ID) {
  console.error('Usage: ts-node chat-messages.ts <roomId> <token> <websiteId>');
  process.exit(1);
}

async function testChatMessages() {
  try {
    console.log(`Testing GET /chat/messages/${TEST_ROOM_ID}`);
    
    const response = await fetch(`${API_URL}/chat/messages/${TEST_ROOM_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'x-website-id': WEBSITE_ID
      }
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error testing chat messages endpoint:', error);
    throw error;
  }
}

testChatMessages()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err)); 