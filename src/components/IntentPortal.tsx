import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Shield, Zap } from "lucide-react";
import { MissionSelector, MissionType } from "./MissionSelector";
import { DynamicFormFields } from "./DynamicFormFields";
import { ConfirmationScreen } from "./ConfirmationScreen";
import { AICompanionTooltip } from "./AICompanionTooltip";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  message: string;
  donationAmount: string;
  recurrence: "one-time" | "monthly";
  skills: string;
  availability: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  message: "",
  donationAmount: "",
  recurrence: "one-time",
  skills: "",
  availability: "",
};

const aiCompanionSuggestions: Record<MissionType | "default", string> = {
  default: "Awaiting your mission selection... 🎯",
  contact: "Quick tip: Use clear, concise language for optimal transmission.",
  donation: "Every credit strengthens our digital infrastructure. Thank you.",
  volunteer: "Your skills are valuable to the guild. Join us today!",
  info: "Knowledge is power. Explore the archives with curiosity.",
};

export const IntentPortal = () => {
  const [selectedMission, setSelectedMission] = useState<MissionType | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [showAICompanion, setShowAICompanion] = useState(true);
  const { toast } = useToast();

  const handleFieldChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = "Designation required for transmission";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Communication link required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid communication link format";
    }

    // Mission-specific validation
    if (selectedMission === "contact" || selectedMission === "info") {
      if (!formData.message.trim()) {
        newErrors.message = "Transmission content required";
      }
    }

    if (selectedMission === "donation") {
      if (!formData.donationAmount || parseFloat(formData.donationAmount) <= 0) {
        newErrors.donationAmount = "Valid resource amount required";
      }
    }

    if (selectedMission === "volunteer") {
      if (!formData.skills.trim()) {
        newErrors.skills = "Skill matrix data required";
      }
      if (!formData.availability.trim()) {
        newErrors.availability = "Time allocation required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - spam protection
    if (honeypot) {
      console.log("Spam detected");
      return;
    }

    if (!selectedMission) {
      toast({
        title: "Mission Required",
        description: "Please select a mission to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (validateForm()) {
      // Simulate form submission
      setIsSubmitted(true);
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedMission(null);
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted && selectedMission) {
    return (
      <ConfirmationScreen
        name={formData.name}
        mission={selectedMission}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
      {/* AI Companion Corner Suggestion */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute top-6 right-6 max-w-xs z-40 lg:fixed"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setShowAICompanion(true)}
          onHoverEnd={() => setShowAICompanion(true)}
          className="cursor-default"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="glass-panel border border-secondary/50 rounded-xl p-4 shadow-lg shadow-secondary/20 backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-lg flex-shrink-0"
              >
                🤖
              </motion.span>
              <div className="flex-1">
                <p className="text-xs text-secondary/80 font-display tracking-wide mb-1">
                  AI COMPANION
                </p>
                <motion.p
                  key={selectedMission}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-secondary/70 leading-relaxed"
                >
                  {selectedMission
                    ? aiCompanionSuggestions[selectedMission]
                    : aiCompanionSuggestions.default}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary animate-neon-pulse" />
            <span className="font-display text-xs tracking-[0.3em] text-muted-foreground">
              SFEIR NIGHT OF INFO 2025
            </span>
            <Zap className="w-5 h-5 text-primary animate-neon-pulse" />
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl text-primary text-glow-cyan tracking-wider mb-2">
            INTENT PORTAL
          </h1>
          
          <p className="font-body text-muted-foreground">
            The Connected Nexus: Your Personalized Echo
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Glowing border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl blur opacity-20" />
          
          <form
            onSubmit={handleSubmit}
            className="relative glass-panel rounded-2xl p-6 md:p-8 border border-primary/20 scanline"
          >
            {/* Honeypot - invisible spam trap */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] opacity-0"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Mission Selector */}
            <MissionSelector
              selectedMission={selectedMission}
              onSelectMission={setSelectedMission}
            />

            {/* Dynamic Form Fields */}
            {selectedMission && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
                className="mt-8 pt-8 border-t border-border"
              >
                <DynamicFormFields
                  mission={selectedMission}
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 btn-neon-filled flex items-center justify-center gap-2 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                  TRANSMIT TO NEXUS
                </motion.button>

                {/* Security Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground"
                >
                  <Shield className="w-3 h-3" />
                  <span className="font-display tracking-wide">
                    QUANTUM ENCRYPTED • SPAM PROTECTED
                  </span>
                </motion.div>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-6 font-display tracking-wide"
        >
          AUGMENTED FORM • THE PERSONALIZED ECHO • DIGITALIA NEXUS
        </motion.p>
      </motion.div>
    </div>
  );
};
