import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface Keyword {
  text: string;
  score: number;
  category: string;
}

interface WordCloudProps {
  keywords: Keyword[];
}

interface PlacedWord extends Keyword {
  x: number;
  y: number;
  fontSize: number;
  orientation: 'horizontal' | 'vertical';
}

const WordCloud = ({ keywords }: WordCloudProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);

  useEffect(() => {
    if (!keywords.length) return;

    // Sort keywords by score (descending)
    const sortedKeywords = [...keywords].sort((a, b) => b.score - a.score);

    // Calculate font sizes based on scores
    const maxScore = sortedKeywords[0].score;
    const minScore = sortedKeywords[sortedKeywords.length - 1].score;

    const placed: PlacedWord[] = [];
    const gridSize = 20;
    const maxAttempts = 50;

    sortedKeywords.forEach((keyword, index) => {
      // Calculate font size (24px to 64px)
      const fontSize = 24 + ((keyword.score - minScore) / (maxScore - minScore)) * 40;
      
      // Alternate between horizontal and vertical for crossword effect
      const orientation: 'horizontal' | 'vertical' = index % 3 === 0 ? 'vertical' : 'horizontal';

      // Try to place the word
      let placed_successfully = false;
      for (let attempt = 0; attempt < maxAttempts && !placed_successfully; attempt++) {
        const x = Math.random() * 70 + 10; // 10% to 80% of container width
        const y = Math.random() * 70 + 10; // 10% to 80% of container height

        // For simplicity, just place them (in production, check for overlaps)
        placed.push({
          ...keyword,
          x,
          y,
          fontSize,
          orientation,
        });
        placed_successfully = true;
      }
    });

    setPlacedWords(placed);
  }, [keywords]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health':
        return 'text-destructive hover:text-destructive/80';
      case 'politics':
        return 'text-warning hover:text-warning/80';
      case 'general':
        return 'text-primary hover:text-primary/80';
      default:
        return 'text-foreground hover:text-primary';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] bg-card rounded-lg border border-border overflow-hidden"
    >
      {placedWords.map((word, index) => (
        <Link
          key={index}
          to={`/topic/${word.text}`}
          className={`absolute font-bold transition-all duration-300 ${getCategoryColor(
            word.category
          )}`}
          style={{
            left: `${word.x}%`,
            top: `${word.y}%`,
            fontSize: `${word.fontSize}px`,
            transform: word.orientation === 'vertical' ? 'rotate(-90deg)' : 'none',
            transformOrigin: 'left center',
          }}
        >
          {word.text}
        </Link>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Health</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Politics</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">General</span>
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
