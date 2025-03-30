"use client";
import React from "react";
import Link from "next/link"; // or <a> if not using Next.js

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section: 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Brand / About */}
          <div>
            <h2 className="text-white text-xl font-bold mb-2">SwagAR</h2>
            <p className="text-sm">
              Elevate your style with cutting-edge AR, AI sizing,
              and hyper-realistic 3D clothing models.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Quick Links
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/virtual-tryon" className="hover:text-white">
                  Virtual Try-On
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social / Extra Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Follow Us
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-700 pt-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm">
            © {new Date().getFullYear()} SwagAR. All rights reserved.
          </p>
          <p className="text-xs mt-2 sm:mt-0 text-gray-500">
            Powered by next-gen tech, delivered with style.
          </p>
        </div>
      </div>
    </footer>
  );
}
