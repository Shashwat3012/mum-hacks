import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Target, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            About MissInformation
          </h1>
          <p className="text-lg text-muted-foreground">
            Fighting misinformation, one fact-check at a time.
          </p>
        </div>

        {/* Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              In an era where misinformation spreads faster than facts, Misinformation Radar empowers
              individuals to verify information instantly. We combine AI-powered analysis with trusted
              sources to provide real-time fact-checking for messages spreading through social media
              and messaging platforms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform tracks misinformation trends across regions, helping communities stay
              informed and protected against false narratives that can cause real-world harm.
            </p>
          </CardContent>
        </Card>

        {/* What We Do */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <CardTitle>Instant Verification</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check any message or claim against our database of verified information and trusted sources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <CardTitle>Trend Monitoring</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track the spread of misinformation in real-time across different regions and topics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                <CardTitle>Location-Aware</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get insights about misinformation spreading in your area and take action locally.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <CardTitle>Community Protection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Help protect your community by sharing verified information and corrections.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 list-decimal list-inside">
              <li className="text-muted-foreground">
                <strong className="text-foreground">Paste a message</strong> - Copy any suspicious 
                message from WhatsApp, Telegram, or social media
              </li>
              <li className="text-muted-foreground">
                <strong className="text-foreground">AI Analysis</strong> - Our system analyzes the 
                content against verified databases and fact-checking sources
              </li>
              <li className="text-muted-foreground">
                <strong className="text-foreground">Get Results</strong> - Receive a verdict with 
                confidence score, trusted sources, and detailed explanation
              </li>
              <li className="text-muted-foreground">
                <strong className="text-foreground">Share Corrections</strong> - Help stop the spread 
                by sharing accurate information with your network
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Privacy First:</strong> We never store your personal 
              messages. Location data is used only to provide region-specific insights and is never 
              shared with third parties. No login required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
