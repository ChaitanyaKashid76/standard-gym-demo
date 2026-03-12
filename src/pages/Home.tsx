import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Dumbbell, Users, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [memberships, setMemberships] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    fetch('/api/memberships')
      .then(res => res.json())
      .then(data => setMemberships(data.slice(0, 3)));
      
    fetch('/api/trainers')
      .then(res => res.json())
      .then(data => setTrainers(data.slice(0, 3)));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop" 
            alt="Gym Hero" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white uppercase"
          >
            Push Your <span className="text-emerald-500">Limits</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto"
          >
            Join the ultimate fitness community. State-of-the-art equipment, expert trainers, and a motivating atmosphere to help you achieve your goals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/memberships" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border-2 border-white hover:border-emerald-500 hover:text-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose FitZone?</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition-colors group">
              <div className="bg-emerald-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Dumbbell className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Modern Equipment</h3>
              <p className="text-zinc-400">Train with the latest and most advanced fitness equipment designed for maximum results and safety.</p>
            </div>
            
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition-colors group">
              <div className="bg-emerald-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Users className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Trainers</h3>
              <p className="text-zinc-400">Our certified personal trainers are dedicated to helping you reach your fitness goals with personalized plans.</p>
            </div>
            
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition-colors group">
              <div className="bg-emerald-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Clock className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Flexible Hours</h3>
              <p className="text-zinc-400">We are open 24/7 so you can work out whenever it fits your schedule. No more excuses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Memberships Preview */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Membership Plans</h2>
              <div className="w-24 h-1 bg-emerald-500 rounded-full" />
            </div>
            <Link to="/memberships" className="hidden md:flex items-center text-emerald-500 hover:text-emerald-400 font-medium">
              View All Plans <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {memberships.map((plan: any) => (
              <div key={plan.id} className="bg-zinc-950 rounded-2xl border border-zinc-800 p-8 flex flex-col relative overflow-hidden">
                {plan.name === 'Standard' && (
                  <div className="absolute top-0 inset-x-0 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2 mt-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold text-emerald-500">{plan.price}</span>
                  <span className="text-zinc-500">/{plan.duration}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-zinc-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/contact" 
                  className={`w-full py-3 rounded-lg font-bold text-center transition-colors ${
                    plan.name === 'Standard' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/memberships" className="inline-flex items-center text-emerald-500 hover:text-emerald-400 font-medium">
              View All Plans <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trainers Preview */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Our Trainers</h2>
              <div className="w-24 h-1 bg-emerald-500 rounded-full" />
            </div>
            <Link to="/trainers" className="hidden md:flex items-center text-emerald-500 hover:text-emerald-400 font-medium">
              View All Trainers <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer: any) => (
              <div key={trainer.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4]">
                <img 
                  src={trainer.photoUrl} 
                  alt={trainer.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80" />
                <div className="absolute bottom-0 inset-x-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-1">{trainer.name}</h3>
                  <p className="text-emerald-400 font-medium mb-2">{trainer.specialization}</p>
                  <p className="text-zinc-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {trainer.experience} Experience
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
