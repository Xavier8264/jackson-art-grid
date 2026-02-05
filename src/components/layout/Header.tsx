import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/search/GlobalSearch";

const navLinks = [
  { label: "Calendar", path: "/calendar" },
  { label: "Map", path: "/map" },
  { label: "Gallery", path: "/gallery" },
  { label: "Artists", path: "/artists" },
  { label: "Venues", path: "/venues" },
  { label: "Live", path: "/live" },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 relative">
        {/* Logo & Branding */}
        <Link to="/" className="flex flex-col items-start flex-shrink-0">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Hub for the Arts
          </span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            Jackson, TN
          </span>
        </Link>

        {/* Desktop Navigation - Centered absolutely relative to page */}
        <nav className="hidden items-center gap-1 md:flex absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search & Mobile Menu - Right Aligned with padding to match left */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Desktop Search */}
          <div className={cn(
            "hidden transition-all duration-200 md:block",
            searchOpen ? "w-80" : "w-10"
          )}>
            {searchOpen ? (
              <div className="relative">
                <GlobalSearch 
                  className="w-full" 
                  onResultClick={() => setSearchOpen(false)} 
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                  style={{ right: '2.5rem' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search - Full Width */}
      {searchOpen && (
        <div className="border-t bg-background px-4 py-3 md:hidden">
          <GlobalSearch 
            className="w-full" 
            onResultClick={() => setSearchOpen(false)} 
          />
        </div>
      )}

      {/* Tagline - Desktop */}
      <div className="hidden border-t bg-muted/30 py-1 text-xs text-muted-foreground md:block">
        <div className="container text-center">
          Designed for Jackson. Built for the E+ Broadband Fiber Optic Network.
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="container flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors rounded-md",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t bg-muted/30 py-2 text-xs text-muted-foreground">
            <div className="container text-center">
              Designed for Jackson. Built for the E+ Broadband Fiber Optic Network.
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
