import React from 'react';
import { Package, Truck, ShoppingBag, Globe, Zap, Shield, Users, Star, Download, Play, CheckCircle, ArrowRight, Clock, Award } from 'lucide-react';
import logo from '../assets/logo.png'
function Home() {
  const features = [
    {
      icon: Package,
      title: "Personal Package Services",
      description: "Secure international shipping for individuals with comprehensive tracking and delivery confirmation to over 190 countries worldwide."
    },
    {
      icon: Truck,
      title: "Enterprise Shipping Solutions",
      description: "Comprehensive logistics management for businesses including bulk shipping rates."
    },
    {
      icon: ShoppingBag,
      title: "Global Marketplace Access",
      description: "Connect with international suppliers and retailers. Purchase products worldwide and utilize our integrated shipping services for seamless delivery."
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Express Delivery",
      description: "Priority shipping options with guaranteed delivery times and real-time tracking updates."
    },
    {
      icon: Shield,
      title: "Match your price",
      description: "You can choose the best price for your shipment."
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Extensive international partnerships "
    },
    {
      icon: Award,
      title: "Industry Leading",
      description: "Award-winning service with 99.9% delivery success rate."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Account Registration",
      description: "Complete secure registration with identity verification and business documentation if applicable."
    },
    {
      step: "02",
      title: "Service Selection",
      description: "Choose from personal shipping, enterprise solutions, or marketplace access based on your requirements."
    },
    {
      step: "03",
      title: "Shipment Processing",
      description: "Process your shipment with real-time tracking, customs documentation, and delivery confirmation."
    }
  ];

  const stats = [
    { number: "190+", label: "Countries Served" },
    { number: "1000+", label: "Packages Delivered" },
    { number: "100+", label: "Business Clients" },
    { number: "99.9%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
     

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
             
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                Professional
                <span className="block text-[#FFAC1C]">Shipping Solutions</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Comprehensive international logistics platform serving individuals, enterprises, and global marketplace participants with industry-leading reliability and security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold">
                  <Download className="w-5 h-5 mr-2" />
                  Download iOS App
                </button>
                <button className="inline-flex items-center justify-center border-2 border-black text-black px-8 py-4 rounded-lg hover:bg-black hover:text-white transition-colors text-lg font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Download Android
                </button>
              </div>
         
            </div>
            <div className="relative">
              <div className="relative z-10 mx-auto w-80 h-96 bg-black rounded-3xl p-1 shadow-2xl">
                <div className="w-full h-full bg-white rounded-3xl flex flex-col items-center justify-center p-8">
                  <img src={logo} alt="logo" className="w-16 h-10" />
                  <h3 className="text-2xl font-bold text-black mb-2">VELO Mobile</h3>
                  <p className="text-gray-600 text-center mb-6">Professional shipping management at your fingertips</p>
                  <div className="w-full space-y-3">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-[#FFAC1C] mr-2" />
                      Real-time tracking
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-[#FFAC1C] mr-2" />
                      Customs documentation
                    </div>
                   
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FFAC1C]/20 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-black/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Comprehensive Shipping Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional logistics solutions designed for individuals, businesses, and international commerce.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#FFAC1C]/30">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFAC1C] transition-colors">
                  <feature.icon className="w-8 h-8 text-white group-hover:text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                <button className="inline-flex items-center text-[#FFAC1C] font-semibold hover:text-black transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="solutions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Streamlined Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional shipping made simple through our proven three-step process.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <div className="w-full h-px bg-[#FFAC1C]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Why Choose VELO
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry-leading capabilities backed by professional service and reliability.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-[#FFAC1C] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-black transition-colors">
                  <benefit.icon className="w-8 h-8 text-black group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Professionals Worldwide</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="border-l border-[#FFAC1C] pl-6 first:border-l-0 first:pl-0">
                <div className="text-4xl font-bold mb-2 text-[#FFAC1C]">{stat.number}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FFAC1C] to-[#FFB84D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to Ship Professionally?
          </h2>
          <p className="text-xl text-black/80 mb-8 leading-relaxed">
            Join thousands of professionals who trust VELO for their international shipping requirements. Download our mobile application and experience professional logistics management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Download for iOS
            </button>
            <button className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold border-2 border-black">
              <Play className="w-5 h-5 mr-2" />
              Download for Android
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
     
    </div>
  );
}

export default Home;