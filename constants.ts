import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // Burgers
  {
    id: 'b1',
    name: 'Classic New York',
    description: 'Beef patty 110G, NY Cheese, Signature Charcoal Sauce, Lettuce, Tomato.',
    price: 999,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    rating: 4.8,
    reviewCount: 234,
    prepTime: '20-25 min',
    sizes: [
      { name: 'Single Patty', price: 999 },
      { name: 'Double Patty', price: 1299 }
    ],
    addons: [
      { name: 'Extra Cheese', price: 99 },
      { name: 'Jalapeños', price: 49 },
      { name: 'Turkey Bacon', price: 199 }
    ]
  },
  {
    id: 'b2',
    name: 'London BBQ',
    description: 'Beef patty 110G, Turkey Bacon, Onion Rings, BBQ Sauce, Cheddar.',
    price: 899,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 180,
    prepTime: '25-30 min',
    sizes: [{ name: 'Regular', price: 899 }],
    addons: [{ name: 'Extra Onion Rings', price: 89 }]
  },
  {
    id: 'b4',
    name: 'Paris Truffle',
    description: 'Umami Truffle Sauce, Beef patty 110G, Sautéed Mushrooms, Swiss Cheese.',
    price: 1199,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 312,
    prepTime: '25 min',
    isPopular: true
  },
  
  // Pizza
  {
    id: 'p1',
    name: 'Pepperoni Feast',
    description: 'Double pepperoni, extra mozzarella, signature tomato sauce.',
    price: 1499,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 150,
    prepTime: '30-40 min',
    sizes: [
        { name: 'Small (8")', price: 999 },
        { name: 'Medium (12")', price: 1499 },
        { name: 'Large (14")', price: 1999 }
    ]
  },

  // Fries
  {
    id: 'f1',
    name: 'New York Fries',
    description: 'Classic NY, Beef Signature Sauce, Cheese melt.',
    price: 749,
    category: 'Fries',
    image: 'https://images.unsplash.com/photo-1585109649139-3668018951a3?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    rating: 4.8,
    reviewCount: 520,
    prepTime: '10 min'
  },
  
  // Drinks
  {
    id: 's1',
    name: 'Lotus Shake',
    description: 'Creamy shake with Lotus Biscoff spread and crumbs.',
    price: 699,
    category: 'Shakes',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 89,
    prepTime: '5 min'
  }
];

export const CATEGORIES: { id: string, label: string, emoji: string }[] = [
  { id: 'Burgers', label: 'Smash Burgers', emoji: '🍔' },
  { id: 'Pizzas', label: 'Pizzas', emoji: '🍕' },
  { id: 'Fries', label: 'Fries', emoji: '🍟' },
  { id: 'Wings', label: 'Wings', emoji: '🍗' },
  { id: 'Drinks', label: 'Drinks', emoji: '🥤' },
  { id: 'Shakes', label: 'Shakes', emoji: '🥤' },
];

export const BANNERS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80', title: '20% OFF', subtitle: 'On your first order' },
  { id: 2, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80', title: 'FREE DELIVERY', subtitle: 'Orders above Rs 1500' },
];