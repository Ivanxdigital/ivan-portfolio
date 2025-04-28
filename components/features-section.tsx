"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, MessageSquare, Smartphone, Sparkles, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Staff Management",
    description: "Easily manage team members, permissions, and responsibilities.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Sales Analytics",
    description: "Track performance metrics with insightful visualization tools.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Contact Forms",
    description: "Engage visitors with interactive, user-friendly contact options.",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile-First",
    description: "Optimized for all devices with responsive, adaptive design.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI-Enhanced UX",
    description: "Intelligent features that improve user experience and engagement.",
  },
  {
    icon: <Repeat className="h-6 w-6" />,
    title: "Free Revisions",
    description: "Fine-tune your website until you're completely satisfied.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Features <span className="gradient-text">& Benefits</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a successful online presence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className={cn(
                "rounded-xl p-3 h-12 w-12 shrink-0 flex items-center justify-center",
                "bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10 text-primary",
              )}>
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}