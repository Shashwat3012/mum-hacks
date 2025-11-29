// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import ResultCard from '@/components/ResultCard';
// import { Search, Loader2 } from 'lucide-react';

// interface CheckResult {
//   verdict: 'True' | 'False' | 'Misleading' | 'Partially True';
//   confidence: number;
//   summary: string;
//   sources: Array<{ name: string; url: string }>;
//   relatedKeywords: string[];
// }

// function parseSections(text: string): {
//   Status?: string;
//   Explanation?: string;
//   Evidence?: string;
//   Context?: string;
//   Sources?: string;
//   VerifiedOn?: string;
// } {
//   const lines = text.trim().split("\n");

//   const result: any = {};

//   lines.forEach(line => {
//     const match = line.match(/-\s*(.*?):\s*(.*)/);
//     if (match) {
//       const key = match[1].trim().replace(/\s+/g, "");
//       const value = match[2].trim();
//       result[key] = value;
//     }
//   });

//   return result;
// }


// const BACKEND_URL = 'http://localhost:8000/webhook'; // Replace with your actual backend URL

// const Check = () => {
//   const [message, setMessage] = useState('');
//   const [result, setResult] = useState<CheckResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const getUserId = async () => {
//     // Implement your user ID logic here
//     return 'user-' + Math.random().toString(36).substr(2, 9);
//   };

//   const getLocationFromTab = async () => {
//     // Implement your location logic here
//     // For now, returning a mock location
//     return {
//       lat: 19.0760,
//       lng: 72.8777,
//       error: false
//     };
//   };

//   const handleCheck = async () => {
//     if (!message.trim()) return;

//     setLoading(true);
//     try {
//       const location = await getLocationFromTab();
      
//       const response = await fetch(BACKEND_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text: message,
//           platform: "web",
//           userId: await getUserId(),
//           location: location.error ? null : location,
//         }),
//       });

//       const data = await response.json();
      
//       // if (data.success && data.fromN8n) {
//       //   // Map the n8n response to your CheckResult format
//       //   const n8nData = data.fromN8n;
//       //   console.log(n8nData);
//       //   console.log(typeof n8nData);
//       //   const word = n8nData.split(" ");
//       //   // console.log(word);

//       //   const parsed = parseSections(n8nData);
//       //   console.log(parsed);
        
//       //   setResult({
//       //     verdict: word[3],
//       //     confidence: n8nData.confidence,
//       //     summary: n8nData,
//       //     sources: n8nData.sources || [],
//       //     relatedKeywords: n8nData.relatedKeywords || n8nData.keywords || []
//       //   });
//       // } 
//       if (data.success && data.fromN8n) {
//   const raw = data.fromN8n; // string
//   const parsed = parseSections(raw);

//   // Destructure parsed fields
//         const {
//           Status = "",
//           Explanation = "",
//           Evidence = "",
//           Context = "",
//           Sources = "",
//           VerifiedOn = ""
//         } = parsed;

//         // Extract verdict from Status
//         // Example: "✗ FALSE" → "FALSE"
//         const verdictWord = Status.split(" ").pop()?.toUpperCase() || "Unknown";

//         setResult({
//           verdict: verdictWord as any,                     // from "✗ FALSE"
//           confidence: 90,                           // you can calculate if needed
//           summary: Explanation,                     // main explanation text
//           sources: [{ name: "Sources", url: Sources }], 
//           relatedKeywords: [],
//         });
//       }

//       else {
//         console.error('Error from backend:', data);
//       }
//     } catch (error) {
//       console.error('Error checking message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
//       <div className="max-w-4xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="space-y-4">
//           <h1 className="text-4xl md:text-5xl font-bold text-foreground">
//             Check a Message
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Paste any message, forward, or claim you've received to verify its authenticity.
//           </p>
//         </div>

//         {/* Input Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Paste Your Message</CardTitle>
//             <CardDescription>
//               Copy and paste any WhatsApp forward, Telegram message, or text you want to fact-check
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Textarea
//               placeholder="Paste the message here..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="min-h-[200px] resize-none"
//             />
//             <Button
//               onClick={handleCheck}
//               disabled={loading || !message.trim()}
//               className="w-full sm:w-auto gap-2"
//               size="lg"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   Analyzing...
//                 </>
//               ) : (
//                 <>
//                   <Search className="h-5 w-5" />
//                   Check Now
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Results Section */}
//         {result && (
//           <div className="animate-in fade-in duration-500">
//             <ResultCard {...result} />
//           </div>
//         )}

//         {/* Example Messages */}
//         {!result && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Need an example?</CardTitle>
//               <CardDescription>Try checking one of these common types of messages</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start h-auto py-3 px-4 text-left"
//                   onClick={() =>
//                     setMessage(
//                       'URGENT: New virus spreading faster than COVID! Doctors recommend eating garlic and drinking hot water every 15 minutes to prevent infection. Share immediately!'
//                     )
//                   }
//                 >
//                   <span className="text-sm">
//                     Health claim: "New virus spreading faster than COVID..."
//                   </span>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start h-auto py-3 px-4 text-left"
//                   onClick={() =>
//                     setMessage(
//                       'BREAKING: Government announces Rs 5000 direct bank transfer to all citizens. Click this link to register now before it expires tomorrow!'
//                     )
//                   }
//                 >
//                   <span className="text-sm">
//                     Financial claim: "Government announces Rs 5000 direct transfer..."
//                   </span>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Check;













import { useState } from 'react';
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

/* ------------------ FIXED MULTILINE PARSER ------------------ */
function parseSections(text: string): {
  Status?: string;
  Explanation?: string;
  Evidence?: string;
  Context?: string;
  Sources?: string;
  VerifiedOn?: string;
} {
  const lines = text.split("\n");

  const result: any = {};
  let currentKey: string | null = null;

  lines.forEach(line => {
    // Matches "- Status:", "- Explanation:", etc.
    const headerMatch = line.match(/-\s*(.*?):\s*(.*)/);

    if (headerMatch) {
      currentKey = headerMatch[1].trim().replace(/\s+/g, "");
      result[currentKey] = headerMatch[2].trim(); // start text
    } else if (currentKey) {
      // Append multiline content
      result[currentKey] += "\n" + line.trim();
    }
  });

  return result;
}

const BACKEND_URL = 'http://localhost:8000/webhook';

const Check = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  const getUserId = async () => {
    return 'user-' + Math.random().toString(36).substr(2, 9);
  };

  const getLocationFromTab = async () => {
    return {
      lat: 19.15429,
      lng: 72.85679,
      error: false
    };
  };

  const handleCheck = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const location = await getLocationFromTab();

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message,
          platform: "web",
          userId: await getUserId(),
          location: location.error ? null : location,
        }),
      });

      const data = await response.json();

      /* ---------------- FIXED FULL PARSE + FULL DISPLAY ---------------- */
      if (data.success && data.fromN8n) {
        const raw = data.fromN8n; // This is the full text block

        const parsed = parseSections(raw);

        const {
          Status = "",
          Explanation = "",
          Evidence = "",
          Context = "",
          Sources = "",
          VerifiedOn = ""
        } = parsed;

        // Extract verdict from status line
        let verdictWord = "False";
        if (Status) {
          const parts = Status.split(" ");
          verdictWord = parts[parts.length - 1].toUpperCase();
        }

        /* ---------------- OUTPUT FULL TEXT TO FRONTEND ---------------- */
        const fullSummary = `
        ${Explanation}

        ${Evidence}

        ${Context}

        Verified On: ${VerifiedOn}
        `.trim();

        const sourceArray = Sources
          ? [{ name: "Sources", url: Sources }]
          : [];

        setResult({
          verdict: verdictWord as any,
          confidence: 75,
          summary: fullSummary,     
          sources: sourceArray,
          relatedKeywords: [],
        });
      }

      else {
        console.error('Error from backend:', data);
      }
    } catch (error) {
      console.error('Error checking message:', error);
    } finally {
      setLoading(false);
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
                      'URGENT: New virus spreading...'
                    )
                  }
                >
                  <span className="text-sm">
                    Health claim: "New virus spreading..."
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




























// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import ResultCard from '@/components/ResultCard';
// import { Search, Loader2 } from 'lucide-react';

// interface CheckResult {
//   verdict: string;
//   confidence: number;
//   summary: string;
//   sources: string;  // CHANGED → now plain string
//   relatedKeywords: string[];
// }

// // -----------------------
// // FIXED PARSER
// // -----------------------
// function parseSections(text: string): Record<string, string> {
//   const lines = text.trim().split("\n");
//   const result: Record<string, string> = {};

//   lines.forEach((line) => {
//     // Matches: "- Key: value here"
//     const match = line.match(/-\s*([^:]+):\s*(.*)/);
//     if (match) {
//       const key = match[1].trim();
//       const value = match[2].trim();
//       result[key] = value;
//     }
//   });

//   return result;
// }

// const BACKEND_URL = 'http://localhost:8000/webhook';

// const Check = () => {
//   const [message, setMessage] = useState('');
//   const [result, setResult] = useState<CheckResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const getUserId = async () => {
//     return 'user-' + Math.random().toString(36).substr(2, 9);
//   };

//   const getLocationFromTab = async () => {
//     return {
//       lat: 19.076,
//       lng: 72.8777,
//       error: false
//     };
//   };

//   const handleCheck = async () => {
//     if (!message.trim()) return;

//     setLoading(true);
//     try {
//       const location = await getLocationFromTab();

//       const response = await fetch(BACKEND_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text: message,
//           platform: "web",
//           userId: await getUserId(),
//           location: location.error ? null : location,
//         }),
//       });

//       const data = await response.json();

//       if (data.success && data.fromN8n) {
//         const raw = data.fromN8n;
//         const parsed = parseSections(raw);

//         const {
//           Status = "",
//           Explanation = "",
//           Evidence = "",
//           Context = "",
//           Sources = "",
//           VerifiedOn = ""
//         } = parsed;

//         const verdictWord =
//           Status.split(" ").pop()?.toUpperCase() || "UNKNOWN";

//         setResult({
//           verdict: verdictWord,
//           confidence: 90,        // you can change this later
//           summary:
//             Explanation +
//             "\n\n" +
//             Evidence +
//             "\n\n" +
//             Context +
//             "\n\nVerified On: " +
//             VerifiedOn,
//           sources: Sources,      // ← PLAIN STRING, NO LINKING
//           relatedKeywords: [],
//         });
//       } else {
//         console.error("Error from backend:", data);
//       }
//     } catch (error) {
//       console.error("Error checking message:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
//       <div className="max-w-4xl mx-auto space-y-8">
//         <div className="space-y-4">
//           <h1 className="text-4xl md:text-5xl font-bold text-foreground">
//             Check a Message
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Paste any message, forward, or claim you've received to verify its authenticity.
//           </p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Paste Your Message</CardTitle>
//             <CardDescription>
//               Copy and paste any WhatsApp forward, Telegram message, or text you want to fact-check
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             <Textarea
//               placeholder="Paste the message here..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="min-h-[200px] resize-none"
//             />

//             <Button
//               onClick={handleCheck}
//               disabled={loading || !message.trim()}
//               className="w-full sm:w-auto gap-2"
//               size="lg"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   Analyzing...
//                 </>
//               ) : (
//                 <>
//                   <Search className="h-5 w-5" />
//                   Check Now
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         {result && (
//           <div className="animate-in fade-in duration-500">
//             <ResultCard {...result} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Check;
