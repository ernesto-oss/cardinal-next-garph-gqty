/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@acme/config", "@acme/api", "@acme/auth", "@acme/database"],
};

export default config;
