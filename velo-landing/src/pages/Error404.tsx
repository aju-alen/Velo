import React from 'react';
import { Home, ArrowLeft, Package, Search, MapPin, Phone } from 'lucide-react';

const Error404 = () => {
  const quickLinks = [
    {
      icon: Home,
      title: "Home",
      description: "Return to our main page",
      href: "/"
    },
    {
      icon: Package,
      title: "Services",
      description: "Explore our shipping solutions",
      href: "#services"
    },
    {
      icon: Search,
      title: "Track Package",
      description: "Track your shipment status",
      href: "#tracking"
    },
    {
      icon: Phone,
      title: "Contact Us",
      description: "Get in touch with our team",
      href: "#contact"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-black">VELO</span>
                <div className="text-xs text-gray-600 font-medium tracking-wide">INTERNATIONAL SHIPPING</div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-black transition-colors font-medium">Services</a>
              <a href="#solutions" className="text-gray-700 hover:text-black transition-colors font-medium">Solutions</a>
              <a href="#about" className="text-gray-700 hover:text-black transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-black transition-colors font-medium">Contact</a>
            </nav>
            <button className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 404 Section */}
          <section className="text-center py-20">
            <div className="max-w-3xl mx-auto">
              {/* 404 Number */}
              <div className="mb-8">
                <h1 className="text-9xl font-bold text-gray-200 leading-none">404</h1>
                <div className="w-24 h-1 bg-[#FFAC1C] mx-auto mt-4"></div>
              </div>

              {/* Main Message */}
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-black mb-4">
                  Page Not Found
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  The page you're looking for seems to have been shipped to a different destination. 
                  Don't worry, we'll help you navigate back to the right place.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button 
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </button>
                <a 
                  href="/"
                  className="inline-flex items-center justify-center border-2 border-black text-black px-8 py-4 rounded-lg hover:bg-black hover:text-white transition-colors text-lg font-semibold"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </a>
              </div>
            </div>
          </section>

          {/* Quick Links Section */}
          <section className="py-16 bg-gray-50 rounded-2xl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-black mb-4">
                  Quick Navigation
                </h3>
                <p className="text-lg text-gray-600">
                  Find what you're looking for with these helpful links
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#FFAC1C] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-[#FFAC1C]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FFAC1C] transition-colors">
                      <link.icon className="w-6 h-6 text-[#FFAC1C] group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-lg font-semibold text-black mb-2">
                      {link.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {link.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Help Section */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-black mb-4">
                Need Help?
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Our customer support team is here to help you find what you're looking for
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#FFAC1C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-[#FFAC1C]" />
                  </div>
                  <h4 className="text-lg font-semibold text-black mb-2">Call Us</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#FFAC1C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-[#FFAC1C]" />
                  </div>
                  <h4 className="text-lg font-semibold text-black mb-2">Visit Us</h4>
                  <p className="text-gray-600">123 Shipping St, Logistics City</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#FFAC1C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-[#FFAC1C]" />
                  </div>
                  <h4 className="text-lg font-semibold text-black mb-2">Track Package</h4>
                  <p className="text-gray-600">Enter your tracking number</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="text-2xl font-bold">VELO</span>
                <div className="text-xs text-gray-400 font-medium tracking-wide">INTERNATIONAL SHIPPING</div>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Professional shipping solutions for individuals and businesses worldwide
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Velo International Shipping. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Error404;