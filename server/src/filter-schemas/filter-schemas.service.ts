import { Injectable, NotFoundException } from '@nestjs/common';

export type FieldType =
  | 'dropdown'
  | 'multi-select'
  | 'radio'
  | 'checkbox'
  | 'range'
  | 'text'
  | 'number';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FilterFieldSchema {
  key: string;
  label: string;
  type: FieldType;
  options?: FieldOption[];
  dependentOptions?: Record<string, FieldOption[]>;
  dependsOn?: string;
  required?: boolean;
  showInFilters?: boolean;
  showInCreateAd?: boolean;
  priority: number;
  placeholder?: string;
  unit?: string;
  seoParam?: string;
  validation?: { min?: number; max?: number };
}

export interface CategoryFilterSchema {
  categorySlug: string;
  categoryName: string;
  icon: string;
  filters: FilterFieldSchema[];
}

// ─── Static Data ────────────────────────────────────────────────────

const YEARS: FieldOption[] = Array.from({ length: 35 }, (_, i) => {
  const y = 2025 - i;
  return { value: String(y), label: String(y) };
});

const FUEL_TYPES: FieldOption[] = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'CNG' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'lpg', label: 'LPG' },
];

const TRANSMISSION: FieldOption[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'amt', label: 'AMT' },
  { value: 'cvt', label: 'CVT' },
  { value: 'dct', label: 'DCT' },
];

const OWNER_TYPES: FieldOption[] = [
  { value: '1st', label: '1st Owner' },
  { value: '2nd', label: '2nd Owner' },
  { value: '3rd', label: '3rd Owner' },
  { value: '4th+', label: '4th+ Owner' },
];

const CONDITIONS: FieldOption[] = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'for-parts', label: 'For Parts' },
];

const WARRANTY: FieldOption[] = [
  { value: 'under-warranty', label: 'Under Warranty' },
  { value: 'expired', label: 'Warranty Expired' },
  { value: 'no-warranty', label: 'No Warranty' },
];

const CAR_BRANDS: FieldOption[] = [
  { value: 'maruti', label: 'Maruti Suzuki' },
  { value: 'hyundai', label: 'Hyundai' },
  { value: 'tata', label: 'Tata' },
  { value: 'mahindra', label: 'Mahindra' },
  { value: 'honda', label: 'Honda' },
  { value: 'toyota', label: 'Toyota' },
  { value: 'kia', label: 'Kia' },
  { value: 'ford', label: 'Ford' },
  { value: 'renault', label: 'Renault' },
  { value: 'volkswagen', label: 'Volkswagen' },
  { value: 'skoda', label: 'Skoda' },
  { value: 'mg', label: 'MG' },
  { value: 'jeep', label: 'Jeep' },
  { value: 'bmw', label: 'BMW' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'audi', label: 'Audi' },
  { value: 'other', label: 'Other' },
];

const CAR_MODELS: Record<string, FieldOption[]> = {
  maruti: [
    { value: 'swift', label: 'Swift' },
    { value: 'dzire', label: 'Dzire' },
    { value: 'alto', label: 'Alto' },
    { value: 'baleno', label: 'Baleno' },
    { value: 'vitara-brezza', label: 'Vitara Brezza' },
    { value: 'ertiga', label: 'Ertiga' },
    { value: 'wagon-r', label: 'Wagon R' },
    { value: 'ciaz', label: 'Ciaz' },
  ],
  hyundai: [
    { value: 'creta', label: 'Creta' },
    { value: 'i20', label: 'i20' },
    { value: 'i10', label: 'i10' },
    { value: 'verna', label: 'Verna' },
    { value: 'venue', label: 'Venue' },
    { value: 'alcazar', label: 'Alcazar' },
    { value: 'tucson', label: 'Tucson' },
  ],
  tata: [
    { value: 'nexon', label: 'Nexon' },
    { value: 'harrier', label: 'Harrier' },
    { value: 'safari', label: 'Safari' },
    { value: 'altroz', label: 'Altroz' },
    { value: 'tiago', label: 'Tiago' },
    { value: 'punch', label: 'Punch' },
  ],
  mahindra: [
    { value: 'scorpio', label: 'Scorpio' },
    { value: 'thar', label: 'Thar' },
    { value: 'xuv700', label: 'XUV700' },
    { value: 'xuv300', label: 'XUV300' },
    { value: 'bolero', label: 'Bolero' },
  ],
  honda: [
    { value: 'city', label: 'City' },
    { value: 'amaze', label: 'Amaze' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'wr-v', label: 'WR-V' },
    { value: 'cr-v', label: 'CR-V' },
  ],
  toyota: [
    { value: 'fortuner', label: 'Fortuner' },
    { value: 'innova', label: 'Innova' },
    { value: 'camry', label: 'Camry' },
    { value: 'glanza', label: 'Glanza' },
    { value: 'urban-cruiser', label: 'Urban Cruiser' },
  ],
  kia: [
    { value: 'seltos', label: 'Seltos' },
    { value: 'sonet', label: 'Sonet' },
    { value: 'carens', label: 'Carens' },
    { value: 'carnival', label: 'Carnival' },
  ],
  other: [{ value: 'other', label: 'Other' }],
};

const BIKE_BRANDS: FieldOption[] = [
  { value: 'hero', label: 'Hero' },
  { value: 'honda', label: 'Honda' },
  { value: 'bajaj', label: 'Bajaj' },
  { value: 'tvs', label: 'TVS' },
  { value: 'yamaha', label: 'Yamaha' },
  { value: 'royal-enfield', label: 'Royal Enfield' },
  { value: 'suzuki', label: 'Suzuki' },
  { value: 'ktm', label: 'KTM' },
  { value: 'jawa', label: 'Jawa' },
  { value: 'other', label: 'Other' },
];

const BIKE_MODELS: Record<string, FieldOption[]> = {
  hero: [
    { value: 'splendor-plus', label: 'Splendor Plus' },
    { value: 'hf-deluxe', label: 'HF Deluxe' },
    { value: 'glamour', label: 'Glamour' },
    { value: 'xpulse-200', label: 'XPulse 200' },
    { value: 'xtreme-160r', label: 'Xtreme 160R' },
  ],
  honda: [
    { value: 'activa', label: 'Activa' },
    { value: 'shine', label: 'Shine' },
    { value: 'unicorn', label: 'Unicorn' },
    { value: 'cb-hornet', label: 'CB Hornet' },
    { value: 'cb350', label: 'CB350' },
  ],
  bajaj: [
    { value: 'pulsar', label: 'Pulsar' },
    { value: 'avenger', label: 'Avenger' },
    { value: 'dominar', label: 'Dominar' },
    { value: 'platina', label: 'Platina' },
    { value: 'ct100', label: 'CT100' },
  ],
  tvs: [
    { value: 'apache', label: 'Apache' },
    { value: 'jupiter', label: 'Jupiter' },
    { value: 'ntorq', label: 'Ntorq' },
    { value: 'ronin', label: 'Ronin' },
    { value: 'sport', label: 'Sport' },
  ],
  yamaha: [
    { value: 'fz', label: 'FZ' },
    { value: 'r15', label: 'R15' },
    { value: 'mt-15', label: 'MT-15' },
    { value: 'fascino', label: 'Fascino' },
    { value: 'ray-zr', label: 'Ray ZR' },
  ],
  'royal-enfield': [
    { value: 'bullet', label: 'Bullet' },
    { value: 'classic-350', label: 'Classic 350' },
    { value: 'meteor-350', label: 'Meteor 350' },
    { value: 'himalayan', label: 'Himalayan' },
    { value: 'interceptor-650', label: 'Interceptor 650' },
  ],
  other: [{ value: 'other', label: 'Other' }],
};

const MOBILE_BRANDS: FieldOption[] = [
  { value: 'samsung', label: 'Samsung' },
  { value: 'apple', label: 'Apple' },
  { value: 'xiaomi', label: 'Xiaomi / Redmi' },
  { value: 'oneplus', label: 'OnePlus' },
  { value: 'realme', label: 'Realme' },
  { value: 'oppo', label: 'OPPO' },
  { value: 'vivo', label: 'Vivo' },
  { value: 'poco', label: 'POCO' },
  { value: 'motorola', label: 'Motorola' },
  { value: 'nokia', label: 'Nokia' },
  { value: 'google', label: 'Google Pixel' },
  { value: 'other', label: 'Other' },
];

const RAM_OPTIONS: FieldOption[] = [
  { value: '2', label: '2 GB' },
  { value: '3', label: '3 GB' },
  { value: '4', label: '4 GB' },
  { value: '6', label: '6 GB' },
  { value: '8', label: '8 GB' },
  { value: '12', label: '12 GB' },
  { value: '16', label: '16 GB' },
];

const STORAGE_OPTIONS: FieldOption[] = [
  { value: '16', label: '16 GB' },
  { value: '32', label: '32 GB' },
  { value: '64', label: '64 GB' },
  { value: '128', label: '128 GB' },
  { value: '256', label: '256 GB' },
  { value: '512', label: '512 GB' },
  { value: '1024', label: '1 TB' },
];

const ELEC_BRANDS: FieldOption[] = [
  { value: 'samsung', label: 'Samsung' },
  { value: 'lg', label: 'LG' },
  { value: 'sony', label: 'Sony' },
  { value: 'panasonic', label: 'Panasonic' },
  { value: 'whirlpool', label: 'Whirlpool' },
  { value: 'haier', label: 'Haier' },
  { value: 'godrej', label: 'Godrej' },
  { value: 'bosch', label: 'Bosch' },
  { value: 'philips', label: 'Philips' },
  { value: 'voltas', label: 'Voltas' },
  { value: 'other', label: 'Other' },
];

const BHK_OPTIONS: FieldOption[] = [
  { value: '1rk', label: '1 RK' },
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5+', label: '5+ BHK' },
];

const FURNISHING: FieldOption[] = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
];

const PROPERTY_TYPES: FieldOption[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'independent-house', label: 'Independent House' },
  { value: 'villa', label: 'Villa' },
  { value: 'builder-floor', label: 'Builder Floor' },
  { value: 'farmhouse', label: 'Farmhouse' },
];

const CLOTHES_SIZES: FieldOption[] = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
  { value: 'xxxl', label: 'XXXL' },
];

const CLOTH_CONDITIONS: FieldOption[] = [
  { value: 'new-with-tags', label: 'New with Tags' },
  { value: 'new-without-tags', label: 'New without Tags' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

const MATERIALS: FieldOption[] = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'polyester', label: 'Polyester' },
  { value: 'wool', label: 'Wool' },
  { value: 'denim', label: 'Denim' },
  { value: 'linen', label: 'Linen' },
  { value: 'silk', label: 'Silk' },
  { value: 'leather', label: 'Leather' },
  { value: 'other', label: 'Other' },
];

const COLORS: FieldOption[] = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'pink', label: 'Pink' },
  { value: 'grey', label: 'Grey' },
  { value: 'brown', label: 'Brown' },
  { value: 'multicolor', label: 'Multi-color' },
];

const FURNITURE_TYPES: FieldOption[] = [
  { value: 'sofa', label: 'Sofa / Couch' },
  { value: 'bed', label: 'Bed' },
  { value: 'dining-table', label: 'Dining Table' },
  { value: 'wardrobe', label: 'Wardrobe' },
  { value: 'office-chair', label: 'Office Chair' },
  { value: 'study-table', label: 'Study Table' },
  { value: 'bookshelf', label: 'Bookshelf' },
  { value: 'refrigerator', label: 'Refrigerator' },
  { value: 'washing-machine', label: 'Washing Machine' },
  { value: 'other', label: 'Other' },
];

// ─── Schema Definitions ─────────────────────────────────────────────

const SCHEMAS: CategoryFilterSchema[] = [
  {
    categorySlug: 'cars',
    categoryName: 'Cars',
    icon: '🚗',
    filters: [
      { key: 'brand', label: 'Brand', type: 'dropdown', options: CAR_BRANDS, required: true, priority: 1, placeholder: 'Select Brand', seoParam: 'brand' },
      { key: 'model', label: 'Model', type: 'dropdown', dependsOn: 'brand', dependentOptions: CAR_MODELS, required: true, priority: 2, placeholder: 'Select Model', seoParam: 'model' },
      { key: 'year', label: 'Year', type: 'dropdown', options: YEARS, required: true, priority: 3, placeholder: 'Select Year', seoParam: 'year' },
      { key: 'fuel', label: 'Fuel Type', type: 'radio', options: FUEL_TYPES, required: true, priority: 4, seoParam: 'fuel' },
      { key: 'transmission', label: 'Transmission', type: 'radio', options: TRANSMISSION, priority: 5, seoParam: 'transmission' },
      { key: 'owner', label: 'Owner', type: 'radio', options: OWNER_TYPES, required: true, priority: 6, seoParam: 'owner' },
      { key: 'kmDriven', label: 'KM Driven', type: 'range', priority: 7, unit: 'km', validation: { min: 0, max: 1000000 }, seoParam: 'km', showInFilters: true, showInCreateAd: true },
    ],
  },
  {
    categorySlug: 'motorcycles',
    categoryName: 'Motorcycles',
    icon: '🏍️',
    filters: [
      { key: 'brand', label: 'Brand', type: 'dropdown', options: BIKE_BRANDS, required: true, priority: 1, placeholder: 'Select Brand', seoParam: 'brand' },
      { key: 'model', label: 'Model', type: 'dropdown', dependsOn: 'brand', dependentOptions: BIKE_MODELS, required: true, priority: 2, placeholder: 'Select Model', seoParam: 'model' },
      { key: 'year', label: 'Year', type: 'dropdown', options: YEARS, required: true, priority: 3, placeholder: 'Select Year', seoParam: 'year' },
      { key: 'kmDriven', label: 'KM Driven', type: 'range', priority: 4, unit: 'km', validation: { min: 0, max: 500000 }, seoParam: 'km' },
      { key: 'fuel', label: 'Fuel Type', type: 'radio', options: [{ value: 'petrol', label: 'Petrol' }, { value: 'electric', label: 'Electric' }], priority: 5, seoParam: 'fuel' },
    ],
  },
  {
    categorySlug: 'mobile-phones',
    categoryName: 'Mobile Phones',
    icon: '📱',
    filters: [
      { key: 'brand', label: 'Brand', type: 'dropdown', options: MOBILE_BRANDS, required: true, priority: 1, placeholder: 'Select Brand', seoParam: 'brand' },
      { key: 'ram', label: 'RAM', type: 'multi-select', options: RAM_OPTIONS, priority: 2, seoParam: 'ram' },
      { key: 'storage', label: 'Storage', type: 'multi-select', options: STORAGE_OPTIONS, priority: 3, seoParam: 'storage' },
      { key: 'condition', label: 'Condition', type: 'radio', options: CONDITIONS, required: true, priority: 4, seoParam: 'condition' },
      { key: 'warranty', label: 'Warranty', type: 'radio', options: WARRANTY, priority: 5, seoParam: 'warranty' },
    ],
  },
  {
    categorySlug: 'electronics',
    categoryName: 'Electronics & Appliances',
    icon: '💻',
    filters: [
      { key: 'brand', label: 'Brand', type: 'dropdown', options: ELEC_BRANDS, required: true, priority: 1, placeholder: 'Select Brand', seoParam: 'brand' },
      { key: 'condition', label: 'Condition', type: 'radio', options: CONDITIONS, required: true, priority: 2, seoParam: 'condition' },
      { key: 'warranty', label: 'Warranty', type: 'radio', options: WARRANTY, priority: 3, seoParam: 'warranty' },
    ],
  },
  {
    categorySlug: 'for-sale-houses-apartments',
    categoryName: 'Houses & Apartments for Sale',
    icon: '🏠',
    filters: [
      { key: 'bhk', label: 'BHK', type: 'multi-select', options: BHK_OPTIONS, required: true, priority: 1, seoParam: 'bhk' },
      { key: 'propertyType', label: 'Property Type', type: 'radio', options: PROPERTY_TYPES, priority: 2, seoParam: 'type' },
      { key: 'furnishing', label: 'Furnishing', type: 'radio', options: FURNISHING, priority: 3, seoParam: 'furnishing' },
      { key: 'area', label: 'Area', type: 'range', priority: 4, unit: 'sq.ft', validation: { min: 100, max: 100000 }, seoParam: 'area' },
      { key: 'bathrooms', label: 'Bathrooms', type: 'radio', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4+', label: '4+' }], priority: 5, seoParam: 'bathrooms' },
      { key: 'parking', label: 'Parking', type: 'radio', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], priority: 6, seoParam: 'parking' },
    ],
  },
  {
    categorySlug: 'for-rent-houses-apartments',
    categoryName: 'Houses & Apartments for Rent',
    icon: '🏡',
    filters: [
      { key: 'bhk', label: 'BHK', type: 'multi-select', options: BHK_OPTIONS, required: true, priority: 1, seoParam: 'bhk' },
      { key: 'propertyType', label: 'Property Type', type: 'radio', options: PROPERTY_TYPES, priority: 2, seoParam: 'type' },
      { key: 'furnishing', label: 'Furnishing', type: 'radio', options: FURNISHING, priority: 3, seoParam: 'furnishing' },
      { key: 'area', label: 'Area', type: 'range', priority: 4, unit: 'sq.ft', validation: { min: 100, max: 100000 }, seoParam: 'area' },
      { key: 'availableFor', label: 'Available For', type: 'multi-select', options: [{ value: 'family', label: 'Family' }, { value: 'bachelor-male', label: 'Bachelor Male' }, { value: 'bachelor-female', label: 'Bachelor Female' }, { value: 'any', label: 'Any' }], priority: 5, seoParam: 'for' },
      { key: 'parking', label: 'Parking', type: 'radio', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], priority: 6, seoParam: 'parking' },
    ],
  },
  {
    categorySlug: 'fashion',
    categoryName: 'Fashion',
    icon: '👗',
    filters: [
      { key: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'men', label: 'Men' }, { value: 'women', label: 'Women' }, { value: 'kids', label: 'Kids' }, { value: 'unisex', label: 'Unisex' }], required: true, priority: 1, seoParam: 'gender' },
      { key: 'size', label: 'Size', type: 'multi-select', options: CLOTHES_SIZES, priority: 2, seoParam: 'size' },
      { key: 'color', label: 'Color', type: 'multi-select', options: COLORS, priority: 3, seoParam: 'color' },
      { key: 'condition', label: 'Condition', type: 'radio', options: CLOTH_CONDITIONS, required: true, priority: 4, seoParam: 'condition' },
      { key: 'material', label: 'Material', type: 'dropdown', options: MATERIALS, priority: 5, seoParam: 'material', placeholder: 'Select Material' },
      { key: 'brand', label: 'Brand', type: 'text', priority: 6, placeholder: "e.g. Zara, H&M, Levi's", seoParam: 'brand' },
    ],
  },
  {
    categorySlug: 'furniture-home-decor',
    categoryName: 'Furniture & Home Decor',
    icon: '🛋️',
    filters: [
      { key: 'furnitureType', label: 'Type', type: 'dropdown', options: FURNITURE_TYPES, required: true, priority: 1, placeholder: 'Select Type', seoParam: 'type' },
      { key: 'material', label: 'Material', type: 'dropdown', options: [{ value: 'wood', label: 'Wood' }, { value: 'metal', label: 'Metal' }, { value: 'fabric', label: 'Fabric' }, { value: 'leather', label: 'Leather' }, { value: 'glass', label: 'Glass' }, { value: 'plastic', label: 'Plastic' }, { value: 'other', label: 'Other' }], priority: 2, placeholder: 'Select Material', seoParam: 'material' },
      { key: 'condition', label: 'Condition', type: 'radio', options: CONDITIONS, required: true, priority: 3, seoParam: 'condition' },
    ],
  },
  {
    categorySlug: 'jobs',
    categoryName: 'Jobs',
    icon: '💼',
    filters: [
      { key: 'jobType', label: 'Job Type', type: 'radio', options: [{ value: 'full-time', label: 'Full Time' }, { value: 'part-time', label: 'Part Time' }, { value: 'freelance', label: 'Freelance' }, { value: 'internship', label: 'Internship' }], required: true, priority: 1, seoParam: 'type' },
      { key: 'experience', label: 'Experience', type: 'radio', options: [{ value: 'fresher', label: 'Fresher' }, { value: '1-3', label: '1–3 Years' }, { value: '3-5', label: '3–5 Years' }, { value: '5+', label: '5+ Years' }], priority: 2, seoParam: 'exp' },
      { key: 'salary', label: 'Salary (Monthly ₹)', type: 'range', priority: 3, unit: '₹', validation: { min: 0, max: 500000 }, seoParam: 'salary' },
    ],
  },
];

@Injectable()
export class FilterSchemasService {
  findAll(): CategoryFilterSchema[] {
    return SCHEMAS;
  }

  findBySlug(slug: string): CategoryFilterSchema {
    const schema = SCHEMAS.find((s) => s.categorySlug === slug);
    if (!schema) throw new NotFoundException(`No filter schema for category: ${slug}`);
    return schema;
  }

  getSlugs(): string[] {
    return SCHEMAS.map((s) => s.categorySlug);
  }
}
