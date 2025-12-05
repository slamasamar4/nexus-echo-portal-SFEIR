import { motion } from "framer-motion";
import { MissionType } from "./MissionSelector";
import { CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";

interface ConfirmationScreenProps {
  name: string;
  mission: MissionType;
  onReset: () => void;
}

const missionMessages: Record<MissionType, (name: string, year: number) => string> = {
  contact: (name, year) => 
    `Greetings, ${name}. Your transmission has been routed to the Central Node. Expect a response within 48 cycles. The Nexus acknowledges your signal in ${year}.`,
  donation: (name, year) => 
    `GG, ${name}! Your generous resource transfer strengthens our ${year} resistance network. The digital frontier thanks you.`,
  volunteer: (name, year) => 
    `Welcome to the Guild, ${name}. Your skills have been registered in the ${year} Volunteer Corps database. Prepare for your first mission briefing.`,
  info: (name, year) => 
    `Acknowledged, ${name}. Your intel request has been logged. Our ${year} archives are being queried. Stand by for data transmission.`,
};

const missionTitles: Record<MissionType, string> = {
  contact: "TRANSMISSION SENT",
  donation: "RESOURCES RECEIVED",
  volunteer: "GUILD ENROLLMENT COMPLETE",
  info: "INTEL REQUEST LOGGED",
};

export const ConfirmationScreen = ({ name, mission, onReset }: ConfirmationScreenProps) => {
  const currentYear = new Date().getFullYear();
  const message = missionMessages[mission](name, currentYear);
  const title = missionTitles[mission];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4 cyber-grid"
    >
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [0, 0.5, 0] 
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
            className="absolute w-1 h-1 bg-primary rounded-full"
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative max-w-lg w-full"
      >
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-30 animate-neon-pulse" />
        
        <div className="relative glass-panel rounded-2xl p-8 border border-primary/30 scanline">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-glow-pulse" />
              <div className="relative bg-primary/20 rounded-full p-4 border border-primary/50">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl md:text-3xl text-center text-primary text-glow-cyan tracking-wider mb-2"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="font-display text-sm text-secondary tracking-wide">
              ECHO OF GRATITUDE
            </span>
            <Sparkles className="w-4 h-4 text-secondary" />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/50 rounded-xl p-4 border border-border mb-6"
          >
            <p className="text-foreground/90 font-body text-center leading-relaxed">
              {message}
            </p>
          </motion.div>

          {/* User Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8"
          >
            <span className="font-display">AGENT: {name.toUpperCase()}</span>
            <span className="text-primary">|</span>
            <span className="font-display">CYCLE: {currentYear}</span>
          </motion.div>

          {/* Return Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full btn-neon flex items-center justify-center gap-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO PORTAL
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
