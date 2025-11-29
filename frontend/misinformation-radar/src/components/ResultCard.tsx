import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ResultCardProps {
  verdict: 'True' | 'False' | 'Misleading' | 'Partially True';
  confidence: number;
  summary: string;
  sources?: Array<{ name: string; url: string }>;
  relatedKeywords?: string[];
}

const ResultCard = ({ verdict, confidence, summary, sources = [], relatedKeywords = [] }: ResultCardProps) => {
  const getVerdictIcon = () => {
    switch (verdict) {
      case 'True':
        return <CheckCircle className="h-8 w-8 text-success" />;
      case 'False':
        return <AlertCircle className="h-8 w-8 text-destructive" />;
      case 'Misleading':
        return <AlertTriangle className="h-8 w-8 text-warning" />;
      case 'Partially True':
        return <Info className="h-8 w-8 text-primary" />;
      default:
        return null;
    }
  };

  const getVerdictColor = () => {
    switch (verdict) {
      case 'True':
        return 'bg-success text-success-foreground';
      case 'False':
        return 'bg-destructive text-destructive-foreground';
      case 'Misleading':
        return 'bg-warning text-warning-foreground';
      case 'Partially True':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start gap-4">
          {getVerdictIcon()}
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{verdict}</CardTitle>
            <CardDescription className="text-base">
              Confidence: <strong>{confidence}%</strong>
            </CardDescription>
          </div>
          <Badge className={getVerdictColor()}>{verdict}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Summary</h3>
          <p className="text-muted-foreground">{summary}</p>
        </div>

        {sources.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Trusted Sources</h3>
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relatedKeywords.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {relatedKeywords.map((keyword) => (
                <Link key={keyword} to={`/topic/${keyword}`}>
                  <Button variant="outline" size="sm">
                    {keyword}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
