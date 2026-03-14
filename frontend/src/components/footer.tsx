'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Briefcase,
  Camera,
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    {
      title: 'Features',
      links: [
        { name: 'Jobs', href: '/jobs' },
        { name: 'Scholarships', href: '/scholarships' },
        { name: 'Exams', href: '/exams' },
        { name: 'Community', href: '/community' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Learning Resources', href: '/resources' },
        { name: 'Alumni Network', href: '/alumni' },
        { name: 'Institutions', href: '/institutions' },
        { name: 'AI Assistant', href: '/ai' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Support', href: '/support' },
        { name: 'Join Us', href: '/join' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="USG India" width={32} height={32} className="rounded-lg object-contain bg-white" />
              <span className="font-bold text-lg text-white">USG India</span>
            </div>
            <p className="text-sm text-slate-400">
              Empowering students and institutions with advanced educational
              technology and career opportunities.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                title="Facebook"
              >
                <Globe className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                title="Twitter"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                title="LinkedIn"
              >
                <Briefcase className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                title="Instagram"
              >
                <Camera className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          {navigationLinks.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wide mb-4">
            Contact Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-white">Email</p>
                <Link
                  href="mailto:support@usgindia.com"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                  support@usgindia.com
                </Link>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-white">Phone</p>
                <Link
                  href="tel:+911234567890"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                  +91 123-456-7890
                </Link>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-white">Address</p>
                <p className="text-sm text-slate-400">
                  New Delhi, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {currentYear} USG India. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
