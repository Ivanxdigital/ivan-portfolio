"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Globe, LayoutDashboard, Phone, Eye, ArrowLeft, ArrowRight, RefreshCw, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import Image from "next/image";

// Images for the carousel
const carouselImages = [
  "/images/dashboard.png",
  "/images/siargaorides-homepage.png",
  "/images/siargao-weather-app.png",
];

// Browser Frame with Image Carousel Component
function BrowserFrameCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Set loaded state after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Auto-cycle through images
  useEffect(() => {
    if (isPaused) return;

    // Add a delay before starting the carousel
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        // Start transition animation
        setIsTransitioning(true);

        // Change image after a short delay
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) =>
            prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
          );

          // End transition animation after image has changed
          setTimeout(() => {
            setIsTransitioning(false);
          }, 1000);
        }, 700);
      }, 8000); // Change image every 8 seconds (slower transition)

      return () => clearInterval(interval);
    }, 2000); // Delay before starting carousel

    return () => clearTimeout(startDelay);
  }, [isPaused]);

  // Image titles for the URL bar
  const imageTitles = [
    "dashboard-analytics-platform",
    "siargao-rides-booking-website",
    "siargao-weather-tides-app"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Browser Frame */}
      <motion.div
        className="w-full rounded-xl overflow-hidden border border-gray-200 bg-white"
        initial={{ scale: 0.92, rotateX: 5, rotateY: -5 }}
        whileInView={{
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          transition: {
            duration: 1,
            ease: "easeOut",
          }
        }}
        viewport={{ once: true }}
        whileHover={{
          scale: 1.01,
          rotateX: -1,
          rotateY: 1,
          transition: { duration: 0.4 }
        }}
      >
        {/* Browser Header */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center">
          {/* Window Controls */}
          <div className="flex space-x-2 mr-4">
            <motion.div
              className="w-3 h-3 rounded-full bg-red-500 shadow-inner"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.3 }}
            ></motion.div>
            <motion.div
              className="w-3 h-3 rounded-full bg-yellow-500 shadow-inner"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.3 }}
            ></motion.div>
            <motion.div
              className="w-3 h-3 rounded-full bg-green-500 shadow-inner"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.3 }}
            ></motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-3 mr-4 text-gray-400">
            <button className="hover:text-gray-600 transition-colors">
              <ArrowLeft size={14} />
            </button>
            <button className="hover:text-gray-600 transition-colors">
              <ArrowRight size={14} />
            </button>
            <button className="hover:text-gray-600 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>

          {/* URL Bar */}
          <motion.div
            className="flex-1 bg-white rounded-md py-1.5 px-3 flex items-center text-xs text-gray-600 border border-gray-200 group"
            initial={{ width: "60%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Lock size={12} className="mr-2 text-green-600" />
            <div className="flex items-center overflow-hidden">
              <span className="text-gray-400 mr-1">https://</span>
              <span className="font-medium text-gray-700">yourwebsite.com/</span>
              <motion.span
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-blue-500 truncate"
              >
                {imageTitles[currentImageIndex]}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Browser Content - Image Carousel */}
        <div className="relative w-full aspect-[16/10] md:aspect-[16/9] bg-gray-50 overflow-hidden">
          {/* Loading Progress Bar - Only shows during transitions */}
          {isTransitioning && (
            <motion.div
              className="absolute top-0 left-0 h-0.5 bg-blue-500 z-10"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}

          {/* Image Carousel */}
          <div className="relative w-full h-full">
            {carouselImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                  opacity: index === currentImageIndex ? 1 : 0,
                  scale: index === currentImageIndex ? 1 : 1.05,
                  transition: { duration: 0.7, ease: "easeInOut" }
                }}
                className="absolute inset-0"
              >
                <Image
                  src={src}
                  alt={`Project screenshot ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                  className="object-contain"
                  style={{ objectPosition: "center top" }}
                />

                {/* Subtle Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50" />
              </motion.div>
            ))}
          </div>

          {/* Pause/Play Indicator - Only shows when hovered */}
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm"
            >
              Paused
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const services = [
  {
    icon: <Globe className="h-16 w-16 text-white" />,
    title: "Business Website",
    description: "Complete website solution with local SEO, multilingual content options, and mobile optimization for optimal performance on all devices.",
    recommended: false,
  },
  {
    icon: <Monitor className="h-16 w-16 text-white" />,
    title: "Landing Page",
    description: "High-converting single page designed to showcase services and drive customer action. Optimized for search engines and conversions.",
    recommended: true,
  },
  {
    icon: <LayoutDashboard className="h-16 w-16 text-white" />,
    title: "Custom Dashboard",
    description: "User-friendly admin interfaces to manage inventory, sales, and customer data with local payment integration options.",
    recommended: false,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional <span className="gradient-text">Web Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Affordable web solutions tailored for your business needs
          </p>
        </div>

        {/* Top Section - Services (3-column grid) */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <Card
                  className="relative w-full max-w-[400px] border-border/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:scale-105 rounded-2xl overflow-hidden shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
                  }}
                >
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.05) 70%, transparent 100%)",
                    }}
                  />

                  {service.recommended && (
                    <div className="absolute top-3 right-3 z-10">
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 6
                        }}
                      >
                        <Badge variant="default" className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-xs shadow-md">
                          Recommended
                        </Badge>
                      </motion.div>
                    </div>
                  )}

                  <CardHeader className="pb-1 pt-5">
                    <motion.div
                      className="flex justify-center mb-4"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="h-16 w-16 rounded-full gradient-bg flex items-center justify-center shadow-lg">
                        {service.icon}
                      </div>
                    </motion.div>
                    <CardTitle className="text-xl text-center">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-5 pt-1">
                    <CardDescription className="text-muted-foreground text-sm text-center">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Browser Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full max-w-[95%] lg:max-w-[90%] mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="shadow-2xl rounded-xl"
          >
            <BrowserFrameCarousel />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}