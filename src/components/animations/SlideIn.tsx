import { motion } from 'framer-motion';
import React from 'react';

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

const slideVariants = {
  left: { x: -60, y: 0 },
  right: { x: 60, y: 0 },
  top: { x: 0, y: -60 },
  bottom: { x: 0, y: 60 },
};

const SlideIn: React.FC<SlideInProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.4,
  direction = 'right',
}) => {
  const offset = slideVariants[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
