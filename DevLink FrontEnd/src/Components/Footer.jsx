const Footer = () => {
  return (
    <footer className="px-8 py-6 border-t border-white/10 bg-white/5 backdrop-blur-xl text-gray-400 flex justify-between items-center">
      <p>
        DevLink © {new Date().getFullYear()} — All rights reserved
      </p>
      <div className="flex gap-4">
        <span className="hover:text-white cursor-pointer">Twitter</span>
        <span className="hover:text-white cursor-pointer">YouTube</span>
        <span className="hover:text-white cursor-pointer">Facebook</span>
      </div>
    </footer>
  );
};

export default Footer;