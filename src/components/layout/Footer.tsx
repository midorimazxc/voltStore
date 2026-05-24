import { Zap, Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../context/NavigationContext';

export default function Footer() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const features = [
    { icon: <Truck className="w-5 h-5 text-cyan-400" />, title: t('footer.fastDelivery'), desc: t('footer.fastDeliveryDesc') },
    { icon: <Shield className="w-5 h-5 text-cyan-400" />, title: t('footer.guarantee'), desc: t('footer.guaranteeDesc') },
    { icon: <RotateCcw className="w-5 h-5 text-cyan-400" />, title: t('footer.returns'), desc: t('footer.returnsDesc') },
    { icon: <Headphones className="w-5 h-5 text-cyan-400" />, title: t('footer.support'), desc: t('footer.supportDesc') },
  ];

  const catalogItems = [
    { label: t('footer.categories.games'),    slug: 'games' },
    { label: t('footer.categories.software'), slug: 'software' },
    { label: t('footer.categories.antivirus'), slug: 'antivirus' },
  ];

  const supportItems = [
    t('footer.supportItems.contact'),
    t('footer.supportItems.faq'),
    t('footer.supportItems.delivery'),
    t('footer.supportItems.track'),
    t('footer.supportItems.returns'),
    t('footer.supportItems.warranty'),
  ];

  const companyItems = [
    t('footer.companyItems.about'),
    t('footer.companyItems.careers'),
    t('footer.companyItems.press'),
    t('footer.companyItems.privacy'),
    t('footer.companyItems.terms'),
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b border-slate-800">
          {features.map(item => (
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
            <p className="text-slate-400 text-sm leading-relaxed">{t('footer.description')}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('footer.catalog')}</h4>
            <ul className="space-y-2">
              {catalogItems.map(cat => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigate('products', { categoryId: cat.slug })}
                    className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('footer.supportLinks')}</h4>
            <ul className="space-y-2">
              {supportItems.map(item => (
                <li key={item}>
                  <span className="text-slate-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {companyItems.map(item => (
                <li key={item}>
                  <span className="text-slate-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} VoltStore. {t('footer.rights')}
          </p>
          <p className="text-slate-600 text-xs">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}