// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { encodeImageToBlurhash } from "../../helpers/blurhash";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<NextApiHandler<any>> {

  const blurhash = await encodeImageToBlurhash(req.body.imageUrl);
  console.log({blurhash})

  res.status(200).json({ name: 'John Doe' })
  return
}
