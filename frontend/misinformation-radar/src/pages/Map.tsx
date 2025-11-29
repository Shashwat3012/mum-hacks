import MapView from '@/components/MapView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Map = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Missnformation Heatmap
          </h1>
          <p className="text-lg text-muted-foreground">
            Visualize misinformation hotspots across regions. Larger circles indicate higher spread intensity.
          </p>
        </div>

        {/* Map */}
        <MapView />

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding the Map</CardTitle>
            <CardDescription>How to interpret misinformation hotspots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-destructive" />
                  <span className="font-semibold">Health Misinformation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  False claims about diseases, treatments, and medical advice
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-warning" />
                  <span className="font-semibold">Political Misinformation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  False claims about elections, policies, and political figures
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                  <span className="font-semibold">General Hoaxes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Scams, conspiracy theories, and other misleading content
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Map;
