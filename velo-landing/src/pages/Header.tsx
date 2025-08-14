import { Package } from 'lucide-react'
import {Link} from 'react-router-dom'
import logo from '../assets/logo.png'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
                <img src={logo} alt="logo" className="w-16 h-10" />
              <div>
                <span className="text-2xl font-bold text-black">VELO</span>
                <div className="text-xs text-gray-600 font-medium tracking-wide">INTERNATIONAL SHIPPING</div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-black transition-colors font-medium">Services</a>
              <a href="#solutions" className="text-gray-700 hover:text-black transition-colors font-medium">Solutions</a>
              <a href="#about" className="text-gray-700 hover:text-black transition-colors font-medium">About</a>
              <Link to="/contact-us" className="text-gray-700 hover:text-black transition-colors font-medium">Contact</Link>
            </nav>
            <button className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Get Started
            </button>
          </div>
        </div>
      </header>
  )
}

export default Header