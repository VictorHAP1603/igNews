import { NextApiRequest, NextApiResponse } from "next";

export default function Users(req: NextApiRequest, res: NextApiResponse) {
  const users = [
    { id: 1, name: "Diego" },
    { id: 2, name: "Alana" },
    { id: 3, name: "Mayky" },
  ];

  return res.json(users);
}
