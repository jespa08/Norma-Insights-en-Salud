import { Logo } from "@/components/icons/logo";

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-card">
      <div className="container mx-auto">
        <Logo />
      </div>
    </header>
  );
}
