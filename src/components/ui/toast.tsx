import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { IconButton } from "./icon-button";

export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4200);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          className="toast"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <span className="toast-check">
            <Check size={16} />
          </span>
          {message}
          <IconButton label="Dismiss notification" onClick={onClose}>
            <X size={15} />
          </IconButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}