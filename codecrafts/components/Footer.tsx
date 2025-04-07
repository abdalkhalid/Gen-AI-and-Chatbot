const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="bg-gray-800 text-white p-6 mt-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Logo Section */}
          <div className="mb-4 md:mb-0">
            <img 
              src="/logo.png" 
              alt="MyWebsite Logo" 
              className="h-10 w-auto"
            />
          </div>
          
          {/* Copyright and Links */}
          <div className="text-center md:text-right text-sm">
            <p>&copy; {currentYear} MyWebsite. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer; 