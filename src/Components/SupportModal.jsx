import { useEffect, useRef } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Package,
  RotateCcw,
  Shield,
  Wrench,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { ScrollArea } from "@/Components/UI/scroll-area";

const SupportModal = ({ isOpen, onClose, initialSection }) => {
  const modalRef = useRef(null);
  const sectionsRef = useRef({
    "help-center": null,
    "shipping-info": null,
    "returns-exchanges": null,
    warranty: null,
    "installation-guide": null,
    "contact-us": null,
  });

  useEffect(() => {
    if (isOpen && initialSection && sectionsRef.current[initialSection]) {
      setTimeout(() => {
        sectionsRef.current[initialSection]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-n-background border rounded-lg shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Support Center</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-n-muted_foreground hover:text-n-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="h-[calc(90vh-80px)]">
          <div className="p-6 space-y-12">
            {/* Help Center */}
            <section
              ref={(el) => (sectionsRef.current["help-center"] = el)}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-n-primary" />
                <h3 className="text-xl font-semibold">Help Center</h3>
              </div>
              <div className="space-y-4 text-n-muted_foreground">
                <p>
                  Welcome to LUMIRA's comprehensive help center. Find answers to
                  common questions and get the support you need.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-n-foreground mb-2">
                      Frequently Asked Questions
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• How do I choose the right bulb for my lamp?</li>
                      <li>
                        • What is the warranty period for LUMIRA products?
                      </li>
                      <li>• How do I clean my lighting fixtures?</li>
                      <li>• Can I return a product if I'm not satisfied?</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-n-foreground mb-2">
                      Product Guides
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Smart lighting setup tutorials</li>
                      <li>• Dimmer compatibility guide</li>
                      <li>• Energy efficiency tips</li>
                      <li>• Style and design recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section
              ref={(el) => (sectionsRef.current["shipping-info"] = el)}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-n-primary" />
                <h3 className="text-xl font-semibold">Shipping Information</h3>
              </div>
              <div className="space-y-4 text-n-muted_foreground">
                <p>
                  We offer fast and reliable shipping options to get your LUMIRA
                  products to you quickly and safely.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-n-foreground mb-2">
                      Standard Shipping
                    </h4>
                    <p className="text-sm">5-7 business days</p>
                    <p className="text-sm">Free on orders over $75</p>
                    <p className="text-sm font-medium">$8.99</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-n-foreground mb-2">
                      Express Shipping
                    </h4>
                    <p className="text-sm">2-3 business days</p>
                    <p className="text-sm">Expedited handling</p>
                    <p className="text-sm font-medium">$19.99</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-n-foreground mb-2">
                      Overnight
                    </h4>
                    <p className="text-sm">Next business day</p>
                    <p className="text-sm">Premium service</p>
                    <p className="text-sm font-medium">$39.99</p>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-n-foreground mb-2">
                    Important Notes
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Orders placed before 2 PM EST ship the same day</li>
                    <li>
                      • Large or fragile items may require special handling
                    </li>
                    <li>
                      • International shipping available (additional fees apply)
                    </li>
                    <li>• Tracking information provided for all orders</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Returns & Exchanges */}
            <section
              ref={(el) => (sectionsRef.current["returns-exchanges"] = el)}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <RotateCcw className="h-6 w-6 text-n-primary" />
                <h3 className="text-xl font-semibold">Returns & Exchanges</h3>
              </div>
              <div className="space-y-4 text-n-muted_foreground">
                <p>
                  We want you to be completely satisfied with your LUMIRA
                  purchase. Our flexible return policy makes it easy to exchange
                  or return items.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-n-foreground mb-3">
                      Return Policy
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 30-day return window from delivery date</li>
                      <li>
                        • Items must be in original condition and packaging
                      </li>
                      <li>• Original receipt or order confirmation required</li>
                      <li>• Free return shipping on defective items</li>
                      <li>
                        • Customer pays return shipping for changes of mind
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-n-foreground mb-3">
                      Exchange Process
                    </h4>
                    <ol className="space-y-2 text-sm">
                      <li>1. Contact our support team</li>
                      <li>2. Receive return authorization and label</li>
                      <li>3. Package item securely</li>
                      <li>4. Ship using provided label</li>
                      <li>5. Receive replacement or refund</li>
                    </ol>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-n-primary bg-n-primary/5">
                  <p className="font-medium text-n-foreground">
                    Need to start a return?
                  </p>
                  <p className="text-sm mt-1">
                    Contact our support team at returns@lumira.com or call (555)
                    123-4567
                  </p>
                </div>
              </div>
            </section>

            {/* Warranty */}
            <section
              ref={(el) => (sectionsRef.current["warranty"] = el)}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-n-primary" />
                <h3 className="text-xl font-semibold">Warranty Information</h3>
              </div>
              <div className="space-y-4 text-n-muted_foreground">
                <p>
                  LUMIRA stands behind the quality of our products with
                  comprehensive warranty coverage.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-n-foreground mb-2">
                      Standard Lamps
                    </h4>
                    <p className="text-lg font-bold text-n-primary">2 Years</p>
                    <p className="text-sm">Manufacturing defects</p>
                    <p className="text-sm">Electrical components</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-n-foreground mb-2">
                      Smart Lighting
                    </h4>
                    <p className="text-lg font-bold text-n-primary">3 Years</p>
                    <p className="text-sm">Electronic components</p>
                    <p className="text-sm">Software support</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-n-foreground mb-2">
                      Premium Collection
                    </h4>
                    <p className="text-lg font-bold text-n-primary">5 Years</p>
                    <p className="text-sm">Full coverage</p>
                    <p className="text-sm">White-glove service</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-n-foreground">
                    Warranty Coverage Includes:
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-1 text-sm">
                    <li>• Manufacturing defects in materials</li>
                    <li>• Electrical component failures</li>
                    <li>• Finish and coating issues</li>
                    <li>• Smart features and connectivity</li>
                    <li>• Dimming functionality problems</li>
                    <li>• Structural integrity issues</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-n-foreground mb-2">
                    To Claim Warranty
                  </h4>
                  <p className="text-sm">
                    Email warranty@lumira.com with your order number, photos of
                    the issue, and a description of the problem. Our team will
                    respond within 24 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* Installation Guide */}
            <section
              ref={(el) => (sectionsRef.current["installation-guide"] = el)}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <Wrench className="h-6 w-6 text-n-primary" />
                <h3 className="text-xl font-semibold">Installation Guide</h3>
              </div>
              <div className="space-y-4 text-n-muted_foreground">
                <p>
                  Professional installation tips and safety guidelines for your
                  LUMIRA lighting products.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-n-foreground mb-3">
                      Before You Begin
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Turn off power at the circuit breaker</li>
                      <li>• Gather necessary tools and hardware</li>
                      <li>• Read all instructions completely</li>
                      <li>• Check that all parts are included</li>
                      <li>• Have a helper for heavy fixtures</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-n-foreground mb-3">
                      Safety First
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Use a voltage tester to confirm power is off</li>
                      <li>• Wear safety glasses and gloves</li>
                      <li>• Use proper ladder or step stool</li>
                      <li>• Don't exceed fixture weight limits</li>
                      <li>• When in doubt, hire a professional</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-n-foreground">
                    Installation Types
                  </h4>
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium text-n-foreground mb-2">
                        Table & Floor Lamps
                      </h5>
                      <p className="text-sm">
                        Simply plug into outlet. Ensure stable surface and
                        proper bulb wattage.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium text-n-foreground mb-2">
                        Pendant & Ceiling Fixtures
                      </h5>
                      <p className="text-sm">
                        Requires electrical connection. Mount to ceiling box
                        rated for fixture weight.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium text-n-foreground mb-2">
                        Smart Lighting
                      </h5>
                      <p className="text-sm">
                        Follow app setup instructions after physical
                        installation. Ensure Wi-Fi connectivity.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="font-medium text-n-foreground">
                    Professional Installation Available
                  </p>
                  <p className="text-sm mt-1">
                    Contact us to schedule professional installation service in
                    your area. Additional fees may apply.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section
              ref={(el) => (sectionsRef.current["contact-us"] = el)}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-n-primary" />
                <h3 className="text-xl font-semibold">Contact Us</h3>
              </div>
              <div className="space-y-6 text-n-muted_foreground">
                <p>
                  Get in touch with our customer support team. We're here to
                  help with any questions or concerns.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Phone className="h-8 w-8 text-n-primary mx-auto mb-3" />
                    <h4 className="font-medium text-n-foreground mb-2">
                      Phone Support
                    </h4>
                    <p className="text-sm">+1 (555) 123-4567</p>
                    <p className="text-sm">Mon-Fri: 9AM-7PM EST</p>
                    <p className="text-sm">Sat: 10AM-4PM EST</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Mail className="h-8 w-8 text-n-primary mx-auto mb-3" />
                    <h4 className="font-medium text-n-foreground mb-2">
                      Email Support
                    </h4>
                    <p className="text-sm">hello@lumira.com</p>
                    <p className="text-sm">Response within 24 hours</p>
                    <p className="text-sm">
                      Include order # for faster service
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <MapPin className="h-8 w-8 text-n-primary mx-auto mb-3" />
                    <h4 className="font-medium text-n-foreground mb-2">
                      Visit Our Showroom
                    </h4>
                    <p className="text-sm">123 Design Avenue</p>
                    <p className="text-sm">New York, NY 10001</p>
                    <p className="text-sm">Mon-Sat: 10AM-6PM</p>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-n-primary/10 to-n-primary/5 rounded-lg">
                  <h4 className="font-medium text-n-foreground mb-3">
                    Live Chat Available
                  </h4>
                  <p className="text-sm mb-4">
                    Get instant help from our support team during business
                    hours.
                  </p>
                  <Button className="bg-n-primary text-n-primary_foreground hover:bg-primary/90">
                    Start Live Chat
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SupportModal;
