import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles } from "lucide-react";

const aiMessages = [
  "Need help? I guide your mission through the Nexus.",
  "Select a mission above to begin your journey.",
  "All fields are encrypted with quantum protocols.",
  "The Night of Info 2025 awaits your contribution!",
  "SFEIR's digital realm welcomes all travelers.",
];

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const cycleMessage = () => {
    setMessageIndex((prev) => (prev + 1) % aiMessages.length);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-72"
          >
            <div className="glass-panel rounded-xl border border-secondary/30 overflow-hidden">
              {/* Header */}
              <div className="bg-secondary/10 px-4 py-3 border-b border-secondary/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="font-display text-sm text-secondary tracking-wide">
                    NEXUS AI
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="p-4">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card/50 rounded-lg p-3 border border-border"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-secondary" />
                    </div>
                    <p className="text-sm text-foreground/90 font-body">
                      {aiMessages[messageIndex]}
                    </p>
                  </div>
                </motion.div>

                <button
                  onClick={cycleMessage}
                  className="mt-3 w-full text-xs text-muted-foreground hover:text-secondary transition-colors font-display tracking-wide"
                >
                  [ NEXT TIP ]
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-card/30 border-t border-border">
                <p className="text-xs text-muted-foreground text-center font-display">
                  SFEIR Night of Info 2025
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300
          ${isOpen 
            ? "bg-secondary glow-purple" 
            : "bg-primary/20 border border-primary/50 hover:bg-primary/30"
          }
        `}
      >
        {/* Glow effect */}
        <div className={`
          absolute inset-0 rounded-full blur-md transition-opacity duration-300
          ${isOpen ? "bg-secondary/50 opacity-100" : "bg-primary/30 opacity-50"}
        `} />
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-secondary-foreground" />
          ) : (
            <Bot className="w-6 h-6 text-primary animate-neon-pulse" />
          )}
        </motion.div>

        {/* Notification dot */}
        {!isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-glow-pulse"
          />
        )}
      </motion.button>
    </div>
  );
};
