import React from 'react';
import { Package, Trash2, Shield, AlertTriangle, Mail, Clock, CheckCircle, FileText } from 'lucide-react';

const AccountDeleteGuide = () => {
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
              <a href="#overview" className="text-gray-700 hover:text-black transition-colors font-medium">Overview</a>
              <a href="#steps" className="text-gray-700 hover:text-black transition-colors font-medium">Steps</a>
              <a href="#email" className="text-gray-700 hover:text-black transition-colors font-medium">Email Option</a>
              <a href="#faq" className="text-gray-700 hover:text-black transition-colors font-medium">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <section id="overview" className="text-center py-10">
            <div className="inline-flex items-center bg-[#FFAC1C]/10 text-[#FFAC1C] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-[#FFAC1C]/20">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account Guide
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">How to Delete Your VELO Account</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow this step-by-step guide to permanently delete your account. This action is irreversible.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>We respect your privacy and handle requests securely</span>
            </div>
          </section>

          {/* Important Notes */}
          <section className="mt-10 grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center text-black font-semibold mb-1"><AlertTriangle className="w-4 h-4 mr-2 text-[#FFAC1C]" /> Irreversible</div>
              <p className="text-sm text-gray-600">Account deletion is permanent. You will lose access to your profile, preferences, and history.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center text-black font-semibold mb-1"><FileText className="w-4 h-4 mr-2 text-[#FFAC1C]" /> Active Shipments</div>
              <p className="text-sm text-gray-600">Ensure there are no active shipments, disputes, or outstanding balances before proceeding.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center text-black font-semibold mb-1"><Clock className="w-4 h-4 mr-2 text-[#FFAC1C]" /> Processing Time</div>
              <p className="text-sm text-gray-600">Requests are typically processed within a reasonable timeframe. You will receive an email confirmation.</p>
            </div>
          </section>

          {/* Steps to delete in the app */}
          <section id="steps" className="mt-12">
            <h2 className="text-2xl font-bold text-black mb-4">Delete via the VELO App</h2>
            <ol className="space-y-4 list-decimal list-inside bg-white p-6 rounded-xl border border-gray-200">
              <li className="text-gray-800">Open the VELO app and sign in to your account.</li>
              <li className="text-gray-800">Go to <span className="font-semibold">Profile</span> → <span className="font-semibold">Settings</span>.</li>
              <li className="text-gray-800">Select <span className="font-semibold">Delete Account</span>.</li>
              <li className="text-gray-800">Review the information and confirm your decision.</li>
              <li className="text-gray-800">Enter your current password to confirm the deletion.</li>
              <li className="text-gray-800">You are now deleted.</li>
            </ol>

          </section>

          {/* Email option */}
         

          {/* Data handling */}
          

          {/* FAQ */}
       
        </div>
      </main>

      {/* Footer */}
     
    </div>
  );
};

export default AccountDeleteGuide;