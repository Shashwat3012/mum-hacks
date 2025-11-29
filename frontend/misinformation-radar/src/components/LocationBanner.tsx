import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LocationBanner = () => {
  const location = useLocation();

  if (location.loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Detecting your location...</span>
      </div>
    );
  }

  if (location.error) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{location.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm">
      <MapPin className="h-4 w-4 text-primary" />
      <span className="text-foreground">
        <strong>{location.city}</strong>, {location.state}
      </span>
    </div>
  );
};

export default LocationBanner;
