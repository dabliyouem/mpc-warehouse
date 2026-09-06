// Default Warehouse Configuration and Initial Inventory Data
const DEFAULT_CONFIG = {
  warehouseName: "MPC/SRC WAREHOUSE",
  phone: "+1 234 567 8900",
  whatsapp: "12345678900", // International format digits only for wa.me
  adminPassword: "admin123" // Default password for admin panel
};

const INITIAL_PRODUCTS = [
  {
    id: "prod-101",
    ref: "REF-PWR-8820",
    designation: "Industrial Heavy-Duty Rotary Hammer Drill 1200W",
    category: "Tools & Equipment",
    type: "Power Tools",
    qte: 145,
    unit: "pcs",
    description: "High impact energy rotary drill with anti-vibration handle. Suitable for concrete, masonry, and steel reinforcement drilling. Includes transport case and 3 drill bits.",
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-102",
    ref: "REF-PWR-8825",
    designation: "Brushless Cordless Impact Wrench 20V (4.0Ah Li-ion)",
    category: "Tools & Equipment",
    type: "Cordless Tools",
    qte: 92,
    unit: "pcs",
    description: "Variable speed high torque wrench with dual rechargeable lithium batteries. Built-in LED work light and belt clip.",
    images: [
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-103",
    ref: "REF-PLM-4010",
    designation: "Heavy-Duty Brass Ball Valve 1-inch Female-to-Female (Full Port)",
    category: "Plumbing & Piping",
    type: "Valves & Fittings",
    qte: 620,
    unit: "pcs",
    description: "Forged brass construction with chrome-plated ball and PTFE seals. Rated for water, oil, and gas applications up to 600 WOG.",
    images: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-104",
    ref: "REF-PLM-4025",
    designation: "PEX-AL-PEX Multilayer Composite Plumbing Pipe Roll 16mm x 2.0mm",
    category: "Plumbing & Piping",
    type: "Pipes & Coils",
    qte: 75,
    unit: "rolls",
    description: "Premium oxygen barrier multilayer pipe for underfloor heating and potable water lines. 100% leak-proof and corrosion-resistant.",
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-105",
    ref: "REF-ELC-1205",
    designation: "Industrial Waterproof Electrical Junction Box IP66 (200x150x100mm)",
    category: "Electrical & Lighting",
    type: "Enclosures",
    qte: 310,
    unit: "pcs",
    description: "ABS thermoplastic waterproof distribution box with transparent polycarbonate door and internal mounting DIN rail.",
    images: [
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-106",
    ref: "REF-ELC-1290",
    designation: "Commercial High-Bay LED Warehouse Floodlight 150W (19,500 Lumens)",
    category: "Electrical & Lighting",
    type: "Lighting",
    qte: 88,
    unit: "units",
    description: "Ultra-bright industrial UFO high bay light with die-cast aluminum heat sink and Meanwell driver. Instant start with 120° beam angle.",
    images: [
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-107",
    ref: "REF-LOG-5001",
    designation: "Standard Euro Wooden Pallet 1200x800mm (Heat Treated ISPM15)",
    category: "Storage & Packaging",
    type: "Pallets",
    qte: 450,
    unit: "units",
    description: "Certified EPAL grade A heavy-duty four-way wooden pallets. Heat treated according to international export phytosanitary standards.",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-108",
    ref: "REF-LOG-5088",
    designation: "Industrial Hand Stretch Film Wrap 500mm x 300m (23 Microns)",
    category: "Storage & Packaging",
    type: "Packaging",
    qte: 850,
    unit: "rolls",
    description: "High tensile strength clear cast pallet wrap. Puncture resistant with high cling for securing palletized shipments during transit.",
    images: [
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-109",
    ref: "REF-SAF-3012",
    designation: "Steel-Toe Safety Work Boots S3 SRC (Waterproof Leather)",
    category: "Safety & PPE",
    type: "Footwear",
    qte: 190,
    unit: "pairs",
    description: "Anti-puncture steel midsole, oil-resistant and slip-resistant PU double density sole with breathable inner lining. Sizes 39-46 available.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-110",
    ref: "REF-SAF-3040",
    designation: "High-Visibility Reflective Safety Vests Class 2 (Fluo Yellow)",
    category: "Safety & PPE",
    type: "Workwear",
    qte: 1200,
    unit: "pcs",
    description: "100% polyester breathable mesh vest with 2-inch wide 360° reflective strips, front zipper closure, and multi-pocket chest design.",
    images: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-111",
    ref: "REF-MAT-7100",
    designation: "Galvanized Steel Hex Head Bolts & Nuts Assortment (M8 - M12)",
    category: "Hardware & Fasteners",
    type: "Fasteners",
    qte: 350,
    unit: "boxes",
    description: "Grade 8.8 zinc-plated structural carbon steel hex bolts with matching nylon lock nuts and flat washers. High corrosion resistance.",
    images: [
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod-112",
    ref: "REF-MAT-7210",
    designation: "Heavy-Duty Hydraulic Hand Pallet Jack 3.0 Ton (3000 kg)",
    category: "Storage & Packaging",
    type: "Handling",
    qte: 18,
    unit: "units",
    description: "Industrial manual pallet truck with reinforced fork frame and dual tandem polyurethane load rollers. Smooth hydraulic release.",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=900&q=80"
    ]
  }
];
