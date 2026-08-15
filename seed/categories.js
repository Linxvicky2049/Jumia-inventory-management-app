const dotenv = require("dotenv");
const connectDB = require("../config/databaseConfig");
const Category = require("../models/Category");

dotenv.config();

const categories = [
  {
    name: "Electronics",
    description: "Electronic devices and accessories",
  },
  {
    name: "Phones & Tablets",
    description: "Mobile phones, tablets and related accessories",
  },
  {
    name: "Computers & Accessories",
    description: "Laptops, desktops, computer peripherals and accessories",
  },
  {
    name: "Fashion",
    description: "Clothing, footwear, bags and fashion accessories",
  },
  {
    name: "Home & Kitchen",
    description: "Home furnishings, cookware, kitchenware and household products",
  },
  {
    name: "Health & Beauty",
    description: "Beauty products, cosmetics and personal care items",
  },
  {
    name: "Groceries",
    description: "Food, beverages and everyday household consumables",
  },
  {
    name: "Baby Products",
    description: "Baby clothing, diapers, feeding products and baby accessories",
  },
  {
    name: "Sports & Fitness",
    description: "Sportswear, fitness equipment and sporting goods",
  },
  {
    name: "Automotive",
    description: "Automotive parts, tools and vehicle accessories",
  },
  {
    name: "Tools & Home Improvement",
    description: "Hand tools, power tools, hardware and home improvement products",
  },
  {
    name: "Books & Stationery",
    description: "Books, school supplies, office supplies and stationery",
  },
  {
    name: "Gaming",
    description: "Gaming consoles, video games and gaming accessories",
  },
  {
    name: "Jewelry & Watches",
    description: "Jewelry, watches and related accessories",
  },
  {
    name: "Pet Supplies",
    description: "Pet food, toys, grooming products and pet accessories",
  },
  {
    name: "Garden & Outdoor",
    description: "Gardening tools, outdoor equipment and outdoor living products",
  },
  {
    name: "Appliances",
    description:
      "Home appliances including refrigerators, washing machines and cookers",
  },
  {
    name: "Office Equipment",
    description:
      "Printers, scanners, office machines and workplace equipment",
  },
  {
    name: "Musical Instruments",
    description:
      "Musical instruments, audio equipment and instrument accessories",
  },
  {
    name: "Industrial & Scientific",
    description:
      "Industrial equipment, laboratory supplies and scientific products",
  },
];

const seedCategories = async () => {
  try {
    // Use the same MongoDB connection as the main application
    await connectDB();

    console.log("MongoDB connected.");

    let created = 0;
    let skipped = 0;

    for (const category of categories) {
      const existingCategory = await Category.findOne({
        name: category.name,
      });

      if (existingCategory) {
        console.log(`⏭️ Skipped: ${category.name}`);
        skipped++;
        continue;
      }

      await Category.create(category);

      console.log(`✅ Created: ${category.name}`);
      created++;
    }

    console.log("\n================================");
    console.log("Category seeding completed");
    console.log("================================");
    console.log(`Created: ${created}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total:   ${categories.length}`);
    console.log("================================");

    await require("mongoose").connection.close();

    process.exit(0);
  } catch (error) {
    console.error("❌ Category seeding failed:");
    console.error(error);

    try {
      await require("mongoose").connection.close();
    } catch (closeError) {
      console.error("Failed to close MongoDB connection:", closeError.message);
    }

    process.exit(1);
  }
};

seedCategories();