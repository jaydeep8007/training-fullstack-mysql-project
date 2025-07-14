const Footer = () => {
  return (
    <footer className="bg-background border-t border-border h-20 text-sm text-muted-foreground text-center shadow-inner flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <p>
          © 2025{" "}
          <span className="font-semibold text-foreground">JobPortal Admin</span>. All rights reserved.
        </p>
        <div className="mt-1 flex flex-wrap justify-center gap-4 text-xs">
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
          <a href="#" className="hover:text-primary transition-colors">Version 1.0.0</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
