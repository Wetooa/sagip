"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Detect device type based on screen width
    const isMobile = window.innerWidth < 768;
    
    // Redirect to appropriate route
    if (isMobile) {
      router.push("/mobile");
    } else {
      router.push("/desktop");
    }
  }, [router]);

  // Show loading state while redirecting
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return null;
}
