import { Link } from "@tanstack/react-router";
import { Activity, Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";

// ── Update these with your real clinic details ──
const CLINIC_PHONE = "+00 000 000 0000";
const CLINIC_EMAIL = "info@physioclinic.com";
const CLINIC_ADDRESS = "123 Wellness Street, City";
const SOCIAL = {
  instagram: "https://www.instagram.com/mitkoriya/",   // replace with real URL
  facebook: "#",
  linkedin: "https://www.linkedin.com/in/meet-koriya-161931325/",
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Activity className="h-5 w-5" strokeWidth={2.5} />
              </span>
              PhysioLife Clinic
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Expert physiotherapy care. Helping you move freely, live fully.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { Icon: Instagram, href: SOCIAL.instagram, label: "Instagram" },
                { Icon: Facebook, href: SOCIAL.facebook, label: "Facebook" },
                { Icon: Linkedin, href: SOCIAL.linkedin, label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-background text-primary shadow-card transition-transform hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/services" className="hover:text-primary">Services</Link></li>
              <li><Link to="/blog" className="hover:text-primary">Health Tips</Link></li>
              <li><Link to="/testimonials" className="hover:text-primary">Testimonials</Link></li>
              <li><Link to="/appointment" className="hover:text-primary">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Services quick links */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Services
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {[
                "Back & Neck Pain",
                "Sports Injury",
                "Post-Surgery Rehab",
                "Neurological Rehab",
                "Manual Therapy",
                "Home Visits",
              ].map((s) => (
                <li key={s}>
                  <Link to="/services" className="hover:text-primary">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                {CLINIC_ADDRESS}
              </li>
              <li>
                <a href={`tel:${CLINIC_PHONE.replace(/\s/g, "")}`} className="flex items-start gap-2 hover:text-primary">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  {CLINIC_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${CLINIC_EMAIL}`} className="flex items-start gap-2 hover:text-primary">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  {CLINIC_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} PhysioLife Clinic. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
