import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              MissInformation is committed to protecting your privacy. We believe in transparency
              and your right to know how your information is used.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Location Data</h3>
              <p>
                We request your location only to provide region-specific misinformation trends and
                insights. Your precise location is never stored or shared with third parties.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Messages for Verification</h3>
              <p>
                When you check a message, we analyze the text to provide fact-checking results. The
                message content is processed in real-time and is not permanently stored in our databases.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Don't Do</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>✗ We don't require login or collect personal identification</p>
            <p>✗ We don't store your messages permanently</p>
            <p>✗ We don't share your data with advertisers</p>
            <p>✗ We don't track you across other websites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              If you have questions about this privacy policy or our data practices, please contact us
              at privacy@misinforadar.example
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
