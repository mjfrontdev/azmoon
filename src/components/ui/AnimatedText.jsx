import React from 'react'
import { motion } from 'framer-motion'

const AnimatedText = ({ 
  text, 
  className = '', 
  delay = 0, 
  duration = 0.5,
  stagger = 0.1,
  type = 'words' // 'words', 'letters', 'lines'
}) => {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay }
    })
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: duration
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: duration
      }
    }
  }

  const splitText = () => {
    if (type === 'letters') {
      return text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))
    } else if (type === 'words') {
      return text.split(' ').map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block ml-1"
        >
          {word}
        </motion.span>
      ))
    } else {
      return text.split('\n').map((line, index) => (
        <motion.div
          key={index}
          variants={child}
          className="block"
        >
          {line}
        </motion.div>
      ))
    }
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {splitText()}
    </motion.div>
  )
}

export default AnimatedText
