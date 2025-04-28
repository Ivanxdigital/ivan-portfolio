"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo-2-transparent.png"
                alt="Ivan Infante Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-muted-foreground max-w-md">
              Creating modern, affordable websites with complete setup including hosting, domain, and SEO optimization for your business needs.
            </p>
            <p className="text-muted-foreground max-w-md mt-4">
              <strong>Location:</strong> Manila, Philippines<br />
              <strong>Email:</strong> contact@yourwebsite.com<br />
              <strong>Phone:</strong> +63 912 345 6789
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</Link></li>
              <li><Link href="#work" className="text-muted-foreground hover:text-foreground transition-colors">Projects</Link></li>
              <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={20} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="mailto:contact@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/10 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Ivan Infante. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}