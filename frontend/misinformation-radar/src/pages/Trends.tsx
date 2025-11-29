import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import WordCloud from '@/components/WordCloud';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Keyword {
  text: string;
  score: number;
  category: string;
}

interface TrendsData {
  keywords: Keyword[];
}

type Scope = 'local' | 'india' | 'global';

const Trends = () => {
  const { fetchData, loading } = useApi();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [scope, setScope] = useState<Scope>('local');

  useEffect(() => {
    const loadTrends = async () => {
      const data = await fetchData<TrendsData>(`/misinfo/top?scope=${scope}`);
      if (data) {
        setKeywords(data.keywords);
      }
    };

    loadTrends();
  }, [scope]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Misinformation Trends
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore the most widespread misinformation topics. Click on any keyword to learn more.
          </p>
        </div>

        {/* Scope Toggle */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={scope === 'local' ? 'default' : 'outline'}
            onClick={() => setScope('local')}
          >
            Your Area
          </Button>
          <Button
            variant={scope === 'india' ? 'default' : 'outline'}
            onClick={() => setScope('india')}
          >
            India
          </Button>
          <Button
            variant={scope === 'global' ? 'default' : 'outline'}
            onClick={() => setScope('global')}
          >
            Global
          </Button>
        </div>

        {/* Word Cloud */}
        {loading ? (
          <div className="flex items-center justify-center h-[600px] bg-card rounded-lg border border-border">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading trends...</p>
            </div>
          </div>
        ) : (
          <WordCloud keywords={keywords} />
        )}

        {/* Info */}
        <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>How to read this:</strong> Larger words indicate higher spread scores. Colors represent categories: 
            <span className="text-destructive font-semibold"> Red (Health)</span>, 
            <span className="text-warning font-semibold"> Orange (Politics)</span>, 
            <span className="text-primary font-semibold"> Blue (General)</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Trends;
