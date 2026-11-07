export const SITE_CONFIG = {
  name: "Reflection Scrap Solutions LLP",
  shortName: "Reflection Scrap",
  tagline: "Turn Your Scrap Into Value",
  llpin: "LLPIN ACY-4261",
  description:
    "Reflection Scrap Solutions LLP is a premier waste collection and scrap trading company based in MIDC, Andheri East, Mumbai. We provide doorstep scrap collection, on-the-spot accurate digital weighing, and instant payment for recyclables, industrial scrap, and electronics.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://reflectionscrap.com",
  
  // Location & Address
  address: {
    street: "MIDC, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400093",
    country: "India",
    full: "MIDC, Andheri East, Mumbai, Maharashtra 400093",
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15079.79979727506!2d72.8687352!3d19.1172151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c83c27187653%3A0x6b24cbff3ea11942!2sMIDC%20Industrial%20Area%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra%20400093!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    geo: {
      latitude: 19.117215,
      longitude: 72.868735,
    },
  },

  // Operating Hours
  operatingHours: {
    days: "Monday to Sunday",
    hours: "8:00 AM to 10:00 PM",
    display: "Mon - Sun: 8:00 AM - 10:00 PM",
    opens: "08:00",
    closes: "22:00",
  },

  // Contact Information (Configurable placeholders)
  contact: {
    phone: "+91 98200 12345", // Replace with registered phone
    phoneRaw: "+919820012345",
    whatsapp: "+91 98200 12345", // Replace with registered WhatsApp
    whatsappRaw: "919820012345",
    email: "contact@reflectionscrap.com",
    whatsappMessage: "Hello Reflection Scrap Solutions, I would like to schedule a scrap pickup.",
  },

  // Core Services
  services: [
    {
      id: "waste-collection",
      title: "Waste Collection",
      shortDescription:
        "Scheduled and on-demand waste collection for households, housing societies, offices, and commercial spaces.",
      fullDescription:
        "We provide comprehensive waste collection services designed to simplify segregation and disposal. Whether you are clearing out residential surplus or managing institutional waste, our team ensures punctual and organized pickup.",
      icon: "Trash2",
    },
    {
      id: "scrap-trading",
      title: "Scrap Trading",
      shortDescription:
        "Transparent trading of ferrous and non-ferrous metals, paper, plastics, and secondary raw materials.",
      fullDescription:
        "Operating from Mumbai's commercial manufacturing heartland in Andheri MIDC, we trade recyclable scrap materials with direct access to end-processors, ensuring competitive market-linked rates.",
      icon: "TrendingUp",
    },
    {
      id: "recycling",
      title: "Recycling",
      shortDescription:
        "Responsible material segregation and processing to redirect reusable resources away from city landfills.",
      fullDescription:
        "Every kilogram of scrap collected is systematically sorted, baled, and transferred to authorized re-smelters and recycling units, minimizing environmental impact and supporting the circular economy.",
      icon: "Recycle",
    },
    {
      id: "doorstep-pickup",
      title: "Doorstep Pickup",
      shortDescription:
        "Hassle-free doorstep pickup with certified electronic scales and prompt on-the-spot payment.",
      fullDescription:
        "Book a convenient slot online. Our trained collection personnel arrive at your premises with calibrated digital scales, weigh the materials before you, and pay instantly via UPI or cash.",
      icon: "Truck",
    },
    {
      id: "ewaste-and-electronics",
      title: "E-Waste & Electronics",
      shortDescription:
        "Safe disposal and recovery of obsolete computers, electronic appliances, circuit boards, and batteries.",
      fullDescription:
        "Electronic waste contains hazardous elements alongside valuable metals. We collect electronic scrap, consumer gadgets, and battery units under rigorous handling protocols for certified processing.",
      icon: "Cpu",
    },
    {
      id: "bulk-commercial-scrap",
      title: "Bulk & Commercial Scrap",
      shortDescription:
        "High-volume scrap clearance for factories, workshops, fabrication units, and IT corporate parks.",
      fullDescription:
        "Tailored contracts for industrial waste, decommissioned machinery, structural metal beams, construction scrap, and warehouse inventory clearances across Mumbai.",
      icon: "Building2",
    },
  ],

  // Trust Strip Pillars
  trustPillars: [
    {
      title: "Fair Rates",
      description: "Market-aligned, transparent pricing updated regularly.",
      icon: "BadgeIndianRupee",
    },
    {
      title: "Accurate Weighing",
      description: "Precision digital weighing scales right at your doorstep.",
      icon: "Scale",
    },
    {
      title: "On-the-spot Payment",
      description: "Immediate UPI transfer or cash upon weighing completion.",
      icon: "Zap",
    },
    {
      title: "7 Days a Week",
      description: "Operating Monday to Sunday from 8:00 AM to 10:00 PM.",
      icon: "CalendarCheck",
    },
  ],

  // How It Works Steps
  howItWorks: [
    {
      step: "01",
      title: "Book a Pickup or Drop Off",
      description:
        "Select your scrap items, enter your Mumbai address, and choose your preferred date and time slot. Alternatively, visit our MIDC yard.",
      icon: "Calendar",
    },
    {
      step: "02",
      title: "Doorstep Weighing",
      description:
        "Our verified pickup team arrives with ISO-certified digital weighing scales to evaluate each material category transparently.",
      icon: "Scale",
    },
    {
      step: "03",
      title: "On-the-spot Payment",
      description:
        "Review the measured weights and final total. Receive immediate payment directly to your bank account via UPI or cash.",
      icon: "Wallet",
    },
    {
      step: "04",
      title: "Responsible Recycling",
      description:
        "Your scrap is categorized and delivered to licensed recycling partners, preserving resources and reducing landfill load.",
      icon: "Recycle",
    },
  ],

  // What We Accept Categories
  acceptedCategories: [
    {
      id: "iron-steel",
      name: "Iron & Steel",
      description: "Cast iron, mild steel rods, pipes, beams, tin cans, fabrication scrap, structural angles.",
      icon: "Hammer",
    },
    {
      id: "copper",
      name: "Copper",
      description: "Copper wiring, armature, heavy copper pipes, copper utensils, motor winding scrap.",
      icon: "Zap",
    },
    {
      id: "brass",
      name: "Brass",
      description: "Brass hardware, fittings, decorative fixtures, plumbing valves, musical instruments.",
      icon: "Coins",
    },
    {
      id: "aluminium",
      name: "Aluminium",
      description: "Aluminium beverage cans, window frames, engine heads, kitchen utensils, cables, foils.",
      icon: "Layers",
    },
    {
      id: "stainless-steel",
      name: "Stainless Steel",
      description: "SS 304, SS 316 industrial scrap, kitchen cookware, sinks, hospital and lab equipment.",
      icon: "Shield",
    },
    {
      id: "plastic",
      name: "Plastic",
      description: "Rigid plastic, HDPE bottles, plastic crates, buckets, pipes, PET bottles, drums.",
      icon: "Package",
    },
    {
      id: "paper-cardboard",
      name: "Paper & Cardboard",
      description: "Old corrugated cartons (boxes), newspapers (raddi), office records, shredded documents, magazines.",
      icon: "FileText",
    },
    {
      id: "ewaste",
      name: "E-Waste",
      description: "Desktop CPUs, laptops, computer monitors, motherboards, servers, telecom gear, wires.",
      icon: "Cpu",
    },
    {
      id: "batteries",
      name: "Batteries",
      description: "Lead-acid vehicle batteries, inverter batteries, UPS backup units, industrial battery banks.",
      icon: "BatteryCharging",
    },
    {
      id: "appliances",
      name: "Appliances",
      description: "Air conditioners, refrigerators, washing machines, microwaves, water heaters, water coolers.",
      icon: "Tv",
    },
  ],

  // Pickup Slots
  timeSlots: [
    { id: "slot-1", label: "8:00 AM - 12:00 PM", window: "Morning" },
    { id: "slot-2", label: "12:00 PM - 4:00 PM", window: "Afternoon" },
    { id: "slot-3", label: "4:00 PM - 8:00 PM", window: "Evening" },
    { id: "slot-4", label: "8:00 PM - 10:00 PM", window: "Night" },
  ],

  // FAQs
  faqs: [
    {
      question: "How do you calculate the payment for my scrap?",
      answer:
        "Payment is calculated precisely using the actual weight measured on our digital scales multiplied by the live per-kilogram rate for that specific scrap category. You will see the scale reading directly.",
    },
    {
      question: "What payment methods are supported on the spot?",
      answer:
        "We support instant UPI payments (Google Pay, PhonePe, Paytm, BHIM) as well as direct cash payment immediately after weighing.",
    },
    {
      question: "Is there a minimum weight requirement for doorstep pickup?",
      answer:
        "For residential pickups, we recommend having at least 10–15 kg of combined scrap materials so we can route our pickup vehicle efficiently. For bulk or commercial quantities, there is no upper limit.",
    },
    {
      question: "Can I drop off scrap directly at your yard?",
      answer:
        "Yes! You can visit our collection facility in MIDC, Andheri East, Mumbai, anytime Monday to Sunday between 8:00 AM and 10:00 PM for direct weighing and instant settlement.",
    },
    {
      question: "Which areas in Mumbai do you service?",
      answer:
        "We primarily serve Andheri East, MIDC, Marol, Saki Naka, Powai, and surrounding Mumbai suburbs. You can enter your 6-digit Mumbai pincode in our booking flow to verify instant eligibility.",
    },
    {
      question: "Do you handle industrial clearances and office dismantling?",
      answer:
        "Yes, we specialize in high-volume industrial scrap, fabrication offcuts, decommissioned plant machinery, and corporate IT asset disposal with certified weighing and compliant documentation.",
    },
  ],
};
