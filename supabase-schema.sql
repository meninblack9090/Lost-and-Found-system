-- ========================================
-- Lost and Found System - Supabase Schema
-- ========================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  color TEXT DEFAULT '#78716c',
  description TEXT DEFAULT '',
  auto_tagging BOOLEAN DEFAULT true,
  keywords TEXT DEFAULT '',
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  student_id TEXT,
  phone TEXT,
  department TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'active',
  avatar TEXT,
  items_reported INTEGER DEFAULT 0,
  items_claimed INTEGER DEFAULT 0,
  join_date TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- 3. LOST ITEMS TABLE
CREATE TABLE IF NOT EXISTS lost_items (
  id SERIAL PRIMARY KEY,
  item_id TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  category_name TEXT,
  category_icon TEXT,
  location_lost TEXT NOT NULL,
  date_reported TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  reporter_id INTEGER REFERENCES users(id),
  reporter_name TEXT,
  image TEXT,
  text_embedding FLOAT8[],
  image_embedding FLOAT8[],
  image_color TEXT DEFAULT 'bg-blue-100',
  image_icon TEXT DEFAULT '🔍',
  resolved_date TIMESTAMP
);

-- 4. FOUND ITEMS TABLE
CREATE TABLE IF NOT EXISTS found_items (
  id SERIAL PRIMARY KEY,
  item_id TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  category_name TEXT,
  category_icon TEXT,
  location_found TEXT NOT NULL,
  current_location TEXT,
  date_found TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  finder_id INTEGER REFERENCES users(id),
  finder_name TEXT,
  condition TEXT DEFAULT 'Good',
  image TEXT,
  text_embedding FLOAT8[],
  image_embedding FLOAT8[],
  image_color TEXT DEFAULT 'bg-green-100',
  image_icon TEXT DEFAULT '📦',
  resolved_date TIMESTAMP
);

-- 5. MATCHES TABLE
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  lost_item_id INTEGER REFERENCES lost_items(id),
  found_item_id INTEGER REFERENCES found_items(id),
  confidence INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  date_created TIMESTAMP DEFAULT NOW()
);

-- 6. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  text TEXT NOT NULL,
  time TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT 'A',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT,
  user_name TEXT,
  role TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- 9. QR LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS qr_locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  qr_code TEXT,
  is_active BOOLEAN DEFAULT true,
  scan_count INTEGER DEFAULT 0,
  last_scanned TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- SEED DATA
-- ========================================

-- Seed Categories
INSERT INTO categories (name, icon, color, description, keywords) VALUES
('Electronics', '💻', '#4f46e5', 'Phones, laptops, tablets, chargers', 'phone, smartphone, laptop, tablet, charger, iphone, android, laptop, computer'),
('Accessories', '⌚', '#0ea5e9', 'Watches, jewelry, glasses, wallets', 'watch, jewelry, ring, glasses, sunglasses, wallet, earphones'),
('Keys', '🔑', '#f59e0b', 'Keychains, keycards, key fobs', 'keys, keychain, keycard, key fob, car key'),
('IDs & Cards', '🪪', '#10b981', 'ID cards, credit cards, licenses', 'id, student id, credit card, license, identification, card'),
('Clothing', '👕', '#ef4444', 'Jackets, hats, shirts, uniforms', 'jacket, hat, shirt, hoodie, uniform, coat, gloves, scarf'),
('Bags', '🎒', '#8b5cf6', 'Backpacks, handbags, luggage', 'bag, backpack, handbag, luggage, tote, backpack'),
('Books & Papers', '📚', '#ec4899', 'Textbooks, notebooks, documents', 'book, textbook, notebook, notes, document, paper, folder'),
('Umbrellas', '🌂', '#14b8a6', 'Foldable, long, patio umbrellas', 'umbrella, foldable umbrella, rain umbrella'),
('Water Bottles', '🧴', '#06b6d4', 'Reusable bottles, tumblers, flasks', 'water bottle, tumbler, flask, hydro flask, bottle'),
('Miscellaneous', '📦', '#78716c', 'Other items not in other categories', 'other, miscellaneous, misc, various')
ON CONFLICT DO NOTHING;

-- Seed Users
INSERT INTO users (name, email, password, student_id, phone, department, role, status) VALUES
('Admin User', 'admin@lostandfound.edu', '$2b$10$placeholder', 'ADMIN-001', '+63 900 000 0000', 'Administration', 'superadmin', 'active'),
('Maria Santos', 'maria.santos@university.edu', '$2b$10$placeholder', '2021-0001', '+63 912 345 6789', 'College of Engineering', 'student', 'active'),
('Juan Dela Cruz', 'juan.dcruz@university.edu', '$2b$10$placeholder', '2022-0042', '+63 917 890 1234', 'College of Science', 'student', 'active'),
('Ana Gonzales', 'ana.gonzales@university.edu', '$2b$10$placeholder', '2021-0088', '+63 915 678 9012', 'College of Arts & Letters', 'student', 'active'),
('Carlos Reyes', 'carlos.reyes@university.edu', '$2b$10$placeholder', '2023-0015', '+63 919 234 5678', 'College of Business', 'student', 'suspended'),
('Sofia Lopez', 'sofia.lopez@university.edu', '$2b$10$placeholder', '2022-0077', '+63 913 456 7890', 'College of Education', 'student', 'active'),
('Miguel Torres', 'miguel.torres@university.edu', '$2b$10$placeholder', '2023-0023', '+63 916 789 0123', 'College of Engineering', 'student', 'active'),
('Emily Fernandez', 'emily.fernandez@university.edu', '$2b$10$placeholder', '2021-0055', '+63 918 901 2345', 'College of Science', 'student', 'active'),
('David Villanueva', 'david.villanueva@university.edu', '$2b$10$placeholder', '2022-0099', '+63 914 567 8901', 'College of Business', 'student', 'active'),
('Isabella Gomez', 'isabella.gomez@university.edu', '$2b$10$placeholder', '2023-0044', '+63 911 234 5678', 'College of Education', 'student', 'active'),
('Luis Mendoza', 'luis.mendoza@university.edu', '$2b$10$placeholder', '2021-0033', '+63 920 345 6789', 'College of Arts & Letters', 'student', 'archived')
ON CONFLICT DO NOTHING;

-- Seed Conversations
-- Only Lost & Found Office — admin web IS the office, user conversations are created dynamically
INSERT INTO conversations (name, avatar) VALUES
('Lost & Found Office', 'L');
