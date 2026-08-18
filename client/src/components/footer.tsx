import { Calendar, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { categories } from "@shared/schema";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2" data-testid="link-footer-home">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-xl text-foreground">EventHub</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover and host unforgettable events. Connect with your community through experiences that matter.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-events">
                  All Events
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-create">
                  Create Event
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-dashboard">
                  Organizer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 4).map((category) => (
                <li key={category}>
                  <Link
                    href={`/events?category=${encodeURIComponent(category)}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-category-${category.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:hello@eventhub.com" className="hover:text-foreground transition-colors" data-testid="link-footer-email">
                  hello@eventhub.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
            © {year} EventHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
