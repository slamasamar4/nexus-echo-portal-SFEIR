import { motion, AnimatePresence } from "framer-motion";
import { MissionType } from "./MissionSelector";

interface FormData {
  name: string;
  email: string;
  message: string;
  donationAmount: string;
  recurrence: "one-time" | "monthly";
  skills: string;
  availability: string;
}

interface DynamicFormFieldsProps {
  mission: MissionType;
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

const fieldVariants = {
  hidden: { opacity: 0, x: -20, height: 0 },
  visible: { opacity: 1, x: 0, height: "auto" },
  exit: { opacity: 0, x: 20, height: 0 },
};

export const DynamicFormFields = ({ mission, formData, onChange, errors }: DynamicFormFieldsProps) => {
  const renderField = (
    name: keyof FormData,
    label: string,
    type: "text" | "email" | "textarea" | "number" | "select" = "text",
    placeholder?: string,
    options?: { value: string; label: string }[]
  ) => (
    <motion.div
      key={name}
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <label className="block text-sm font-display tracking-wide text-primary/80">
        {label}
      </label>
      
      {type === "textarea" ? (
        <textarea
          value={formData[name]}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="input-cyber resize-none"
        />
      ) : type === "select" && options ? (
        <select
          value={formData[name]}
          onChange={(e) => onChange(name, e.target.value)}
          className="input-cyber cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={formData[name]}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="input-cyber"
        />
      )}

      {errors[name] && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-destructive text-xs font-body"
        >
          {errors[name]}
        </motion.p>
      )}
    </motion.div>
  );

  const baseFields = (
    <>
      {renderField("name", "DESIGNATION", "text", "Enter your name...")}
      {renderField("email", "COMM LINK", "email", "your.email@nexus.io")}
    </>
  );

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {baseFields}
        
        {(mission === "contact" || mission === "info") && (
          renderField("message", "TRANSMISSION", "textarea", "Enter your message to the Nexus...")
        )}

        {mission === "donation" && (
          <>
            {renderField("donationAmount", "RESOURCE AMOUNT (€)", "number", "50")}
            {renderField("recurrence", "FREQUENCY", "select", undefined, [
              { value: "one-time", label: "One-Time Transfer" },
              { value: "monthly", label: "Monthly Cycle" },
            ])}
          </>
        )}

        {mission === "volunteer" && (
          <>
            {renderField("skills", "SKILL MATRIX", "textarea", "List your abilities and expertise...")}
            {renderField("availability", "TIME ALLOCATION", "text", "e.g., Weekends, 10h/week...")}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
