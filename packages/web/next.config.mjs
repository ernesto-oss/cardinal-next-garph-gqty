/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [ '@acme/config', '@acme/api' ]
};
 
export default config;
