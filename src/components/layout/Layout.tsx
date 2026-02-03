import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-primary/10 bg-gradient-to-b from-sky-light/20 to-background py-8">
        <div className="container text-center">
          <p className="text-sm text-foreground">
            © {new Date().getFullYear()} Hub for the Arts · <span className="text-primary">Jackson, TN</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Digital civic infrastructure for the arts
          </p>
        </div>
      </footer>
    </div>
  );
}
