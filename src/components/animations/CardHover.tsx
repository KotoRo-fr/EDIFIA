import { motion } from 'framer-motion';
import React from 'react';

interface CardHoverProps {
  children: React.ReactNode;
  className?: string;
}

const CardHover: React.FC<CardHoverProps> = ({ children, className }) => (
  <motion.div
    className={className}
    whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default CardHover;
