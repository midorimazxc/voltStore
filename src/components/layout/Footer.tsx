import { Zap, Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export default function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b border-slate-800">
          {[
            { icon: <Truck className="w-5 h-5 text-cyan-400" />, title: 'Instant Delivery', desc: 'Get your order in 2–4 hours' },
            { icon: <Shield className="w-5 h-5 text-cyan-400" />, title: '2-Year Warranty', desc: 'On all products' },
            { icon: <RotateCcw className="w-5 h-5 text-cyan-400" />, title: '30-Day Returns', desc: 'Hassle-free returns' },
            { icon: <Headphones className="w-5 h-5 text-cyan-400" />, title: '24/7 Support', desc: 'Expert help anytime' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{item.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-slate-800">
          <div className="md:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-white font-bold text-lg">Volt<span className="text-cyan-400">Store</span></span>
            </button>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your premier destination for the latest electronics, with lightning-fast instant delivery.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Shop</h4>
            <ul className="space-y-2">
              {['Smartphones', 'Laptops', 'Audio', 'Tablets', 'Wearables', 'Gaming'].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => navigate('products')}
                    className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2">
              {['Contact Us', 'FAQ', 'Shipping Info', 'Track Order', 'Returns', 'Warranty'].map(item => (
                <li key={item}>
                  <span className="text-slate-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Press', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <span className="text-slate-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} VoltStore. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">Built with passion for electronics enthusiasts.</p>
        </div>
      </div>
    </footer>
  );
}
