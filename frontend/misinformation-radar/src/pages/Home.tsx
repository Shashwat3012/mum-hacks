import { Link } from 'react-router-dom';
import { Search, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationBanner from '@/components/LocationBanner';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
              MissInformation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Fact-check as fast as messages spread.
            </p>
          </div>

          {/* Location Banner */}
          <div className="flex justify-center">
            <LocationBanner />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/check">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Search className="h-5 w-5" />
                Check a Message
              </Button>
            </Link>
            <Link to="/trends">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <TrendingUp className="h-5 w-5" />
                Explore Local Misinformation
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Verification</h3>
              <p className="text-sm text-muted-foreground">
                Instant fact-checking powered by trusted sources and AI analysis
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trend Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor misinformation spreading in your area and across regions
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Deep Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive breakdowns with sources, timelines, and context
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
