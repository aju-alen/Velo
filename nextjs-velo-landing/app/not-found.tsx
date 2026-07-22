import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Package, Search, MapPin, Phone } from 'lucide-react';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Page Not Found - Velo Shipping',
};

export default function NotFound() {
  const quickLinks = [
    {
      icon: Home,
      title: 'Home',
      description: 'Return to our main page',
      href: '/',
    },
    {
      icon: Package,
      title: 'Services',
      description: 'Explore our shipping solutions',
      href: '/#services',
    },
    {
      icon: Search,
      title: 'Track Package',
      description: 'Track your shipment status',
      href: '/track-shipment',
    },
    {
      icon: Phone,
      title: 'Contact Us',
      description: 'Get in touch with our team',
      href: '/contact',
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-20">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-gray-200 leading-none">404</h1>
              <div className="w-24 h-1 bg-[#FFAC1C] mx-auto mt-4"></div>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-bold text-black mb-4">Page Not Found</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The page you&apos;re looking for seems to have been shipped to a different destination.
                Don&apos;t worry, we&apos;ll help you navigate back to the right place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <BackButton />
              <Link
                href="/"
                className="inline-flex items-center justify-center border-2 border-black text-black px-8 py-4 rounded-lg hover:bg-black hover:text-white transition-colors text-lg font-semibold"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 rounded-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-black mb-4">Quick Navigation</h3>
              <p className="text-lg text-gray-600">Find what you&apos;re looking for with these helpful links</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#FFAC1C] hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#FFAC1C]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FFAC1C] transition-colors">
                    <link.icon className="w-6 h-6 text-[#FFAC1C] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-lg font-semibold text-black mb-2">{link.title}</h4>
                  <p className="text-gray-600 text-sm">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-black mb-4">Need Help?</h3>
            <p className="text-lg text-gray-600 mb-8">
              Our customer support team is here to help you find what you&apos;re looking for
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
    </div>
  );
}
