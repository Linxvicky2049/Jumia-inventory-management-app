const mongoose = require("mongoose");
const connectDB = require("../config/databaseConfig");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");

const products = [
  // =========================
  // ELECTRONICS
  // =========================
  {
    name: "Samsung 55 Inch 4K Smart TV",
    sku: "SAM-TV-55-4K",
    barcode: "890100000001",
    description: "55-inch 4K Ultra HD Smart LED television",
    category: "Electronics",
    supplier: "Samsung Nigeria",
    price: 850000,
    costPrice: 760000,
    quantity: 12,
    minimumStock: 3,
  },
  {
    name: "Samsung 43 Inch Smart TV",
    sku: "SAM-TV-43-SMART",
    barcode: "890100000002",
    description: "43-inch Full HD Smart LED television",
    category: "Electronics",
    supplier: "Samsung Nigeria",
    price: 520000,
    costPrice: 460000,
    quantity: 15,
    minimumStock: 4,
  },
  {
    name: "Samsung Bluetooth Soundbar",
    sku: "SAM-SB-450",
    barcode: "890100000003",
    description: "Wireless Bluetooth soundbar with powerful bass",
    category: "Electronics",
    supplier: "Samsung Nigeria",
    price: 185000,
    costPrice: 150000,
    quantity: 20,
    minimumStock: 5,
  },
  {
    name: "JBL Portable Bluetooth Speaker",
    sku: "JBL-SPK-001",
    barcode: "890100000004",
    description: "Portable wireless Bluetooth speaker",
    category: "Electronics",
    price: 145000,
    costPrice: 115000,
    quantity: 25,
    minimumStock: 5,
  },

  // =========================
  // PHONES & TABLETS
  // =========================
  {
    name: "Samsung Galaxy A15 128GB",
    sku: "SAM-A15-128",
    barcode: "890100000005",
    description: "Samsung Galaxy A15 smartphone with 128GB storage",
    category: "Phones & Tablets",
    supplier: "Samsung Nigeria",
    price: 250000,
    costPrice: 220000,
    quantity: 30,
    minimumStock: 8,
  },
  {
    name: "Samsung Galaxy A25 128GB",
    sku: "SAM-A25-128",
    barcode: "890100000006",
    description: "Samsung Galaxy A25 5G smartphone",
    category: "Phones & Tablets",
    supplier: "Samsung Nigeria",
    price: 385000,
    costPrice: 340000,
    quantity: 22,
    minimumStock: 6,
  },
  {
    name: "Samsung Galaxy S24",
    sku: "SAM-S24-256",
    barcode: "890100000007",
    description: "Samsung Galaxy S24 256GB smartphone",
    category: "Phones & Tablets",
    supplier: "Samsung Nigeria",
    price: 1050000,
    costPrice: 920000,
    quantity: 10,
    minimumStock: 3,
  },
  {
    name: "Samsung Galaxy Tab A9",
    sku: "SAM-TABA9-64",
    barcode: "890100000008",
    description: "Samsung Galaxy Tab A9 64GB tablet",
    category: "Phones & Tablets",
    supplier: "Samsung Nigeria",
    price: 285000,
    costPrice: 245000,
    quantity: 18,
    minimumStock: 5,
  },

  // =========================
  // COMPUTERS & ACCESSORIES
  // =========================
  {
    name: "HP 15 Core i5 Laptop",
    sku: "HP-15-I5-001",
    barcode: "890100000009",
    description: "HP 15-inch laptop with Intel Core i5 processor",
    category: "Computers & Accessories",
    price: 780000,
    costPrice: 690000,
    quantity: 10,
    minimumStock: 3,
  },
  {
    name: "Lenovo IdeaPad 3",
    sku: "LEN-IP3-I5-001",
    barcode: "890100000010",
    description: "Lenovo IdeaPad 3 laptop",
    category: "Computers & Accessories",
    price: 720000,
    costPrice: 640000,
    quantity: 12,
    minimumStock: 3,
  },
  {
    name: "Logitech Wireless Mouse",
    sku: "LOG-MOUSE-WL",
    barcode: "890100000011",
    description: "Wireless optical computer mouse",
    category: "Computers & Accessories",
    price: 18000,
    costPrice: 12000,
    quantity: 50,
    minimumStock: 10,
  },
  {
    name: "HP Wireless Keyboard",
    sku: "HP-KEY-WL-001",
    barcode: "890100000012",
    description: "Wireless keyboard for desktop and laptop computers",
    category: "Computers & Accessories",
    price: 25000,
    costPrice: 18000,
    quantity: 45,
    minimumStock: 10,
  },

  // =========================
  // FASHION
  // =========================
  {
    name: "Men's Classic Polo Shirt",
    sku: "FAS-MEN-POLO-001",
    barcode: "890100000013",
    description: "Classic cotton polo shirt",
    category: "Fashion",
    price: 22000,
    costPrice: 14000,
    quantity: 80,
    minimumStock: 15,
  },
  {
    name: "Women's Casual Handbag",
    sku: "FAS-WOM-BAG-001",
    barcode: "890100000014",
    description: "Elegant women's casual handbag",
    category: "Fashion",
    price: 35000,
    costPrice: 23000,
    quantity: 45,
    minimumStock: 10,
  },
  {
    name: "Men's Leather Sneakers",
    sku: "FAS-MEN-SNK-001",
    barcode: "890100000015",
    description: "Casual leather sneakers for men",
    category: "Fashion",
    price: 48000,
    costPrice: 32000,
    quantity: 35,
    minimumStock: 8,
  },
  {
    name: "Women's Casual Sneakers",
    sku: "FAS-WOM-SNK-001",
    barcode: "890100000016",
    description: "Comfortable women's casual sneakers",
    category: "Fashion",
    price: 42000,
    costPrice: 28000,
    quantity: 40,
    minimumStock: 8,
  },

  // =========================
  // HOME & KITCHEN
  // =========================
  {
    name: "Non-Stick Cooking Pot Set",
    sku: "HOM-POT-SET-001",
    barcode: "890100000017",
    description: "Professional non-stick cooking pot set",
    category: "Home & Kitchen",
    price: 85000,
    costPrice: 60000,
    quantity: 25,
    minimumStock: 5,
  },
  {
    name: "Electric Blender 1.5L",
    sku: "HOM-BLD-15L-001",
    barcode: "890100000018",
    description: "1.5 litre electric kitchen blender",
    category: "Home & Kitchen",
    price: 55000,
    costPrice: 38000,
    quantity: 30,
    minimumStock: 6,
  },
  {
    name: "Stainless Steel Cutlery Set",
    sku: "HOM-CUT-SET-001",
    barcode: "890100000019",
    description: "24-piece stainless steel cutlery set",
    category: "Home & Kitchen",
    price: 28000,
    costPrice: 18000,
    quantity: 35,
    minimumStock: 7,
  },

  // =========================
  // HEALTH & BEAUTY
  // =========================
  {
    name: "Electric Hair Clipper",
    sku: "BEA-CLIP-001",
    barcode: "890100000020",
    description: "Rechargeable electric hair clipper",
    category: "Health & Beauty",
    price: 32000,
    costPrice: 22000,
    quantity: 40,
    minimumStock: 8,
  },
  {
    name: "Facial Cleansing Brush",
    sku: "BEA-FCBR-001",
    barcode: "890100000021",
    description: "Rechargeable facial cleansing brush",
    category: "Health & Beauty",
    price: 18000,
    costPrice: 11000,
    quantity: 35,
    minimumStock: 7,
  },
  {
    name: "Professional Hair Dryer",
    sku: "BEA-DRYER-001",
    barcode: "890100000022",
    description: "Professional ionic hair dryer",
    category: "Health & Beauty",
    price: 42000,
    costPrice: 29000,
    quantity: 25,
    minimumStock: 5,
  },

  // =========================
  // GROCERIES
  // =========================
  {
    name: "Premium Long Grain Rice 5kg",
    sku: "GRO-RICE-5KG",
    barcode: "890100000023",
    description: "Premium long grain parboiled rice",
    category: "Groceries",
    price: 12000,
    costPrice: 9500,
    quantity: 100,
    minimumStock: 20,
  },
  {
    name: "Vegetable Cooking Oil 2L",
    sku: "GRO-OIL-2L",
    barcode: "890100000024",
    description: "Premium vegetable cooking oil",
    category: "Groceries",
    price: 8500,
    costPrice: 6800,
    quantity: 90,
    minimumStock: 20,
  },
  {
    name: "Breakfast Cereal 500g",
    sku: "GRO-CEREAL-500",
    barcode: "890100000025",
    description: "Breakfast cereal 500g pack",
    category: "Groceries",
    price: 6500,
    costPrice: 4800,
    quantity: 70,
    minimumStock: 15,
  },

  // =========================
  // BABY PRODUCTS
  // =========================
  {
    name: "Baby Diapers Size 3",
    sku: "BAB-DIAP-S3",
    barcode: "890100000026",
    description: "Comfortable baby diapers size 3",
    category: "Baby Products",
    price: 18000,
    costPrice: 14000,
    quantity: 60,
    minimumStock: 15,
  },
  {
    name: "Baby Feeding Bottle 250ml",
    sku: "BAB-BOT-250",
    barcode: "890100000027",
    description: "BPA-free baby feeding bottle",
    category: "Baby Products",
    price: 7500,
    costPrice: 5000,
    quantity: 50,
    minimumStock: 10,
  },
  {
    name: "Baby Cotton Romper",
    sku: "BAB-ROMPER-001",
    barcode: "890100000028",
    description: "Soft cotton baby romper",
    category: "Baby Products",
    price: 12000,
    costPrice: 7500,
    quantity: 45,
    minimumStock: 10,
  },

  // =========================
  // SPORTS & FITNESS
  // =========================
  {
    name: "Adjustable Dumbbell Set",
    sku: "SPT-DUMB-ADJ",
    barcode: "890100000029",
    description: "Adjustable home fitness dumbbell set",
    category: "Sports & Fitness",
    price: 95000,
    costPrice: 70000,
    quantity: 20,
    minimumStock: 5,
  },
  {
    name: "Yoga Mat Premium",
    sku: "SPT-YOGA-MAT",
    barcode: "890100000030",
    description: "Non-slip premium exercise yoga mat",
    category: "Sports & Fitness",
    price: 18000,
    costPrice: 11000,
    quantity: 40,
    minimumStock: 8,
  },
  {
    name: "Professional Football",
    sku: "SPT-FBL-PRO",
    barcode: "890100000031",
    description: "Professional size 5 football",
    category: "Sports & Fitness",
    price: 28000,
    costPrice: 19000,
    quantity: 30,
    minimumStock: 6,
  },

  // =========================
  // AUTOMOTIVE
  // =========================
  {
    name: "Car Phone Holder",
    sku: "AUT-PHONE-HLD",
    barcode: "890100000032",
    description: "Universal dashboard car phone holder",
    category: "Automotive",
    price: 12000,
    costPrice: 7500,
    quantity: 60,
    minimumStock: 15,
  },
  {
    name: "Car Battery Charger",
    sku: "AUT-BATT-CHG",
    barcode: "890100000033",
    description: "Portable intelligent car battery charger",
    category: "Automotive",
    price: 45000,
    costPrice: 32000,
    quantity: 25,
    minimumStock: 5,
  },
  {
    name: "Car Emergency Tool Kit",
    sku: "AUT-TOOL-KIT",
    barcode: "890100000034",
    description: "Multi-purpose automotive emergency tool kit",
    category: "Automotive",
    price: 38000,
    costPrice: 26000,
    quantity: 30,
    minimumStock: 6,
  },

  // =========================
  // TOOLS & HOME IMPROVEMENT
  // =========================
  {
    name: "Cordless Power Drill",
    sku: "TLS-DRILL-001",
    barcode: "890100000035",
    description: "18V cordless power drill",
    category: "Tools & Home Improvement",
    price: 85000,
    costPrice: 62000,
    quantity: 20,
    minimumStock: 5,
  },
  {
    name: "Professional Screwdriver Set",
    sku: "TLS-SCREW-SET",
    barcode: "890100000036",
    description: "Multi-piece professional screwdriver set",
    category: "Tools & Home Improvement",
    price: 24000,
    costPrice: 16000,
    quantity: 40,
    minimumStock: 8,
  },
  {
    name: "Measuring Tape 5 Metres",
    sku: "TLS-TAPE-5M",
    barcode: "890100000037",
    description: "Heavy-duty 5 metre measuring tape",
    category: "Tools & Home Improvement",
    price: 8500,
    costPrice: 5000,
    quantity: 55,
    minimumStock: 10,
  },

  // =========================
  // BOOKS & STATIONERY
  // =========================
  {
    name: "A4 Spiral Notebook",
    sku: "BKS-NOTE-A4",
    barcode: "890100000038",
    description: "Hardcover A4 spiral notebook",
    category: "Books & Stationery",
    price: 5500,
    costPrice: 3500,
    quantity: 100,
    minimumStock: 20,
  },
  {
    name: "Executive Ballpoint Pen Set",
    sku: "BKS-PEN-EXEC",
    barcode: "890100000039",
    description: "Premium executive ballpoint pen set",
    category: "Books & Stationery",
    price: 8500,
    costPrice: 5000,
    quantity: 70,
    minimumStock: 15,
  },
  {
    name: "Scientific Calculator",
    sku: "BKS-CALC-SCI",
    barcode: "890100000040",
    description: "Advanced scientific calculator",
    category: "Books & Stationery",
    price: 22000,
    costPrice: 15000,
    quantity: 35,
    minimumStock: 7,
  },

  // =========================
  // GAMING
  // =========================
  {
    name: "PlayStation 5 Slim",
    sku: "GAM-PS5-SLIM",
    barcode: "890100000041",
    description: "PlayStation 5 Slim gaming console",
    category: "Gaming",
    supplier: "Samsung Nigeria",
    price: 1050000,
    costPrice: 920000,
    quantity: 8,
    minimumStock: 2,
  },
  {
    name: "Xbox Wireless Controller",
    sku: "GAM-XBOX-CTRL",
    barcode: "890100000042",
    description: "Wireless controller for Xbox consoles",
    category: "Gaming",
    price: 95000,
    costPrice: 70000,
    quantity: 25,
    minimumStock: 5,
  },
  {
    name: "Gaming Headset RGB",
    sku: "GAM-HSET-RGB",
    barcode: "890100000043",
    description: "RGB gaming headset with microphone",
    category: "Gaming",
    price: 45000,
    costPrice: 30000,
    quantity: 35,
    minimumStock: 7,
  },
  {
    name: "Gaming Mouse RGB",
    sku: "GAM-MOUSE-RGB",
    barcode: "890100000044",
    description: "Programmable RGB gaming mouse",
    category: "Gaming",
    price: 28000,
    costPrice: 18000,
    quantity: 40,
    minimumStock: 8,
  },

  // =========================
  // JEWELRY & WATCHES
  // =========================
  {
    name: "Men's Stainless Steel Wristwatch",
    sku: "JWL-MEN-WATCH",
    barcode: "890100000045",
    description: "Classic stainless steel men's wristwatch",
    category: "Jewelry & Watches",
    price: 55000,
    costPrice: 35000,
    quantity: 30,
    minimumStock: 6,
  },
  {
    name: "Women's Fashion Wristwatch",
    sku: "JWL-WOM-WATCH",
    barcode: "890100000046",
    description: "Elegant women's fashion wristwatch",
    category: "Jewelry & Watches",
    price: 48000,
    costPrice: 30000,
    quantity: 35,
    minimumStock: 7,
  },
  {
    name: "Classic Fashion Bracelet",
    sku: "JWL-BRACELET-01",
    barcode: "890100000047",
    description: "Classic fashion bracelet",
    category: "Jewelry & Watches",
    price: 18000,
    costPrice: 10000,
    quantity: 50,
    minimumStock: 10,
  },

  // =========================
  // PET SUPPLIES
  // =========================
  {
    name: "Premium Dog Food 5kg",
    sku: "PET-DOGFOOD-5K",
    barcode: "890100000048",
    description: "Premium nutritional dog food",
    category: "Pet Supplies",
    price: 28000,
    costPrice: 21000,
    quantity: 40,
    minimumStock: 8,
  },
  {
    name: "Pet Grooming Brush",
    sku: "PET-GROOM-BR",
    barcode: "890100000049",
    description: "Pet grooming and de-shedding brush",
    category: "Pet Supplies",
    price: 9500,
    costPrice: 6000,
    quantity: 45,
    minimumStock: 10,
  },
  {
    name: "Interactive Pet Toy",
    sku: "PET-TOY-INT",
    barcode: "890100000050",
    description: "Interactive toy for cats and dogs",
    category: "Pet Supplies",
    price: 12000,
    costPrice: 7500,
    quantity: 50,
    minimumStock: 10,
  },

  // =========================
  // GARDEN & OUTDOOR
  // =========================
  {
    name: "Garden Hose 20 Metres",
    sku: "GAR-HOSE-20M",
    barcode: "890100000051",
    description: "Flexible 20 metre garden water hose",
    category: "Garden & Outdoor",
    price: 25000,
    costPrice: 17000,
    quantity: 30,
    minimumStock: 6,
  },
  {
    name: "Garden Pruning Shears",
    sku: "GAR-SHEAR-001",
    barcode: "890100000052",
    description: "Heavy-duty garden pruning shears",
    category: "Garden & Outdoor",
    price: 12000,
    costPrice: 7500,
    quantity: 40,
    minimumStock: 8,
  },
  {
    name: "Outdoor Camping Chair",
    sku: "GAR-CAMP-CHR",
    barcode: "890100000053",
    description: "Foldable outdoor camping chair",
    category: "Garden & Outdoor",
    price: 28000,
    costPrice: 19000,
    quantity: 25,
    minimumStock: 5,
  },

  // =========================
  // APPLIANCES
  // =========================
  {
    name: "Hisense 200L Refrigerator",
    sku: "APP-HIS-200L",
    barcode: "890100000054",
    description: "200 litre energy efficient refrigerator",
    category: "Appliances",
    price: 650000,
    costPrice: 570000,
    quantity: 8,
    minimumStock: 2,
  },
  {
    name: "Binatone Electric Kettle",
    sku: "APP-BIN-KETTLE",
    barcode: "890100000055",
    description: "1.7 litre electric kettle",
    category: "Appliances",
    price: 28000,
    costPrice: 19000,
    quantity: 35,
    minimumStock: 7,
  },
  {
    name: "LG 7kg Washing Machine",
    sku: "APP-LG-WM-7KG",
    barcode: "890100000056",
    description: "7kg front load washing machine",
    category: "Appliances",
    price: 620000,
    costPrice: 550000,
    quantity: 7,
    minimumStock: 2,
  },

  // =========================
  // OFFICE EQUIPMENT
  // =========================
  {
    name: "HP LaserJet Printer",
    sku: "OFF-HP-LASER",
    barcode: "890100000057",
    description: "Monochrome laser printer for office use",
    category: "Office Equipment",
    price: 280000,
    costPrice: 230000,
    quantity: 12,
    minimumStock: 3,
  },
  {
    name: "Epson EcoTank Printer",
    sku: "OFF-EPS-ETANK",
    barcode: "890100000058",
    description: "High efficiency EcoTank colour printer",
    category: "Office Equipment",
    price: 320000,
    costPrice: 270000,
    quantity: 10,
    minimumStock: 3,
  },
  {
    name: "Office Paper A4 500 Sheets",
    sku: "OFF-PAPER-A4",
    barcode: "890100000059",
    description: "Premium A4 office printing paper",
    category: "Office Equipment",
    price: 8500,
    costPrice: 6500,
    quantity: 100,
    minimumStock: 20,
  },

  // =========================
  // MUSICAL INSTRUMENTS
  // =========================
  {
    name: "Acoustic Guitar",
    sku: "MUS-GUIT-ACOU",
    barcode: "890100000060",
    description: "Full-size acoustic guitar",
    category: "Musical Instruments",
    price: 85000,
    costPrice: 60000,
    quantity: 15,
    minimumStock: 3,
  },
  {
    name: "Electronic Keyboard 61 Keys",
    sku: "MUS-KEY-61",
    barcode: "890100000061",
    description: "61-key electronic musical keyboard",
    category: "Musical Instruments",
    price: 145000,
    costPrice: 105000,
    quantity: 10,
    minimumStock: 2,
  },
  {
    name: "Dynamic Microphone",
    sku: "MUS-MIC-DYN",
    barcode: "890100000062",
    description: "Professional dynamic vocal microphone",
    category: "Musical Instruments",
    price: 35000,
    costPrice: 23000,
    quantity: 25,
    minimumStock: 5,
  },

  // =========================
  // INDUSTRIAL & SCIENTIFIC
  // =========================
  {
    name: "Digital Multimeter",
    sku: "IND-MULTI-DIG",
    barcode: "890100000063",
    description: "Professional digital multimeter",
    category: "Industrial & Scientific",
    price: 28000,
    costPrice: 18000,
    quantity: 30,
    minimumStock: 6,
  },
  {
    name: "Digital Weighing Scale",
    sku: "IND-SCALE-DIG",
    barcode: "890100000064",
    description: "Digital industrial weighing scale",
    category: "Industrial & Scientific",
    price: 65000,
    costPrice: 45000,
    quantity: 18,
    minimumStock: 4,
  },
  {
    name: "Industrial Safety Helmet",
    sku: "IND-HELMET-001",
    barcode: "890100000065",
    description: "Industrial protective safety helmet",
    category: "Industrial & Scientific",
    price: 8500,
    costPrice: 5500,
    quantity: 60,
    minimumStock: 15,
  },

  // =========================
  // EXTRA PRODUCTS
  // =========================
  {
    name: "USB-C Fast Charging Cable",
    sku: "ACC-USBC-FAST",
    barcode: "890100000066",
    description: "High-speed USB-C charging and data cable",
    category: "Phones & Tablets",
    supplier: "Samsung Nigeria",
    price: 9500,
    costPrice: 5500,
    quantity: 100,
    minimumStock: 20,
  },
  {
    name: "20W USB-C Phone Charger",
    sku: "ACC-CHG-20W",
    barcode: "890100000067",
    description: "20W USB-C fast wall charger",
    category: "Phones & Tablets",
    supplier: "Samsung Nigeria",
    price: 18000,
    costPrice: 12000,
    quantity: 80,
    minimumStock: 15,
  },
  {
    name: "Laptop Backpack",
    sku: "ACC-LAP-BAG-001",
    barcode: "890100000068",
    description: "Water-resistant laptop backpack",
    category: "Computers & Accessories",
    price: 32000,
    costPrice: 21000,
    quantity: 40,
    minimumStock: 8,
  },
  {
    name: "1080p USB Webcam",
    sku: "ACC-WEBCAM-1080",
    barcode: "890100000069",
    description: "Full HD USB webcam with built-in microphone",
    category: "Computers & Accessories",
    price: 45000,
    costPrice: 30000,
    quantity: 30,
    minimumStock: 6,
  },
  {
    name: "Portable Power Bank 20000mAh",
    sku: "ACC-PBANK-20K",
    barcode: "890100000070",
    description: "20,000mAh portable rechargeable power bank",
    category: "Electronics",
    supplier: "Samsung Nigeria",
    price: 45000,
    costPrice: 30000,
    quantity: 45,
    minimumStock: 10,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("MongoDB connected.");
    console.log(`Preparing to seed ${products.length} products...\n`);

    // =========================
    // LOAD CATEGORIES
    // =========================

    const categories = await Category.find({});

    const categoryMap = new Map(
      categories.map((category) => [
        category.name.toLowerCase(),
        category._id,
      ])
    );

    // =========================
    // LOAD SUPPLIERS
    // =========================

    const suppliers = await Supplier.find({});

    const supplierMap = new Map(
      suppliers.map((supplier) => [
        supplier.companyName.toLowerCase(),
        supplier._id,
      ])
    );

    let created = 0;
    let skipped = 0;

    // =========================
    // CREATE PRODUCTS
    // =========================

    for (const productData of products) {
      const categoryId = categoryMap.get(
        productData.category.toLowerCase()
      );

      if (!categoryId) {
        console.log(
          `❌ Category not found: ${productData.category}`
        );
        continue;
      }

      const existingProduct = await Product.findOne({
        sku: productData.sku,
      });

      if (existingProduct) {
        console.log(`⏭️ Skipped: ${productData.sku}`);
        skipped++;
        continue;
      }

      const product = {
        name: productData.name,
        sku: productData.sku,
        barcode: productData.barcode,
        description: productData.description,
        category: categoryId,
        price: productData.price,
        costPrice: productData.costPrice,
        quantity: productData.quantity,
        minimumStock: productData.minimumStock,
        status: "active",
      };

      // Supplier is optional in Product schema
      if (productData.supplier) {
        const supplierId = supplierMap.get(
          productData.supplier.toLowerCase()
        );

        if (!supplierId) {
          console.log(
            `⚠️ Supplier not found: ${productData.supplier}`
          );
        } else {
          product.supplier = supplierId;
        }
      }

      await Product.create(product);

      console.log(
        `✅ Created: ${productData.sku} - ${productData.name}`
      );

      created++;
    }

    console.log("\n================================");
    console.log("PRODUCT SEEDING COMPLETED");
    console.log("================================");
    console.log(`Products in seed: ${products.length}`);
    console.log(`Created:          ${created}`);
    console.log(`Skipped:          ${skipped}`);
    console.log(`Total processed:  ${created + skipped}`);
    console.log("================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Product seeding failed:");
    console.error(error);

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error(
        "Failed to close MongoDB connection:",
        closeError.message
      );
    }

    process.exit(1);
  }
};

seedProducts();