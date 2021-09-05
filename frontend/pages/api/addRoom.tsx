import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";

const app_access_key = '61346f5863a19c8f26df36e8';
const app_secret = '0l7qNMawVCt0kOL8oblpWtpKvQWYFZtTqaF7UVde0C3a2BPBqH53aqijEg-phQFXSTnG4clHqkvXIVd1mizM3o5MtaYpKiXOl3BTj9-dkQgQL7DqByfRaaoY2ESyEKp5Ps1osSFmKR7XaqBk9lWyPna03cVLz9x8bgs-PQgHBxo=';

export default function handler(req: NextApiRequest, res: NextApiResponse): NextApiHandler {
  if (req.method === 'POST') {
    jwt.sign(
      {
        access_key: app_access_key,
        type: 'management',
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000)
      },
      app_secret,
      {
        algorithm: 'HS256',
        expiresIn: '24h',
        jwtid: uuid4()
      },
      async function (err, token) {
        const room_id = await createRoom(token);
        res.status(200).json({
          room_id
        })
      }
    );
  } else {
    res.status(400).json({
      msg: "wrong method"
    })
  }
  return
}

const createRoom = async (management_token) => {
  try {
    const response = await fetch("https://prod-in2.100ms.live/api/v2/rooms", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${management_token}`
      },
      body: JSON.stringify({
        name: "new_room",
        template: "web_createown_5198e0fc-8bf0-44a5-984c-b7dcd1347455"
      })
    });

    const data = await response.json();
    console.log(data, data.id);
    return data.id;
  } catch (e) {
    return e
  }
}