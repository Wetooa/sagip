This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## User Location Management

This application uses a frontend-driven approach for managing user location, storing it in localStorage for offline support and quick access.

### localStorage Structure

User location is stored in localStorage with the following structure:

```typescript
interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: string; // ISO timestamp
  accuracy?: number;
  source?: 'gps' | 'manual' | 'backend';
}
```

### Implementation Flow

1. **On App Load:**
   - Fetch user's last location from backend: `GET /api/shared/routing/user-location?citizen_id={id}`
   - Or use existing endpoint: `GET /api/shared/location/history/last?citizen_id={id}`
   - Store location in localStorage:
     ```typescript
     localStorage.setItem('userLocation', JSON.stringify({
       latitude: location.latitude,
       longitude: location.longitude,
       timestamp: location.timestamp,
       accuracy: location.accuracy,
       source: 'backend'
     }));
     ```
   - Update UI with current location

2. **When Requesting Routes:**
   - Read location from localStorage:
     ```typescript
     const location = JSON.parse(localStorage.getItem('userLocation') || '{}');
     ```
   - Call routing endpoints with coordinates:
     ```typescript
     // Find nearest evacuation center
     const route = await fetch(
       `/api/shared/routing/nearest-evacuation-center?latitude=${location.latitude}&longitude=${location.longitude}&vehicle_type=driving`
     );
     
     // Get route to specific center
     const route = await fetch(
       `/api/shared/routing/route?latitude=${location.latitude}&longitude=${location.longitude}&evacuation_center_id=${centerId}&vehicle_type=driving`
     );
     ```

3. **Location Updates:**
   - Update localStorage when:
     - User manually sets location
     - GPS updates location
     - Location history is fetched from backend
   - Always update the `timestamp` and `source` fields when updating

### Benefits

- Works offline (if location is cached)
- Frontend has full control over location management
- Supports multiple location sources (GPS, manual, backend)
- No authentication required for routing endpoints
- Simple backend API - just accepts coordinates

### Example Implementation

```typescript
// On app initialization
async function initializeUserLocation(userId: string) {
  try {
    const response = await fetch(`/api/shared/routing/user-location?citizen_id=${userId}`);
    const location = await response.json();
    
    localStorage.setItem('userLocation', JSON.stringify({
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp,
      accuracy: location.accuracy,
      source: 'backend'
    }));
  } catch (error) {
    console.error('Failed to fetch user location:', error);
    // Fallback to GPS or manual input
  }
}

// When requesting evacuation route
function getNearestEvacuationCenter(vehicleType: string = 'driving') {
  const location = JSON.parse(localStorage.getItem('userLocation') || '{}');
  
  if (!location.latitude || !location.longitude) {
    throw new Error('User location not available');
  }
  
  return fetch(
    `/api/shared/routing/nearest-evacuation-center?latitude=${location.latitude}&longitude=${location.longitude}&vehicle_type=${vehicleType}`
  );
}
```
