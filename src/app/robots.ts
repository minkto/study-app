import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {

    const isProd = process.env.NODE_ENV === "production";

    if (isProd) {
        return {
            rules: {
                userAgent: '*',
                allow: ['/sign-in', '/sign-up'],
                disallow: '/',
            },
        }
    }

    return {
        rules: {
            userAgent: '*',
            disallow: '/',
        },
    }
}