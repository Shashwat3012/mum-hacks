import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Share2, TrendingUp, ExternalLink, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface TopicData {
  keyword: string;
  spreadScore: number;
  verdict: string;
  explanation: string;
  references: Array<{ source: string; url: string; title: string }>;
  timeline: Array<{ date: string; events: number; description: string }>;
}

const TopicDetail = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const { fetchData, loading } = useApi();
  const [topic, setTopic] = useState<TopicData | null>(null);

  useEffect(() => {
    const loadTopic = async () => {
      if (!keyword) return;
      const data = await fetchData<TopicData>(`/misinfo/topic/${keyword}`);
      if (data) {
        setTopic(data);
      }
    };

    loadTopic();
  }, [keyword]);

  const handleShare = () => {
    const text = `Check out this fact-check about "${keyword}" on Misinformation Radar`;
    if (navigator.share) {
      navigator.share({ title: `Fact-check: ${keyword}`, text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading || !topic) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading topic details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link to="/trends">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Trends
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground capitalize">
                {topic.keyword}
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="outline" className="text-base">
                  {topic.verdict}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Spread Score: {topic.spreadScore}%</span>
                </div>
              </div>
            </div>
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>What's Happening?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{topic.explanation}</p>
          </CardContent>
        </Card>

        {/* References */}
        <Card>
          <CardHeader>
            <CardTitle>Trusted Sources</CardTitle>
            <CardDescription>Verified information from reliable organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topic.references.map((ref, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ExternalLink className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      {ref.title}
                    </a>
                    <p className="text-sm text-muted-foreground">{ref.source}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Spread Timeline</CardTitle>
            <CardDescription>How this misinformation has spread over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topic.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    {index < topic.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold">{event.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString()} • {event.events} events
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TopicDetail;
