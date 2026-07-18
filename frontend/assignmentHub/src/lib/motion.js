// Shared framer-motion variants so every page animates consistently
// without redefining the same transitions everywhere.

// Applied to each page's root <motion.main> — a gentle fade + rise on mount.
export const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// Applied to a grid/list wrapper so its children (cards) animate in one
// after another instead of all at once.
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

// Applied to each card/item inside a staggerContainer.
export const staggerItem = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
