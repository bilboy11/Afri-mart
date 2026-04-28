// Products Database - Scalable product catalog
export const products = [
    // Electronics
    { id: 1, name: 'Wireless Headphones', description: 'Premium noise-cancelling headphones with 30-hour battery', price: 199.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 2, name: 'Smart Watch', description: 'Fitness tracking and notifications with heart rate monitor', price: 299.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', rating: 4.7 },
    { id: 3, name: 'Laptop Stand', description: 'Ergonomic aluminum laptop stand with adjustable height', price: 49.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', rating: 4.3 },
    { id: 4, name: 'USB-C Hub', description: '7-in-1 USB-C adapter with HDMI, USB 3.0, and SD card reader', price: 39.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop', rating: 4.4 },
    { id: 5, name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with Cherry MX switches', price: 129.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 6, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with precision tracking', price: 59.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', rating: 4.5 },
    
    // More Electronics
    { id: 7, name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with 360° sound', price: 79.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', rating: 4.4 },
    { id: 8, name: 'Tablet Stand', description: 'Adjustable tablet stand for desk or bed', price: 29.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.2 },
    { id: 9, name: 'Webcam HD', description: '1080p HD webcam with built-in microphone', price: 89.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 10, name: 'Wireless Charger', description: 'Fast wireless charging pad for smartphones', price: 34.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop', rating: 4.3 },
    
    // Clothing
    { id: 11, name: 'Cotton T-Shirt', description: '100% organic cotton t-shirt, comfortable fit', price: 24.99, category: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 12, name: 'Denim Jeans', description: 'Classic fit denim jeans with stretch', price: 69.99, category: 'Clothing', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 13, name: 'Hooded Sweatshirt', description: 'Warm fleece-lined hoodie with front pocket', price: 49.99, category: 'Clothing', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', rating: 4.4 },
    { id: 14, name: 'Running Shoes', description: 'Lightweight running shoes with cushioned sole', price: 89.99, category: 'Clothing', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', rating: 4.7 },
    { id: 15, name: 'Leather Jacket', description: 'Genuine leather jacket with quilted lining', price: 199.99, category: 'Clothing', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', rating: 4.8 },
    
    // Home & Kitchen
    { id: 16, name: 'Coffee Maker', description: 'Programmable coffee maker with thermal carafe', price: 79.99, category: 'Home', image: 'https://images.unsplash.com/photo-1517668808823-f8f7888a2913?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 17, name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', price: 39.99, category: 'Home', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', rating: 4.4 },
    { id: 18, name: 'Throw Pillow Set', description: 'Set of 2 decorative throw pillows', price: 29.99, category: 'Home', image: 'https://images.unsplash.com/photo-1584100936595-a3c8e5a8b0a0?w=400&h=400&fit=crop', rating: 4.3 },
    { id: 19, name: 'Wall Clock', description: 'Modern minimalist wall clock with silent movement', price: 34.99, category: 'Home', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', rating: 4.2 },
    { id: 20, name: 'Plant Pot Set', description: 'Set of 3 ceramic plant pots with drainage', price: 24.99, category: 'Home', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop', rating: 4.5 },
    
    // Books
    { id: 21, name: 'Programming Guide', description: 'Complete guide to modern web development', price: 34.99, category: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 22, name: 'Design Patterns', description: 'Essential design patterns for developers', price: 39.99, category: 'Books', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop', rating: 4.7 },
    { id: 23, name: 'Business Strategy', description: 'Strategic thinking for entrepreneurs', price: 29.99, category: 'Books', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', rating: 4.5 },
    
    // Sports
    { id: 24, name: 'Yoga Mat', description: 'Non-slip yoga mat with carrying strap', price: 29.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', rating: 4.4 },
    { id: 25, name: 'Dumbbell Set', description: 'Adjustable dumbbell set 5-25 lbs each', price: 149.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 26, name: 'Water Bottle', description: 'Insulated stainless steel water bottle', price: 24.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', rating: 4.5 },
    
    // More Electronics
    { id: 27, name: 'Phone Case', description: 'Protective phone case with shock absorption', price: 19.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400&h=400&fit=crop', rating: 4.3 },
    { id: 28, name: 'Laptop Sleeve', description: 'Padded laptop sleeve with handle', price: 34.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.4 },
    { id: 29, name: 'Monitor Stand', description: 'Wooden monitor stand with storage', price: 44.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 30, name: 'Cable Organizer', description: 'Cable management system for desk', price: 14.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop', rating: 4.2 },

    // Beauty & Personal Care
    { id: 31, name: 'Skincare Starter Kit', description: 'Cleanser, moisturizer, and SPF trio for daily routine', price: 39.99, category: 'Beauty', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 32, name: 'Electric Toothbrush', description: 'Rechargeable toothbrush with 3 modes and travel case', price: 59.99, category: 'Beauty', image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 33, name: 'Hair Dryer Pro', description: 'Ionic hair dryer for fast drying and frizz control', price: 89.99, category: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', rating: 4.4 },

    // Toys & Games
    { id: 34, name: 'Building Blocks Set', description: 'Creative building blocks set (500 pcs) for ages 6+', price: 34.99, category: 'Toys', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', rating: 4.7 },
    { id: 35, name: 'Board Game Night', description: 'Family strategy board game for 2-6 players', price: 29.99, category: 'Toys', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 36, name: 'Puzzle 1000 Pieces', description: 'High-quality 1000-piece landscape puzzle', price: 19.99, category: 'Toys', image: 'https://images.unsplash.com/photo-1549057446-9f5c6ac91a7a?w=400&h=400&fit=crop', rating: 4.4 },

    // Groceries
    { id: 37, name: 'Premium Coffee Beans', description: 'Single-origin medium roast coffee beans (1 lb)', price: 16.99, category: 'Groceries', image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400&h=400&fit=crop', rating: 4.7 },
    { id: 38, name: 'Olive Oil Extra Virgin', description: 'Cold-pressed extra virgin olive oil (750ml)', price: 14.99, category: 'Groceries', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 39, name: 'Healthy Snack Box', description: 'Assorted healthy snacks box for the week', price: 24.99, category: 'Groceries', image: 'https://images.unsplash.com/photo-1604909053196-46f778a3bb7f?w=400&h=400&fit=crop', rating: 4.3 },

    // Home & Office
    { id: 40, name: 'Ergonomic Office Chair', description: 'Adjustable lumbar support chair for all-day comfort', price: 219.99, category: 'Home', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 41, name: 'Notebook Set', description: 'Set of 3 hardcover notebooks (lined pages)', price: 17.99, category: 'Home', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop', rating: 4.4 },
    { id: 42, name: 'Gel Ink Pens', description: 'Smooth gel pens (pack of 12) for writing & journaling', price: 9.99, category: 'Home', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop', rating: 4.3 },

    // Outdoor
    { id: 43, name: 'Camping Lantern', description: 'Rechargeable LED lantern with 3 brightness levels', price: 27.99, category: 'Outdoor', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 44, name: 'Hiking Backpack', description: '30L lightweight backpack with rain cover', price: 64.99, category: 'Outdoor', image: 'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 45, name: 'Portable Cooler', description: 'Insulated cooler bag for trips and picnics', price: 39.99, category: 'Outdoor', image: 'https://images.unsplash.com/photo-1526401485004-2aa7f3b9d7ad?w=400&h=400&fit=crop', rating: 4.4 },

    // More Books
    { id: 46, name: 'Productivity Handbook', description: 'Practical productivity systems for busy professionals', price: 22.99, category: 'Books', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop', rating: 4.5 },
    { id: 47, name: 'Cooking Basics', description: 'Beginner-friendly recipes and kitchen fundamentals', price: 26.99, category: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop', rating: 4.4 },

    // More Electronics
    { id: 48, name: 'Noise Cancelling Earbuds', description: 'Compact earbuds with active noise cancellation', price: 149.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', rating: 4.6 },
    { id: 49, name: 'Portable SSD 1TB', description: 'High-speed USB-C portable SSD storage (1TB)', price: 119.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&h=400&fit=crop', rating: 4.7 },
    { id: 50, name: 'Smart LED Bulb Pack', description: 'Set of 2 smart bulbs with app control and schedules', price: 29.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1565636226111-2d7b52f3a0e8?w=400&h=400&fit=crop', rating: 4.4 }
];

// Get unique categories
export function getCategories() {
    return [...new Set(products.map(p => p.category))].sort();
}

// Get products by category
export function getProductsByCategory(category) {
    if (!category || category === 'All') return products;
    return products.filter(p => p.category === category);
}

// Search products
export function searchProducts(query) {
    if (!query) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}

// Get products with pagination
export function getProductsPaginated(page = 1, itemsPerPage = 12, filters = {}) {
    let filtered = [...products];
    
    // Apply category filter
    if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Apply search filter
    if (filters.search) {
        filtered = searchProducts(filters.search);
    }
    
    // Apply price filter
    if (filters.minPrice) {
        filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    // Apply sort
    if (filters.sort) {
        switch(filters.sort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
        }
    }
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    
    return {
        products: paginated,
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / itemsPerPage),
        hasMore: endIndex < filtered.length
    };
}
