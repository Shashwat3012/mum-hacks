import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useLocation } from '@/hooks/useLocation';
import { useApi } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';

interface Hotspot {
  lat: number;
  lng: number;
  intensity: number;
  category: string;
  keywords: string[];
}

interface HeatmapData {
  hotspots: Hotspot[];
}

const MapView = () => {
  const location = useLocation();
  const { fetchData, loading } = useApi();
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);

  useEffect(() => {
    const loadHeatmap = async () => {
      const data = await fetchData<HeatmapData>('/misinfo/heatmap');
      if (data) {
        setHotspots(data.hotspots);
      }
    };

    if (!location.loading) {
      loadHeatmap();
    }
  }, [location.loading]);

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'health':
        return '#ef4444'; // red
      case 'politics':
        return '#f97316'; // orange
      case 'general':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  };

  if (location.loading || loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-card rounded-lg border border-border">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[location.lat || 20.5937, location.lng || 78.9629] as [number, number]}
        zoom={5}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {hotspots.map((hotspot, index) => (
          <CircleMarker
            key={index}
            center={[hotspot.lat, hotspot.lng] as [number, number]}
            pathOptions={{
              fillColor: getCategoryColor(hotspot.category),
              color: getCategoryColor(hotspot.category),
              fillOpacity: 0.6,
              weight: 2,
            }}
            radius={Math.sqrt(hotspot.intensity) * 2}
          >
            <Popup>
              <div className="p-2">
                <Badge className="mb-2">{hotspot.category}</Badge>
                <p className="font-semibold text-sm mb-2">
                  Intensity: {hotspot.intensity}%
                </p>
                <div>
                  <p className="text-xs font-semibold mb-1">Top Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {hotspot.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-block px-2 py-0.5 bg-secondary rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
