// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import { withSessionRoute } from "../../lib/withSession";
import { User } from "./user";

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
      isLoggedin: true,
    } as User;

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