"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Ivan delivered a stunning website that perfectly captures our brand identity. The quick turnaround time was impressive!",
    author: "Sarah Johnson",
    company: "Bloom Boutique",
  },
  {
    quote: "Working with Ivan was effortless. He understood exactly what we needed and delivered beyond our expectations in record time.",
    author: "Michael Chen",
    company: "Tech Innovations",
  },
  {
    quote: "Our landing page conversion rate increased by 45% after Ivan redesigned it. Worth every penny!",
    author: "Alicia Rodriguez",
    company: "Growth Marketing",
  },
  {
    quote: "The dashboard Ivan created made our internal operations so much more efficient. His attention to detail is remarkable.",
    author: "David Kim",
    company: "Streamline Solutions",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it — hear from satisfied clients
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -top-8 left-10 text-primary opacity-20">
              <Quote size={80} />
            </div>
            
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/30 bg-card/30 backdrop-blur-sm p-8 rounded-2xl">
                <CardContent className="p-0">
                  <p className="text-xl md:text-2xl font-medium mb-8 italic relative z-10">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  <div>
                    <p className="font-bold text-lg">{testimonials[currentIndex].author}</p>
                    <p className="text-muted-foreground">{testimonials[currentIndex].company}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-center mt-8 gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prevTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === index ? "w-6 gradient-bg" : "w-2 bg-muted"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}