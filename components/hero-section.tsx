"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Eye } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col space-y-6"
          >
            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Modern <span className="gradient-text">Websites</span> <br />
              Delivered in <span className="gradient-text">48h</span>.
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg md:text-xl text-foreground/80 max-w-lg"
            >
              Affordable, professional websites for businesses.
              Complete setup with hosting, domain, and SEO optimization.
            </motion.p>

            <motion.div
              variants={item}
              className="flex items-center gap-3 mt-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-foreground/70">Fast delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-foreground/70">Professional design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-foreground/70">Responsive support</span>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button className="gradient-bg gap-2" size="lg">
                <Phone size={18} />
                Book a Free Consultation
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Eye size={18} />
                View Projects
              </Button>
            </motion.div>
          </motion.div>

          {/* Ivan's cutout image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{
                scale: 1,
                y: [0, -5, 0, 5, 0] // Subtle floating animation
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                y: {
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
              className="relative w-full max-w-md mx-auto flex items-center justify-center"
            >
              <div className="relative">
                <Image
                  src="/images/ivan-cutout.png"
                  alt="Ivan Infante - Web Developer"
                  width={400}
                  height={400}
                  priority
                  className="object-cover rounded-full ring-4 ring-primary/30 shadow-2xl shadow-primary/20"
                  style={{ objectPosition: "center" }}
                />

                {/* Enhanced glow effect behind the image */}
                <div
                  className="absolute inset-0 -z-10 opacity-70 blur-3xl"
                  style={{
                    background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.6) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 80%)",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
