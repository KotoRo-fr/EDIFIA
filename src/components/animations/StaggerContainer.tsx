import { motion } from 'framer-motion';
import React from 'react';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  staggerDelay = 0.1,
}) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    initial="hidden"
    animate="show"
  >
    {React.Children.map(children, (child) => (
      <motion.div variants={itemVariants}>{child}</motion.div>
    ))}
  </motion.div>
);

export default StaggerContainer;
