import { motion } from "framer-motion";
import { MEMBERS } from "@/lib/members";
import { cn } from "@/lib/utils";
import { ArrowRight, Feather } from "lucide-react";

interface SetupViewProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onStart: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function SetupView({ selectedIds, onToggle, onStart }: SetupViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center p-3 bg-paper-dark rounded-full mb-6">
          <Feather className="w-6 h-6 text-ink-light" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-ink mb-6">
          Assemble Your Circle
        </h1>
        <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
          Every piece of writing needs the right readers. Select the members of your 
          group whose perspectives you need most right now.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        {MEMBERS.map((member) => {
          const isSelected = selectedIds.includes(member.id);
          return (
            <motion.button
              key={member.id}
              variants={item}
              onClick={() => onToggle(member.id)}
              className={cn(
                "group relative flex flex-col items-start p-6 rounded-2xl text-left transition-all duration-300",
                "border-2 outline-none focus-visible:ring-4 focus-visible:ring-brand/20",
                isSelected 
                  ? `border-ink bg-white shadow-hover -translate-y-1` 
                  : "border-border-soft bg-white/50 hover:bg-white hover:border-border-strong hover:shadow-subtle"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-5 transition-transform duration-300",
                member.bgClass,
                isSelected ? "scale-110" : "group-hover:scale-110"
              )}>
                {member.avatar}
              </div>
              
              <h3 className="text-xl font-display font-semibold text-ink mb-1">
                {member.name}
              </h3>
              
              <div className={cn(
                "text-xs font-sans tracking-widest uppercase font-semibold mb-3",
                member.colorClass
              )}>
                {member.role}
              </div>
              
              <p className="text-sm text-ink-light leading-relaxed">
                {member.desc}
              </p>

              {/* Selection indicator */}
              <div className={cn(
                "absolute top-5 right-5 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center",
                isSelected ? "bg-ink border-ink" : "border-border-strong"
              )}>
                {isSelected && (
                  <motion.svg 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="w-3 h-3 text-paper" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <button
          onClick={onStart}
          disabled={selectedIds.length === 0}
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-full font-sans font-medium text-lg transition-all duration-300",
            selectedIds.length > 0 
              ? "bg-ink text-paper hover:bg-ink-light hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0" 
              : "bg-paper-dark text-ink-muted cursor-not-allowed border border-border-soft"
          )}
        >
          {selectedIds.length === 0 
            ? "Select at least one member" 
            : `Begin Session with ${selectedIds.length} Member${selectedIds.length > 1 ? 's' : ''}`
          }
          {selectedIds.length > 0 && <ArrowRight className="w-5 h-5" />}
        </button>
      </motion.div>
    </div>
  );
}
