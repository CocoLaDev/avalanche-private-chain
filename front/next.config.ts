/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.mon-diplome.fr",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "as2.ftcdn.net",
            },{
                protocol: "https",
                hostname: "example.com",
            },
            {
                protocol: "https",
                hostname: "rose-elderly-jaguar-692.mypinata.cloud",
            },
        ],
    },
};

module.exports = nextConfig;
