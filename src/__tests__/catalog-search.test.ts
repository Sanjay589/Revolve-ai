import { describe, it, expect } from 'vitest';
import { AIEngine } from '@/server/services/ai-engine';

// Mock catalog data mirroring real seeded database items
const mockCatalogProducts = [
  {
    id: 'prod_run_01',
    name: 'Velocity Pro Carbon Running Shoes',
    description: 'Ultra-lightweight marathon running shoes engineered with carbon fiber propulsion plate and responsive nitrogen-infused cushioning.',
    shortDescription: 'Carbon-plated performance marathon running shoes.',
    price: 449900, // ₹4,499
    compareAtPrice: 599900,
    category: 'Footwear',
    sku: 'APX-RUN-01',
    inventory: 45,
    isActive: true,
    features: ['Carbon Fiber Plate', 'Nitrogen-Infused Foam', 'Breathable Engineered Mesh', 'Anti-Slip Traction Outsole'],
    tags: ['running', 'marathon', 'footwear', 'carbon-plate', 'sports'],
    aiMetadata: { targetDemographic: 'Marathon runners, athletes' },
  },
  {
    id: 'prod_sck_02',
    name: 'Anti-Blister Compression Performance Socks (3-Pack)',
    description: 'Ergonomic graduated compression athletic socks with moisture-wicking CoolMax yarn and seamless toe protection.',
    shortDescription: 'Graduated compression moisture-wicking running socks.',
    price: 79900, // ₹799
    compareAtPrice: 119900,
    category: 'Accessories',
    sku: 'APX-SCK-02',
    inventory: 120,
    isActive: true,
    features: ['Graduated Compression', 'Seamless Toe', 'Moisture-Wicking CoolMax', 'Arch Support Band'],
    tags: ['socks', 'compression', 'accessories', 'running', 'comfort'],
  },
  {
    id: 'prod_wtc_03',
    name: 'Apex Pulse GPS Cardio Fitness Watch',
    description: 'Next-gen multisport GPS watch with real-time VO2 Max tracking, optical heart rate, solar charging, and 14-day battery life.',
    shortDescription: 'Multisport GPS smartwatch with advanced biometric tracking.',
    price: 899900, // ₹8,999
    compareAtPrice: 1099900,
    category: 'Electronics',
    sku: 'APX-WTC-03',
    inventory: 30,
    isActive: true,
    features: ['Multi-Band GPS', 'VO2 Max Metric', 'Solar Sapphire Lens', '5 ATM Water Resistant', '14-Day Battery'],
    tags: ['smartwatch', 'gps', 'heart-rate', 'fitness', 'electronics'],
  },
  {
    id: 'prod_lpt_04',
    name: 'Titan Pro Ultra-Slim Performance Laptop (16GB/1TB)',
    description: 'Aerospace-grade aluminum creator and developer laptop with 3.2K OLED 120Hz display and all-day battery efficiency.',
    shortDescription: '14-inch OLED powerhouse laptop for builders and creators.',
    price: 8499900, // ₹84,999
    compareAtPrice: 9499900,
    category: 'Computers',
    sku: 'APX-LPT-04',
    inventory: 15,
    isActive: true,
    features: ['3.2K 120Hz OLED Display', '16-Core Processor', '16GB LPDDR5X RAM', '1TB NVMe Gen4 SSD', 'Magnesium Alloy Chassis'],
    tags: ['laptop', 'ultrabook', 'creator', 'developer', 'hardware'],
  },
  {
    id: 'prod_slv_05',
    name: 'Water-Resistant Magnetic Laptop Sleeve (14-inch)',
    description: 'Fleece-lined water-repellent Cordura protective sleeve with magnetic snap closure and dedicated charger pocket.',
    shortDescription: 'Cordura ballistic nylon magnetic laptop protection sleeve.',
    price: 189900, // ₹1,899
    compareAtPrice: 249900,
    category: 'Accessories',
    sku: 'APX-SLV-05',
    inventory: 75,
    isActive: true,
    features: ['Cordura Ballistic Nylon', 'Plush Microfiber Interior', 'Magnetic Auto-Align Flap', 'Spill-Resistant'],
    tags: ['sleeve', 'case', 'laptop-accessory', 'waterproof', 'protective'],
  },
  {
    id: 'prod_mou_06',
    name: 'ErgoFlow Precision Wireless Mouse',
    description: 'Dual-mode Bluetooth + 2.4GHz silent optical mouse with hyper-fast scroll wheel and thumb rest.',
    shortDescription: 'Ergonomic dual-mode silent productivity mouse.',
    price: 129900, // ₹1,299
    compareAtPrice: 179900,
    category: 'Accessories',
    sku: 'APX-MOU-06',
    inventory: 90,
    isActive: true,
    features: ['4000 DPI Sensor', 'Whisper-Quiet Clicks', 'Multi-Device Flow Pairing', 'USB-C Fast Recharge'],
    tags: ['mouse', 'wireless', 'ergonomic', 'bluetooth', 'desk-setup'],
  },
  {
    id: 'prod_bpk_07',
    name: 'Voyager Modular Expandable Travel Backpack 35L',
    description: 'TSA-ready clamshell water-repellent travel pack with padded 16-inch laptop compartment and hidden anti-theft passport pocket.',
    shortDescription: 'All-weather 35L modular carry-on travel backpack.',
    price: 349900, // ₹3,499
    compareAtPrice: 499900,
    category: 'Travel & Bags',
    sku: 'APX-BPK-07',
    inventory: 50,
    isActive: true,
    features: ['TSA Clamshell Opening', 'Hidden RFID Pocket', 'Padded Laptop Sleeve', 'Luggage Pass-Through Strap', 'YKK Aquaguard Zippers'],
    tags: ['backpack', 'travel', 'commute', 'waterproof', 'bags'],
  },
];

describe('AI Buyer Robust Search Pipeline', () => {
  it('should find Titan Pro Laptop when searching "Laptop with 16GB RAM for productivity"', () => {
    const result = AIEngine.executeDeterministicSearch(
      mockCatalogProducts,
      'Laptop with 16GB RAM for productivity'
    );

    expect(result.products.length).toBeGreaterThan(0);
    const topMatch = result.products[0];
    expect(topMatch.id).toBe('prod_lpt_04');
    expect(topMatch.name).toContain('Titan Pro Ultra-Slim Performance Laptop');
    expect(topMatch.reasoning.toLowerCase()).toContain('ram');
  });

  it('should find Velocity Shoes when searching "running shoes under ₹5000"', () => {
    const result = AIEngine.executeDeterministicSearch(
      mockCatalogProducts,
      'running shoes under ₹5000'
    );

    expect(result.products.length).toBeGreaterThan(0);
    const topMatch = result.products[0];
    expect(topMatch.id).toBe('prod_run_01');
    expect(topMatch.price).toBeLessThanOrEqual(500000);
    expect(topMatch.reasoning.toLowerCase()).toContain('budget');
  });

  it('should match productivity gear when searching "something for office productivity"', () => {
    const result = AIEngine.executeDeterministicSearch(
      mockCatalogProducts,
      'something for office productivity'
    );

    expect(result.products.length).toBeGreaterThan(0);
    const productIds = result.products.map((p) => p.id);
    expect(productIds.includes('prod_mou_06') || productIds.includes('prod_lpt_04')).toBe(true);
  });

  it('should match Titan Pro when searching "premium laptop"', () => {
    const result = AIEngine.executeDeterministicSearch(
      mockCatalogProducts,
      'premium laptop'
    );

    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products[0].id).toBe('prod_lpt_04');
  });

  it('should match water-resistant gear when searching "water resistant accessories"', () => {
    const result = AIEngine.executeDeterministicSearch(
      mockCatalogProducts,
      'water resistant accessories'
    );

    expect(result.products.length).toBeGreaterThan(0);
    const productIds = result.products.map((p) => p.id);
    expect(productIds.includes('prod_slv_05') || productIds.includes('prod_bpk_07')).toBe(true);
  });

  it('should match categories when searching "show me products in Accessories"', () => {
    const result = AIEngine.executeDeterministicSearch(
      mockCatalogProducts,
      'show me products in Accessories'
    );

    expect(result.products.length).toBeGreaterThan(0);
    const accessoriesMatches = result.products.filter((p) => p.category === 'Accessories');
    expect(accessoriesMatches.length).toBeGreaterThan(0);
  });

  it('should return 0 matches and honest summary when searching completely unrelated items', () => {
    const result = AIEngine.executeDeterministicSearch(
      mockCatalogProducts,
      'astronomy telescope observatory lens'
    );

    expect(result.products.length).toBe(0);
    expect(result.summary).toContain('No products found');
  });
});
