"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "₱2k",
    description: "Perfect for single pages and small projects",
    features: [
      { name: "Single Page", included: true },
      { name: "Responsive Design", included: true },
      { name: "SEO Optimization", included: true },
      { name: "Contact Form", included: true },
      { name: "Social Media Integration", included: true },
      { name: "CMS Integration", included: false },
      { name: "Custom Functionality", included: false },
    ],
  },
  {
    name: "Pro",
    price: "Custom Quote",
    description: "For comprehensive websites with advanced features",
    features: [
      { name: "Multiple Pages", included: true },
      { name: "Responsive Design", included: true },
      { name: "SEO Optimization", included: true },
      { name: "Contact Form", included: true },
      { name: "Social Media Integration", included: true },
      { name: "CMS Integration", included: true },
      { name: "Custom Functionality", included: true },
    ],
    popular: true,
  },
];

export default function PricingSection() {
  // Animation variants for staggered feature animations
  const featureVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  // Card hover animation
  const cardHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent and competitive pricing options for every need
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <motion.div
                initial="initial"
                whileHover="hover"
                variants={cardHoverVariants}
                className="h-full"
              >
                <Card
                  className={`relative h-full min-h-[500px] sm:min-h-[520px] border-border/30
                    ${plan.popular
                      ? 'gradient-bg border-0 text-white'
                      : 'bg-secondary/20 shadow-inner'}
                    backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 px-3 py-1 font-medium shadow-md">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="space-y-0 pb-3">
                    <CardTitle className="text-2xl mb-0">{plan.name}</CardTitle>
                    <div className="mt-0">
                      <span className="text-3xl font-bold">{plan.price}</span>
                    </div>
                    <CardDescription className={plan.popular ? 'text-white/80' : ''}>
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature.name}
                          className="flex items-center"
                          custom={featureIndex}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={featureVariants}
                        >
                          {feature.included ? (
                            <Check className="h-5 w-5 mr-2 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 mr-2 text-red-500" />
                          )}
                          <span className={`${plan.popular && !feature.included ? 'text-white/70' : ''}`}>
                            {feature.name}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pb-6">
                    <motion.div
                      className="w-full"
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300'
                            : 'gradient-bg hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300'
                        }`}
                      >
                        Get Started
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}