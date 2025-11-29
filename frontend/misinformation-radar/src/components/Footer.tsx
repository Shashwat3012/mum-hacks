import { Link } from 'react-router-dom';
import { Radio } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-card-foreground">
            <Radio className="h-5 w-5 text-primary" />
            <span className="font-semibold">MissInformation</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>© 2025 MissInformation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
