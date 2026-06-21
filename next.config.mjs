/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product art is trusted, local SVG in /public. Allow the optimizer to
    // serve it while sandboxing any embedded scripts.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
