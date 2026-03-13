import { Link } from 'react-router-dom';
import { Dumbbell, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-emerald-500 mb-4">
              <Dumbbell className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight text-white">FitZone</span>
            </Link>
            <p className="text-zinc-400 text-sm mb-6">
              Your ultimate destination for fitness and health. We provide top-tier equipment, expert trainers, and a motivating community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-zinc-400 hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/memberships" className="text-zinc-400 hover:text-emerald-400 transition-colors">Memberships</Link></li>
              <li><Link to="/trainers" className="text-zinc-400 hover:text-emerald-400 transition-colors">Trainers</Link></li>
              <li><Link to="/gallery" className="text-zinc-400 hover:text-emerald-400 transition-colors">Gallery</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-zinc-400 hover:text-emerald-400 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-zinc-400">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>123 Fitness Street, Gym City, GC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <Phone className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>+91 8208951770</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <Mail className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>info@fitzone.demo</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} FitZone Gym Demo. All rights reserved.
          </p>
          <p className="text-zinc-500 text-sm mt-2 md:mt-0">
            <Link to="/admin/login" className="hover:text-zinc-300 transition-colors">Admin Login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
