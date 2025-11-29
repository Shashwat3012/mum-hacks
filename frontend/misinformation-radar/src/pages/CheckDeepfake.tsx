// CheckDeepfake.tsx
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

interface DeepfakeResult {
  deepfake_label: 'FAKE' | 'REAL';
  deepfake_score: number;
  speaker: string;
  transcript: string;
  evidence: string[];
  explanation: string;
}

const CheckDeepfake = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DeepfakeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setVideoFile(file);
    setResult(null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

const handleCheck = async () => {
  if (!videoFile) return;

  const formData = new FormData();
  // key **must** be "video" to match `video: UploadFile = File(...)`
  formData.append('video', videoFile, videoFile.name);

  try {
    setLoading(true);
    const response = await axios.post<DeepfakeResult>(
      'http://127.0.0.1:3000/detect',
      formData,
      {
        // Let Axios set the correct multipart boundary; no need to hardcode it.
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    setResult(response.data);
  } catch (error) {
    console.error('Deepfake detect error', error);
  } finally {
    setLoading(false);
  }
};


  const verdictColorClass =
    result?.deepfake_label === 'FAKE'
      ? 'text-red-600'
      : result?.deepfake_label === 'REAL'
      ? 'text-green-600'
      : 'text-foreground';

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Check Deepfake
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload a video to detect whether it is a deepfake or a real recording.
          </p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Select a video file (MP4, WebM, etc.) to analyze for deepfake manipulation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />

            {previewUrl && (
              <video
                src={previewUrl}
                controls
                className="w-full max-h-80 rounded-md border border-border"
              />
            )}

            <Button
              onClick={handleCheck}
              disabled={loading || !videoFile}
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
          <div className="animate-in fade-in duration-500 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deepfake Verdict</CardTitle>
                <CardDescription>
                  Model assessment of whether this video is manipulated or authentic.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={`text-3xl md:text-4xl font-extrabold ${verdictColorClass}`}>
                  This video is: {result.deepfake_label}
                </div>
                <p className="text-sm text-muted-foreground">
                  Deepfake probability:{' '}
                  <span className="font-semibold">
                    {result.deepfake_score.toFixed(2)*100}%
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Detected speaker:{' '}
                  <span className="font-semibold">{result.speaker}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <CardDescription>
                  Text extracted or aligned with the video’s spoken content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {result.transcript}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evidence</CardTitle>
                <CardDescription>
                  Key observations supporting the deepfake classification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  {result.evidence.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Explanation</CardTitle>
                <CardDescription>
                  High-level reasoning behind the model’s verdict.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {result.explanation}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!result && (
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>
                Upload a short clip where a single speaker is clearly visible and audible for best results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Supported formats depend on your backend (e.g., MP4, WebM).</li>
                <li>Longer videos may take more time to process and analyze.</li>
                <li>The verdict is a model prediction and may not be perfect.</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CheckDeepfake;
