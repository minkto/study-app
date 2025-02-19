import { NextApiRequest, NextApiResponse } from "next";
import { getData } from '../../../src/app/db/getData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const resources = await getData('SELECT Version()');
        res.status(200).json(resources);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error })
    }
}