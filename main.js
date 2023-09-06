const WebSocket = require('ws');
const axios = require('axios');

const TWITCH_API_URL = 'https://api.twitch.tv/helix';
const TWITCH_PUBSUB_URL = 'wss://pubsub-edge.twitch.tv';

const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
const oauthToken = 'o3i0jxyknxs84ngoxj7c31jrs9ghiv'; // Get this token with the "chat:read" and "chat:edit" scopes

// Function to authenticate and get the user ID
async function getTwitchUserId(username) {
  try {
    const response = await axios.get(`${TWITCH_API_URL}/users`, {
      params: { login: username },
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${oauthToken}`,
      },
    });

    if (response.data.data.length > 0) {
      return response.data.data[0].id;
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }
  return null;
}

// Function to connect to Twitch PubSub
function connectToTwitchPubSub(userId) {
  const ws = new WebSocket(TWITCH_PUBSUB_URL);

  ws.on('open', () => {
    console.log('Connected to Twitch PubSub');
    ws.send(JSON.stringify({
      type: 'LISTEN',
      data: {
        topics: [`channel-bits-events-v2.${userId}`], // Example topic, you can add more topics here
        auth_token: oauthToken,
      },
    }));
  });

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('Received message:', message);
  });

  ws.on('close', () => {
    console.log('Disconnected from Twitch PubSub');
  });
}

async function main() {
  const username = 'linktijger'; // Replace with your Twitch username
  const userId = await getTwitchUserId(username);
  if (userId) {
    connectToTwitchPubSub(userId);
  } else {
    console.error('Failed to fetch Twitch user ID.');
  }
}

main();
