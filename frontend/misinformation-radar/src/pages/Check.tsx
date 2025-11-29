import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ResultCard from '@/components/ResultCard';
import { Search, Loader2 } from 'lucide-react';

interface CheckResult {
  verdict: 'True' | 'False' | 'Misleading' | 'Partially True';
  confidence: number;
  summary: string;
  sources: Array<{ name: string; url: string }>;
  relatedKeywords: string[];
}

const Check = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const { fetchData, loading } = useApi();

  const handleCheck = async () => {
    if (!message.trim()) return;

    const data = await fetchData<CheckResult>('/misinfo/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (data) {
      setResult(data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Check a Message
          </h1>
          <p className="text-lg text-muted-foreground">
            Paste any message, forward, or claim you've received to verify its authenticity.
          </p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Paste Your Message</CardTitle>
            <CardDescription>
              Copy and paste any WhatsApp forward, Telegram message, or text you want to fact-check
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste the message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <Button
              onClick={handleCheck}
              disabled={loading || !message.trim()}
              className="w-full sm:w-auto gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Check Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="animate-in fade-in duration-500">
            <ResultCard {...result} />
          </div>
        )}

        {/* Example Messages */}
        {!result && (
          <Card>
            <CardHeader>
              <CardTitle>Need an example?</CardTitle>
              <CardDescription>Try checking one of these common types of messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 text-left"
                  onClick={() =>
                    setMessage(
                      'URGENT: New virus spreading faster than COVID! Doctors recommend eating garlic and drinking hot water every 15 minutes to prevent infection. Share immediately!'
                    )
                  }
                >
                  <span className="text-sm">
                    Health claim: "New virus spreading faster than COVID..."
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 text-left"
                  onClick={() =>
                    setMessage(
                      'BREAKING: Government announces Rs 5000 direct bank transfer to all citizens. Click this link to register now before it expires tomorrow!'
                    )
                  }
                >
                  <span className="text-sm">
                    Financial claim: "Government announces Rs 5000 direct transfer..."
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Check;
