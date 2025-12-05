import { motion, AnimatePresence } from "framer-motion";

interface AICompanionTooltipProps {
  isVisible: boolean;
  message: string;
  position?: "top" | "bottom";
}

export const AICompanionTooltip = ({
  isVisible,
  message,
  position = "top",
}: AICompanionTooltipProps) => {
  const isTop = position === "top";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: isTop ? -10 : 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isTop ? -10 : 10, scale: 0.9 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            scale: { duration: 0.25 },
          }}
          className={`absolute ${isTop ? "-top-2 -translate-y-full" : "-bottom-2 translate-y-full"} left-4 right-4 z-10 pointer-events-none`}
        >
          {/* Arrow pointer */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="flex justify-center"
          >
            <div
              className={`w-0 h-0 ${
                isTop
                  ? "border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-secondary/50"
                  : "border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-secondary/50"
              }`}
            ></div>
          </motion.div>

          {/* Tooltip content */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.25 }}
            className="glass-panel border border-secondary/50 rounded-lg p-3 backdrop-blur-md shadow-lg shadow-secondary/20"
            style={{ marginTop: isTop ? "0.5rem" : "0", marginBottom: isTop ? "0" : "0.5rem" }}
          >
            <div className="flex items-start gap-2">
              {/* AI Companion Icon */}
              <motion.span
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ delay: 0.1, duration: 0.3, type: "spring", stiffness: 200 }}
                className="text-secondary text-sm flex-shrink-0"
              >
                🤖
              </motion.span>

              {/* Message text */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <p className="text-xs text-secondary italic font-medium leading-relaxed">
                  {message}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
