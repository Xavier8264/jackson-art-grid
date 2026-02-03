import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/30 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hub for the Arts · Jackson, TN
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Digital civic infrastructure for the arts
          </p>
        </div>
      </footer>
    </div>
  );
}
