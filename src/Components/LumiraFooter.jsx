import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Input } from "@/Components/UI/input";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = ({ onSupportClick }) => {
  return (
    <footer className="bg-n-primary text-n-primary_foreground w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Column */}
            <div className="space-y-6">
              <div>
                {/* <h3 className="text-2xl font-bold text-n-primary_foreground">
                  LUMIRA
                </h3> */}
                <Image
                  src={assets.LumiraLogoBlack}
                  alt="Lumira Logo"
                  className="w-40 h-auto"
                />
                <p className="text-n-primary_foreground/80 mt-4">
                  Illuminating homes with premium lighting solutions that blend
                  modern design with exceptional functionality.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-n-lumira_coral" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-n-lumira_coral" />
                  <span className="text-sm">hello@lumira.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-n-lumira_coral" />
                  <span className="text-sm">
                    Bahria Town Industrial Area, LHR 54700
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h4 className="font-semibold text-n-primary_foreground mb-6">
                Shop
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Study Lamps
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Floor Lamps
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Pendant Lights
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Table Lamps
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Smart Lighting
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Accessories
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4
                onClick={() => onSupportClick("help-center")}
                className="cursor-pointer font-semibold text-n-primary_foreground mb-6"
              >
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    onClick={() => onSupportClick("help-center")}
                    className="cursor-pointer text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => onSupportClick("shipping-info")}
                    className="cursor-pointer text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => onSupportClick("returns-exchanges")}
                    className="cursor-pointer text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => onSupportClick("warranty")}
                    className="cursor-pointer text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Warranty
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => onSupportClick("installation-guide")}
                    className="cursor-pointer text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Installation Guide
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => onSupportClick("contact-us")}
                    className="cursor-pointer text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 className="font-semibold text-n-primary_foreground mb-6">
                Stay Illuminated
              </h4>
              <p className="text-n-primary_foreground/80 mb-6">
                Subscribe to receive design tips, new arrivals, and exclusive
                offers.
              </p>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-n-primary_foreground/10 border-n-primary_foreground/20 text-n-primary_foreground placeholder:text-n-primary_foreground/60"
                  />
                  <Button variant="coral">Subscribe</Button>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 pt-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground hover:bg-n-primary_foreground/10"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground hover:bg-n-primary_foreground/10"
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground hover:bg-n-primary_foreground/10"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-n-primary_foreground/80 hover:text-n-primary_foreground hover:bg-n-primary_foreground/10"
                  >
                    <Youtube className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-n-primary_foreground/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-n-primary_foreground/80">
              © {new Date().getFullYear()} LUMIRA. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-n-primary_foreground/80 hover:text-n-primary_foreground transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
