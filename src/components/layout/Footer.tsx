import { Zap, Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
export default function Footer() {
  const { navigate } = useNavigation();
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b border-slate-800">
          {[
            { icon: <Truck className="w-5 h-5 text-cyan-400" />, title: 'Быстрая доставка', desc: 'Получите заказ за 2–4 часа' },
            { icon: <Shield className="w-5 h-5 text-cyan-400" />, title: 'Гарантия 2 года', desc: 'На все товары' },
            { icon: <RotateCcw className="w-5 h-5 text-cyan-400" />, title: 'Возврат за 30 дней', desc: 'Без лишних вопросов' },
            { icon: <Headphones className="w-5 h-5 text-cyan-400" />, title: 'Поддержка 24/7', desc: 'Помощь в любое время' },
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
              Лучшее место для покупки новейшей электроники с молниеносной доставкой до двери.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Каталог</h4>
            <ul className="space-y-2">
              {['Смартфоны', 'Ноутбуки', 'Аудио', 'Планшеты', 'Носимые устройства', 'Игры'].map(cat => (
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
            <h4 className="text-white font-semibold mb-4 text-sm">Поддержка</h4>
            <ul className="space-y-2">
              {['Связаться с нами', 'Частые вопросы', 'Доставка', 'Отследить заказ', 'Возврат', 'Гарантия'].map(item => (
                <li key={item}>
                  <span className="text-slate-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Компания</h4>
            <ul className="space-y-2">
              {['О нас', 'Вакансии', 'Пресса', 'Политика конфиденциальности', 'Условия использования'].map(item => (
                <li key={item}>
                  <span className="text-slate-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} VoltStore. Все права защищены.
          </p>
          <p className="text-slate-600 text-xs">Создано с любовью для ценителей электроники.</p>
        </div>
      </div>
    </footer>
  );
}