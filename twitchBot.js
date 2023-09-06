const TES = require('tesjs');

const clientId = '8p069a6yd66co1xpzq2pmhrx0ykqxx';
const accessToken = 'qvm3ppobyhetixo1zekobk1g31tqy8';
const secret = '5ekqpxnnkg84q821r3m4ji2cbvrlvt';

// initialize TESjs
const tes = new TES({
    identity: {
        id: clientId,
        secret: secret,
    },
    listener: {
        type: "webhook",
        baseURL: "https://hook-custom-hypetrain.vercell.app",
        secret: '2wDENZMxh8b2GG0GW7J8',
    }
});

// define an event handler for the `channel.update` event
// NOTES: 
//   this handles ALL events of that type
//   events will not be fired until there is a subscription made for them
tes.on("channel.update", (event) => {
    console.log(`${event.broadcaster_user_name}'s new title is ${event.title}`);
});

// create a new subscription for the `channel.update` event for broadcaster "1337"
tes.subscribe("channel.update", { broadcaster_user_id: "1337" })
    .then(() => {
        console.log("Subscription successful");
    }).catch(err => {
        console.log(err);
    });