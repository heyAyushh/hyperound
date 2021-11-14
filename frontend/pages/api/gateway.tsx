// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/withSession";

export default withSessionRoute(gateway);

async function gateway(req: NextApiRequest, res: NextApiResponse) {

  const { isLoggedin, } = req.session.user;
  const token = req.session.token;

  if (!isLoggedin || !token) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const data = await fetch(`${process.env?.NEXT_PUBLIC_BACKEND}/${req.body?.url}`, {
      method: req.body?.method,
      body: req.body?.body,
      // query: req.body?.query,
      // params: req.body?.params as RequestInit['params'],
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }




  return
}
