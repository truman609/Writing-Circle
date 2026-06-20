import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { type Member } from "@/lib/members";
import { type Thread } from "@/hooks/use-writing-session";
import { cn } from "@/lib/utils";

interface FeedbackCardProps {
  member: Member;
  thread: Thread;
  isLoading: boolean;
  onFollowUp: (text: string) => void;
}

export function FeedbackCard({ member, thread, isLoading, onFollowUp }: FeedbackCardProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onFollowUp(inputValue);
      setInputValue("");
    }
  };

  // Auto-scroll to bottom of thread
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [thread, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden border border-border-soft shadow-subtle flex flex-col"
    >
      {/* Header */}
      <div className={cn("px-6 py-4 flex items-center gap-4 border-b border-border-soft", member.bgClass)}>
        <div className="text-3xl bg-white/50 w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
          {member.avatar}
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-ink leading-tight">
            {member.name}
          </h3>
          <p className={cn("text-xs font-sans uppercase tracking-wider font-semibold", member.colorClass)}>
            {member.role}
          </p>
        </div>
      </div>

      {/* Thread Body */}
      <div className="p-6 flex flex-col gap-6 text-[15px] sm:text-base leading-relaxed">
        {thread.map((msg, i) => (
          <div 
            key={i} 
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] rounded-2xl px-5 py-3.5",
              msg.role === 'user' 
                ? "bg-ink text-paper rounded-br-sm" 
                : "bg-paper-dark text-ink rounded-bl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-paper-dark px-5 py-4 text-ink flex items-center">
              <span className={cn("dot-pulse", member.colorClass)}>
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Follow-up Input */}
      {thread.length > 0 && (
        <div className="p-4 bg-paper/50 border-t border-border-soft mt-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder={`Reply to ${member.name}...`}
              className="w-full bg-white border border-border-strong rounded-full pl-5 pr-12 py-3 outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 p-2 rounded-full text-ink-muted hover:text-ink hover:bg-paper-dark disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink-muted transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
}
