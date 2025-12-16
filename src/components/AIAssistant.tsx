import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles, Send, Terminal } from "lucide-react";

// Determine API URL (Localhost for dev, Railway/Vercel for prod)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/chat";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Chat State
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'bot', 
      text: "System Online. I am Nexus-7. How can I assist your mission today?" 
    }
  ]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: inputValue 
    };

    // 1. Update UI immediately
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // 2. Send to Backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      // --- CRITICAL CORRECTION (Robust Error Handling) ---
      if (!response.ok) {
        // Attempt to read the error body from the server
        const errorData = await response.json().catch(() => ({ reply: `Error ${response.status} from server.` }));
        // Throw an error that includes the status code and the message from the backend
        throw new Error(`Server returned status ${response.status}: ${errorData.reply || errorData.error || 'No response body.'}`);
      }
      // --- END CRITICAL CORRECTION ---

      const data = await response.json();

      // 3. Add Bot Response
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || "Signal interrupted. Please retry."
      };
      
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error("Chat Error:", error);
      
      const errorMessage = error instanceof Error 
        ? `⚠️ Uplink Failed: ${error.message}` 
        : "⚠️ Neural Uplink Offline. Check backend console for detailed error.";
        
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: errorMessage
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-80 sm:w-96"
          >
            <div className="glass-panel rounded-xl border border-secondary/30 overflow-hidden shadow-2xl backdrop-blur-xl bg-black/80 flex flex-col h-[500px]">
              
              {/* --- HEADER --- */}
              <div className="bg-secondary/10 px-4 py-3 border-b border-secondary/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                  <span className="font-display text-sm text-secondary tracking-widest">
                    NEXUS-7 // UPLINK
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* --- CHAT AREA --- */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-secondary/20 scrollbar-track-transparent">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border 
                      ${msg.sender === 'bot' 
                        ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                        : 'bg-primary/10 border-primary/30 text-primary'
                      }`}
                    >
                      {msg.sender === 'bot' ? <Bot size={16} /> : <Terminal size={16} />}
                    </div>

                    {/* Bubble */}
                    <div className={`rounded-lg p-3 text-sm max-w-[80%] border backdrop-blur-sm
                      ${msg.sender === 'bot'
                        ? 'bg-secondary/5 border-secondary/20 text-foreground'
                        : 'bg-primary/10 border-primary/20 text-primary-foreground'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs text-secondary/70 ml-11"
                  >
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                    <span className="font-display tracking-widest ml-2">PROCESSING</span>
                  </motion.div>
                )}
                
                {/* Invisible div to scroll to */}
                <div ref={messagesEndRef} />
              </div>

              {/* --- INPUT FOOTER --- */}
              <form onSubmit={handleSendMessage} className="p-3 bg-card/30 border-t border-secondary/20 shrink-0">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter command..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-foreground focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all font-mono placeholder:text-muted-foreground/50"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-2 p-1.5 rounded-md text-secondary hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="mt-2 text-[10px] text-center text-muted-foreground/40 font-display">
                  ENCRYPTED CHANNEL :: V.2.0.25
                </div>
              </form>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING TOGGLE BUTTON (UNCHANGED) --- */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-xl z-50
          ${isOpen 
            ? "bg-secondary glow-purple border-secondary" 
            : "bg-black/80 border border-primary/50 hover:border-primary backdrop-blur-md"
          }
        `}
      >
        <div className={`
          absolute inset-0 rounded-full blur-md transition-opacity duration-300
          ${isOpen ? "bg-secondary/50 opacity-100" : "bg-primary/30 opacity-0 hover:opacity-50"}
        `} />
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Bot className="w-6 h-6 text-primary animate-neon-pulse" />
          )}
        </motion.div>

        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};