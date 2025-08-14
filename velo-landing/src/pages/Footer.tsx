import { Package } from 'lucide-react'
import logo from '../assets/logo.png'
const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <img src={logo} alt="logo" className="w-16 h-10" />
            <div>
              <span className="text-2xl font-bold text-white">VELO</span>
              <div className="text-xs text-gray-400 font-medium tracking-wide">INTERNATIONAL SHIPPING</div>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Professional international shipping solutions for individuals, enterprises, and global commerce.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Services</h4>
          {/* <ul className="space-y-3">
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Personal Shipping</a></li>
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Enterprise Solutions</a></li>
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Global Marketplace</a></li>
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Express Delivery</a></li>
          </ul> */}
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Support</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">EULA</a></li>
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Privacy Policy</a></li>
            {/* <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Customer Service</a></li>
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Technical Support</a></li> */}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          {/* <ul className="space-y-3">
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">About VELO</a></li>
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Press Center</a></li>
            <li><a href="#" className="hover:text-[#FFAC1C] transition-colors">Partner Network</a></li>
          </ul> */}
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
        <p>&copy; 2025 VELO International Shipping. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer