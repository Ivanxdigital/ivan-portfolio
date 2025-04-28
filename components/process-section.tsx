"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileSearch, Cpu, Upload } from "lucide-react";

const steps = [
  {
    icon: <FileSearch className="h-8 w-8 text-white" />,
    title: "Discovery",
    description: "We discuss your business needs, target audience, and goals to create a strategy that works for your market.",
  },
  {
    icon: <Cpu className="h-8 w-8 text-white" />,
    title: "Build (1-2 days)",
    description: "I design and develop your website with modern tools optimized for performance and SEO requirements.",
  },
  {
    icon: <Upload className="h-8 w-8 text-white" />,
    title: "Launch & Optimize",
    description: "After your review, I make adjustments, publish your site, and implement SEO strategies to attract your target customers.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Website <span className="gradient-text">Development Process</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A streamlined approach to deliver high-quality websites efficiently
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="flex relative mb-16 last:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1] // Custom easing for smooth feel
              }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute top-16 left-7 w-[2px] gradient-bg origin-top"
                  initial={{ height: 0 }}
                  whileInView={{ height: "calc(100%+4rem)" }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2 + 0.3,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                />
              )}

              <motion.div
                className="rounded-full gradient-bg p-4 mr-6 h-16 w-16 flex items-center justify-center shrink-0 z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.2 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {step.icon}
                </motion.div>
              </motion.div>

              <motion.div
                className="pt-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.4,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}