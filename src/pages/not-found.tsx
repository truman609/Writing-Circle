import { Link } from "wouter";
import { Feather } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center p-4 bg-paper-dark rounded-full mb-6">
          <Feather className="w-8 h-8 text-ink-muted" strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl font-display font-bold text-ink mb-4">404</h1>
        <p className="text-xl text-ink-light mb-8 font-body">
          It seems this page has been written out of the story.
        </p>
        <Link href="/" className="inline-flex px-8 py-3 rounded-full bg-ink text-paper font-sans font-medium hover:bg-ink-light transition-colors">
          Return to the Circle
        </Link>
      </div>
    </div>
  );
}
