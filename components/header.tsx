"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { name: "Services", path: "#services" },
  { name: "Work", path: "#work" },
  { name: "Pricing", path: "#pricing" },
  { name: "Contact", path: "#contact" },
  { name: "Style Tool", path: "/style-recommender" },
];

export default function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md py-3 shadow-md"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-2-transparent.png"
            alt="Ivan Infante Logo"
            width={40}
            height={40}
            className="h-8 w-auto md:h-10"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => {
            // Check if this is the active link - exact match for style-recommender, startsWith for others
            const isActive =
              item.path.startsWith('/')
                ? pathname === item.path
                : pathname === '/' && item.path.startsWith('#');

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`transition-colors font-medium ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Button className="gradient-bg ml-2">Get a Site</Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-6 mt-10">
              {navItems.map((item) => {
                // Check if this is the active link - exact match for style-recommender, startsWith for others
                const isActive =
                  item.path.startsWith('/')
                    ? pathname === item.path
                    : pathname === '/' && item.path.startsWith('#');

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`transition-colors font-medium text-lg ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Button className="gradient-bg w-full">Get a Site</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}