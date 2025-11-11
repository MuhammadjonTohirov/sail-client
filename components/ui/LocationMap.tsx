"use client";

interface LocationMapProps {
  lat: number;
  lon: number;
  locationName?: string;
  isApproximate?: boolean; // Indicates geocoded/approximate location - uses circle instead of pin
  className?: string;
}

/**
 * LocationMap component displays a map with an approximate location circle
 * Clicking opens Yandex Maps with exact location
 */
export const LocationMap = ({ lat, lon, locationName, isApproximate = false, className = '' }: LocationMapProps) => {
  const zoom = isApproximate ? 11 : 13;

  // For approximate locations, show circle area instead of pin
  // For exact locations, show pin marker
  let staticMapUrl: string;

  if (isApproximate) {
    // Draw a circle polygon around the approximate area (radius ~2-3km)
    // Format: c:RRGGBBaa,f:FillColor,w:width,lon,lat,lon,lat...
    // Need to adjust for latitude to make a proper circle (not ellipse)
    const radiusKm = 3; // 3km radius
    const radiusLat = radiusKm / 111; // 1 degree latitude ≈ 111km
    const radiusLon = radiusKm / (111 * Math.cos(lat * Math.PI / 180)); // Adjust for latitude

    const points: string[] = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * 2 * Math.PI;
      const pLon = lon + radiusLon * Math.cos(angle);
      const pLat = lat + radiusLat * Math.sin(angle);
      points.push(`${pLon},${pLat}`);
    }
    // Close the polygon
    points.push(points[0]);

    const polygonParam = `c:4A90E255,f:4A90E220,w:2,${points.join(',')}`;
    staticMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=${zoom}&l=map&size=450,200&pl=${encodeURIComponent(polygonParam)}`;
  } else {
    // Show pin marker for exact location
    staticMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=${zoom}&l=map&size=450,200&pt=${lon},${lat},pm2rdm`;
  }

  // Yandex Maps URL for exact location when clicked
  const yandexMapsUrl = `https://yandex.uz/maps/?pt=${lon},${lat}&z=17&l=map`;

  const handleMapClick = () => {
    window.open(yandexMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`location-map ${className}`}>
      <div
        onClick={handleMapClick}
        className="map-container"
        style={{
          cursor: 'pointer',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#f0f0f0',
        }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleMapClick();
          }
        }}
        aria-label={`View ${locationName || 'location'} on Yandex Maps`}
      >
        <img
          src={staticMapUrl}
          alt={`Map showing approximate location: ${locationName || 'Unknown'}`}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
          }}
          loading="lazy"
        />

        {/* Overlay with click hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            padding: '12px',
            color: 'white',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'opacity 0.2s',
          }}
          className="map-overlay"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>Нажмите, чтобы открыть карту</span>
        </div>
      </div>

      <style jsx>{`
        .map-container:hover .map-overlay {
          opacity: 1;
        }
        .map-container:focus {
          outline: 2px solid #23E5DB;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};
