import { motion } from "framer-motion";
import { MessageCircle, Heart, Users, Info, LucideIcon } from "lucide-react";
import { useState } from "react";
import { AICompanionTooltip } from "./AICompanionTooltip";

export type MissionType = "contact" | "donation" | "volunteer" | "info";

interface Mission {
  id: MissionType;
  title: string;
  description: string;
  icon: LucideIcon;
  aiHint: string;
}

const missions: Mission[] = [
  {
    id: "contact",
    title: "Make Contact",
    description: "Establish a communication link with the Nexus",
    icon: MessageCircle,
    aiHint: "Initiating secure channel... Perfect for direct inquiries.",
  },
  {
    id: "donation",
    title: "Offer a Donation",
    description: "Strengthen our digital infrastructure",
    icon: Heart,
    aiHint: "Resources detected. Your contribution fuels the resistance.",
  },
  {
    id: "volunteer",
    title: "Join the Guild",
    description: "Become part of the Volunteer Corps",
    icon: Users,
    aiHint: "Skill assessment ready. The Guild awaits your talents.",
  },
  {
    id: "info",
    title: "Request Intel",
    description: "Access the knowledge archives",
    icon: Info,
    aiHint: "Data banks accessible. What knowledge do you seek?",
  },
];

interface MissionSelectorProps {
  selectedMission: MissionType | null;
  onSelectMission: (mission: MissionType) => void;
}

export const MissionSelector = ({ selectedMission, onSelectMission }: MissionSelectorProps) => {
  const [hoveredMission, setHoveredMission] = useState<MissionType | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-primary text-glow-cyan tracking-wider">
        SELECT YOUR MISSION
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {missions.map((mission, index) => {
          const Icon = mission.icon;
          const isSelected = selectedMission === mission.id;
          const isHovered = hoveredMission === mission.id;

          return (
            <motion.button
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              onClick={() => onSelectMission(mission.id)}
              onMouseEnter={() => setHoveredMission(mission.id)}
              onMouseLeave={() => setHoveredMission(null)}
              className={`
                relative p-4 rounded-xl text-left transition-all duration-300
                glass-panel border
                ${isSelected 
                  ? "border-primary glow-cyan" 
                  : "border-primary/20 hover:border-primary/50"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${isSelected 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-primary/10 text-primary"
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mission.description}
                  </p>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-primary animate-neon-pulse"
                  />
                )}
              </div>

              {/* AI Companion Tooltip */}
              <AICompanionTooltip
                isVisible={isHovered && !isSelected}
                message={mission.aiHint}
                position="bottom"
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
