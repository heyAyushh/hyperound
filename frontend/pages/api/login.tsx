// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { withSessionRoute } from "../../lib/withSession";
import { sessionOptions } from "../../lib/session";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
  try {
    const data = req.body;

    const loginResponse = await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_BACKEND}/login/wallet/done`,
      withCredentials: true,
      data
    });

    console.log(loginResponse.data);

    req.session.user = {
      username: loginResponse.data.user.username,
      isCreator: loginResponse.data.user.isCreator,
      avatar: loginResponse.data.user.avatar,
      isLoggedIn: true,
    };

    req.session.token = loginResponse.data.token;
    await req.session.save();

    res.status(200).json({user: loginResponse.data.user});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message
    })
  }

  return
}