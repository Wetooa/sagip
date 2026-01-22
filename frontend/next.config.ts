import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const apiOrigin = new URL(apiBase).origin;

    return {
      beforeFiles: [
        {
          source: "/static/:path*",
          destination: `${apiOrigin}/static/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
