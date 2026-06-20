import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { MEMBERS } from "@/lib/members";
import { type Thread } from "@/hooks/use-writing-session";
import { FeedbackCard } from "./FeedbackCard";

interface SessionViewProps {
  selectedIds: string[];
  writingText: string;
  threads: Record<string, Thread>;
  loadingStates: Record<string, boolean>;
  hasSubmitted: boolean;
  isGlobalLoading: boolean;
  onWritingChange: (text: string) => void;
  onSubmit: () => void;
  onFollowUp: (memberId: string, text: string) => void;
  onBack: () => void;
}

export function SessionView({
  selectedIds,
  writingText,
  threads,
  loadingStates,
  hasSubmitted,
  isGlobalLoading,
  onWritingChange,
  onSubmit,
  onFollowUp,
  onBack
}: SessionViewProps) {
  const activeMembers = MEMBERS.filter(m => selectedIds.includes(m.id));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && !hasSubmitted) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`;
    }
  }, [writingText, hasSubmitted]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors font-sans text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Change Group
        </button>
        <div className="flex -space-x-2">
          {activeMembers.map((m, i) => (
            <div 
              key={m.id} 
              className={`w-8 h-8 rounded-full border-2 border-paper flex items-center justify-center text-sm z-[${10-i}] ${m.bgClass}`}
              title={m.name}
            >
              {m.avatar}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Section */}
      <motion.div 
        layout 
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-sans uppercase tracking-widest font-semibold text-ink-muted">
            The Reading Room
          </h2>
        </div>
        
        <div className="relative group">
          <textarea
            ref={textareaRef}
            value={writingText}
            onChange={(e) => onWritingChange(e.target.value)}
            disabled={hasSubmitted}
            placeholder="Paste a poem, a paragraph, an opening line, a scene — anything you're working on..."
            className="w-full min-h-[240px] p-6 md:p-8 bg-white border border-border-soft rounded-2xl shadow-subtle focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all resize-none font-body text-lg leading-relaxed text-ink disabled:opacity-70 disabled:bg-paper-dark"
          />
          
          {!hasSubmitted && (
            <div className="absolute bottom-6 right-6 flex justify-end">
              <button
                onClick={onSubmit}
                disabled={!writingText.trim() || isGlobalLoading}
                className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-full font-sans font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isGlobalLoading ? 'Distributing to group...' : 'Share with the group'}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Feedback Section */}
      {hasSubmitted && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px bg-border-soft flex-1" />
            <h2 className="font-display italic text-ink-muted text-xl">The Circle Responds</h2>
            <div className="h-px bg-border-soft flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeMembers.map((member) => (
              <FeedbackCard
                key={member.id}
                member={member}
                thread={threads[member.id] || []}
                isLoading={loadingStates[member.id] || false}
                onFollowUp={(text) => onFollowUp(member.id, text)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
