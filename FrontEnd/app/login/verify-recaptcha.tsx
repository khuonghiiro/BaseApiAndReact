// pages/api/verify-recaptcha.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export async function verifyRecaptcha(token: string) {
    const secretKey = '6LdTOOspAAAAAJSBiRx1aNv97Pf1k5xd7AUyStKJ';
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
        method: 'POST'
    });

    const data = await response.json();

    return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;
    const result = await verifyRecaptcha(token);
    res.status(200).json(result);
}