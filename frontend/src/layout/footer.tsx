const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-950  to-slate-950 border-t border-slate-700 py-4  text-sm text-slate-300 text-center">
      <div className="max-w-7xl mx-auto px-4">
        <p>
          © 2025 <span className="font-semibold text-white">JobPortal Admin</span>. All rights reserved.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
          <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition">Support</a>
          <a href="#" className="hover:text-blue-400 transition">Version 1.0.0</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
