import * as React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Truck, Shield, Star } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const Home = (): JSX.Element => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 animate-[float_20s_ease-in-out_infinite]"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-accent-900/90 via-accent-900/60 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-8xl font-black mb-6 animate-blur-in leading-tight text-white">
              Crafing <br />
              <span className="text-primary-500">Perfect Slices</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-accent-100 max-w-2xl animate-fade-in [animation-delay:400ms] leading-relaxed opacity-0 [animation-fill-mode:forwards]">
              Indulge in the artistry of authentic Italian pizza. Each creation is a masterpiece
              of fresh ingredients, traditional methods, and modern culinary excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 animate-slide-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
              <Link
                to="/menu"
                className="premium-button bg-primary-500 text-white hover:bg-primary-600 text-lg px-10 text-center"
              >
                Experience the Menu
              </Link>
              <Link
                to="/menu"
                className="premium-button glass text-white hover:bg-white/10 text-lg px-10 text-center"
              >
                View Specialties
              </Link>
            </div>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute right-0 bottom-0 w-1/3 h-1/2 bg-primary-500/10 blur-[120px] rounded-full -mr-20 -mb-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-black text-accent-900 mb-6">
              The <span className="text-primary-600">PizzaCraft</span> Standard
            </h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto leading-relaxed">
              We define excellence through every detail, from the selection of our flour to the
              speed of our delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: Clock, title: 'Express Delivery', desc: 'Hot, fresh pizza delivered in 30 minutes or less', color: 'bg-orange-50 text-orange-600' },
              { icon: Shield, title: 'Quality First', desc: 'Only the freshest, highest quality artisanal ingredients', color: 'bg-red-50 text-red-600' },
              { icon: Truck, title: 'Complimentary Delivery', desc: `Free delivery on orders over ${formatCurrency(499)}`, color: 'bg-emerald-50 text-emerald-600' },
              { icon: Star, title: 'Top Rated', desc: 'Loved by thousands of satisfied pizza enthusiasts', color: 'bg-amber-50 text-amber-600' },
            ].map((feature, idx) => (
              <div key={idx} className="premium-card p-8 group hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${feature.color}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl text-accent-900 mb-3">{feature.title}</h3>
                <p className="text-accent-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Pizzas Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-accent-900 mb-6">
              Chef's <span className="text-primary-600">Masterpieces</span>
            </h2>
            <p className="text-xl text-accent-600">
              Discover why generations have fallen in love with our signature creations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: 'Margherita Classic', desc: 'Fresh mozzarella, san marzano tomatoes, fresh basil', price: 299, rating: 4.8, img: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
              { name: 'Pepperoni Supreme', desc: 'Premium pepperoni with double mozzarella cheese', price: 359, rating: 4.7, img: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
              { name: 'Meat Lovers', desc: 'Pepperoni, sausage, bacon, ham, and ground beef', price: 459, rating: 4.9, img: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            ].map((pizza, idx) => (
              <div key={idx} className="premium-card overflow-hidden group">
                <div className="overflow-hidden h-64">
                  <img
                    src={pizza.img}
                    alt={pizza.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-2xl text-accent-900 mb-3 group-hover:text-primary-600 transition-colors">{pizza.name}</h3>
                  <p className="text-accent-600 mb-6 line-clamp-2">{pizza.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-primary-600 text-2xl">{formatCurrency(pizza.price)}</span>
                    <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="font-bold text-amber-700">{pizza.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/menu"
              className="inline-flex items-center space-x-2 text-primary-600 font-bold text-lg hover:text-primary-700 transition-colors group"
            >
              <span>Explore the full menu</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-accent-900 overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 mix-blend-overlay opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-8">
            Ready for a <span className="text-primary-500">Slice of Heaven?</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-accent-200 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers and experience the true art of pizza making.
          </p>
          <Link
            to="/menu"
            className="premium-button bg-primary-500 text-white hover:bg-primary-600 text-xl px-12 inline-block shadow-2xl shadow-primary-500/50"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;