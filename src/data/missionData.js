// CivicEye Government Alignment, Core Civic Capabilities & Awareness Data

export const CIVIC_CAPABILITIES = [
  {
    id: "garbage",
    icon: "Trash2",
    title: "Garbage Dumps & Overflowing Bins",
    hindiTitle: "कचरा डंप और ओवरफ्लो डस्टबिन",
    badge: "Solid Waste",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dept: "Solid Waste Management Dept",
    sla: "< 4 Hours",
    description: "Instant reporting and AI CCTV detection of roadside garbage blackspots, overflowing community bins, and missed door-to-door collection.",
    impact: "Prevents vector breeding & maintains clean public streets"
  },
  {
    id: "waterlogging",
    icon: "Droplets",
    title: "Waterlogging & Choked Drains",
    hindiTitle: "जलभराव और बंद नाले / नालियां",
    badge: "Drainage",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    dept: "Drainage & Sewerage Board",
    sla: "< 2 Hours",
    description: "Automated alert on choked drainage grates, culvert debris, and stagnant monsoon water accumulation on roads and underpasses.",
    impact: "Zero road submersion & protects underground water flow"
  },
  {
    id: "streetlights",
    icon: "Lightbulb",
    title: "Faulty Street Lights & Dark Zones",
    hindiTitle: "खराब स्ट्रीट लाइट और अंधेरे वाले क्षेत्र",
    badge: "Electrical",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    dept: "Public Works & Electrical Wing",
    sla: "< 12 Hours",
    description: "Identifies non-functional LED streetlights, flickering fixtures, damaged solar poles, and dark unlit accident-prone alleys.",
    impact: "Enhances women's safety & pedestrian nighttime visibility"
  },
  {
    id: "potholes",
    icon: "Construction",
    title: "Road Potholes & Broken Surfaces",
    hindiTitle: "सड़क के गड्ढे और टूटी सड़कें",
    badge: "Roads",
    badgeColor: "bg-orange-50 text-orange-800 border-orange-200",
    dept: "Roads & Highway Maintenance",
    sla: "< 24 Hours",
    description: "Report dangerous asphalt craters, broken road pavers, damaged speed-breakers, and cave-ins before accidents occur.",
    impact: "Prevents two-wheeler accidents & smooths traffic flow"
  },
  {
    id: "manholes",
    icon: "AlertTriangle",
    title: "Open Manholes & Missing Grates",
    hindiTitle: "खुले मैनहोल और गायब ढक्कन",
    badge: "High Hazard",
    badgeColor: "bg-red-50 text-red-800 border-red-200",
    dept: "Municipal Engineering & Safety",
    sla: "< 1 Hour",
    description: "Emergency high-priority detection of uncovered sewer chambers and broken drain grates on pedestrian walkways.",
    impact: "Immediate life-safety hazard prevention"
  },
  {
    id: "water_leak",
    icon: "Pipette",
    title: "Water Pipeline Leaks & Contamination",
    hindiTitle: "पानी पाइपलाइन लीकेज और दूषित जलापूर्ति",
    badge: "Water Supply",
    badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200",
    dept: "Public Health Engineering (PHED)",
    sla: "< 6 Hours",
    description: "Report broken drinking water mains, dirty muddy tap water, and low pressure supply in residential colonies.",
    impact: "Conserves potable water & prevents waterborne illnesses"
  }
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Issue Reported or Detected",
    hindiTitle: "शिकायत दर्ज / AI द्वारा पहचान",
    desc: "A citizen clicks a geotagged photo via the portal, or an automated municipal CCTV camera flags an anomaly (garbage dump, dark pole, flooded drain).",
    icon: "Camera"
  },
  {
    step: "02",
    title: "AI Correlation & Auto-Dispatch",
    hindiTitle: "AI सत्यापन और त्वरित कार्य-आदेश",
    desc: "CivicEye AI removes duplicates, clusters related complaints, and automatically dispatches a prioritized digital work order to the exact municipal team.",
    icon: "Cpu"
  },
  {
    step: "03",
    title: "Field Resolution & Verified Proof",
    hindiTitle: "समाधान और फोटो सत्यापन",
    desc: "Municipal workers resolve the issue on the ground and upload 'After' photo proof. The complaint closes and the citizen earns CivicScore points.",
    icon: "CheckCircle"
  }
];

export const GOV_SCHEMES_LIST = [
  {
    id: "sbm",
    name: "Swachh Bharat Mission (Urban 2.0)",
    hindiName: "स्वच्छ भारत मिशन (शहरी २.०)",
    authority: "Ministry of Housing & Urban Affairs (MoHUA), Govt. of India",
    slogan: "एक कदम स्वच्छता की ओर",
    points: [
      "100% Door-to-Door segregated waste collection (Green & Blue bins)",
      "Elimination of open garbage dumping hotspots",
      "Scientific processing of solid municipal waste"
    ],
    role: "CivicEye AI alerts municipal compactor trucks to uncollected garbage piles within minutes."
  },
  {
    id: "jjh",
    name: "Jal-Jeevan-Hariyali Abhiyan",
    hindiName: "जल-जीवन-हरियाली अभियान (बिहार सरकार)",
    authority: "Environment & Forest Dept / Water Resources Dept, Govt. of Bihar",
    slogan: "जल जीवन हरियाली, तभी होगी खुशहाली",
    points: [
      "Protection & desilting of traditional Aahar-Pyne and public ponds",
      "Clearing plastic and solid waste from natural storm water drains",
      "Rooftop Rainwater Harvesting promotion across all buildings"
    ],
    role: "CivicEye monitors canal inflow grates to prevent choked waterways before monsoon floods."
  },
  {
    id: "sn2",
    name: "Saat Nischay-2: Swachh Shahar, Viksit Shahar",
    hindiName: "सात निश्चय पार्ट-२: स्वच्छ शहर - विकसित शहर",
    authority: "Urban Development & Housing Department (UDHD), Govt. of Bihar",
    slogan: "स्वच्छ वार्ड, सुंदर शहर • विकसित बिहार का मजबूत आधार",
    points: [
      "Modern Storm Water Drainage network to end urban waterlogging",
      "Operational LED streetlighting in every ward and colony",
      "Transparent municipal service delivery with strict SLA timelines"
    ],
    role: "Automatically routes street light faults and drainage blocks to UDHD field teams."
  },
  {
    id: "pnn",
    name: "Patna Municipal Corporation: Chaka Chak Patna",
    hindiName: "पटना नगर निगम: चकाचक पटना अभियान",
    authority: "Patna Municipal Corporation (PMC), Govt. of Bihar",
    slogan: "स्वच्छ पटना, सुंदर पटना • हमारी शान, हमारी पहचान",
    points: [
      "Mechanized night sweeping of arterial roads",
      "Clean Ganga Ghats and dedicated disposal kiosks",
      "24x7 PMC Civic Helpline (155304 / 1916)"
    ],
    role: "Direct integration with PMC Quick Response Teams for ward-level issue redressal."
  }
];

export const GOV_POSTERS = [
  {
    id: "poster-sbm",
    title: "Swachh Bharat 2.0: Segregate Waste at Source",
    hindiTitle: "स्वच्छ भारत: कचरा मुक्त शहर हमारा संकल्प",
    slogan: "A Clean City is a Healthy City",
    hindiSlogan: "सूखा कचरा नीला डिब्बा • गीला कचरा हरा डिब्बा",
    authority: "Ministry of Housing & Urban Affairs, Govt. of India",
    category: "swachh_bharat",
    categoryLabel: "Swachh Bharat",
    badge: "National Drive",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    themeColor: "border-orange-200 bg-orange-50/40",
    topBannerBg: "bg-orange-600",
    guidelines: [
      "Separate kitchen & vegetable waste (Green Bin) from plastic & paper (Blue Bin)",
      "Do not dump garbage on roadsides or open empty plots",
      "Hand over segregated waste only to municipal sanitation vehicles",
      "Report overflowing community garbage bins on CivicEye"
    ],
    pledgeText: "I pledge to keep my city clean, segregate waste at source, and never litter in public places."
  },
  {
    id: "poster-jjh",
    title: "Jal-Jeevan-Hariyali: Conserve Water & Protect Drains",
    hindiTitle: "जल-जीवन-हरियाली: जल स्रोतों का संरक्षण",
    slogan: "Clean Drains, Green Bihar, Sustainable Future",
    hindiSlogan: "जल जीवन हरियाली • तभी होगी खुशहाली",
    authority: "Government of Bihar",
    category: "bihar_govt",
    categoryLabel: "Govt of Bihar",
    badge: "Bihar Flagship",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    themeColor: "border-emerald-200 bg-emerald-50/40",
    topBannerBg: "bg-emerald-700",
    guidelines: [
      "Keep drainage grates free of plastic bags and construction debris",
      "Protect local ponds, wells, and historical water channels from dumping",
      "Report clogged canal inlets and stagnant wastewater immediately",
      "Adopt rooftop rainwater harvesting in your home or society"
    ],
    pledgeText: "I pledge to conserve water, plant trees, and keep our public drains and ponds clean."
  },
  {
    id: "poster-sn2",
    title: "Saat Nischay-2: Swachh Shahar, Viksit Shahar",
    hindiTitle: "सात निश्चय-२: स्वच्छ और विकसित शहर",
    slogan: "Illuminated Streets, Modern Drainage, Smart Civic Services",
    hindiSlogan: "स्वच्छ वार्ड, सुरक्षित सड़कें, रोशन गलियां",
    authority: "Urban Development & Housing Department, Bihar",
    category: "bihar_govt",
    categoryLabel: "Govt of Bihar",
    badge: "Saat Nischay-2",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    themeColor: "border-blue-200 bg-blue-50/40",
    topBannerBg: "bg-blue-700",
    guidelines: [
      "Report unlit streetlights and dark road patches for prompt repair",
      "Report dangerous road potholes to prevent road accidents",
      "Support municipal sanitation staff in daily door-to-door collection",
      "Track your municipal grievance in real-time with CivicEye"
    ],
    pledgeText: "I pledge to support my municipal corporation in maintaining clean and well-lit neighborhood streets."
  },
  {
    id: "poster-patna",
    title: "Patna Nagar Nigam: Chaka Chak Patna",
    hindiTitle: "पटना नगर निगम: चकाचक पटना",
    slogan: "100% Clean Wards • Clean Ganga Ghats",
    hindiSlogan: "कचरा गाड़ी आने पर ही कचरा दें • खुले में फेंकना मना है",
    authority: "Patna Municipal Corporation (PMC)",
    category: "bihar_govt",
    categoryLabel: "Patna Municipal Corp",
    badge: "PMC Campaign",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    themeColor: "border-teal-200 bg-teal-50/40",
    topBannerBg: "bg-teal-700",
    guidelines: [
      "Give segregated waste directly to PMC sanitation vehicles",
      "Keep the Ganga riverfront and public parks litter-free",
      "Call PMC Civic Toll-Free 155304 / 1916 for urgent assistance",
      "Upload photo of open dumping on CivicEye for quick dispatch"
    ],
    pledgeText: "I pledge to make Patna #1 in cleanliness and keep our city clean and beautiful."
  }
];

export const SWACHHATA_PLEDGE = {
  title: "National Cleanliness Pledge (स्वच्छता प्रतिज्ञा)",
  hindiSubtitle: "राष्ट्रपिता महात्मा गांधी के स्वच्छ भारत के सपने को साकार करने का नागरिक संकल्प",
  englishOath: "I solemnly pledge to devote time to cleanliness. I will neither litter nor allow others to litter. I will initiate cleanliness with myself, my family, my locality, and my workplace.",
  hindiOath: "मैं शपथ लेता/लेती हूँ कि मैं स्वयं स्वच्छता के प्रति सजग रहूँगा/रहूँगी और उसके लिए समय दूंगा/दूँगी। मैं न गंदगी करूँगा/करूँगी, न किसी को करने दूंगा/दूँगी। सबसे पहले मैं स्वयं से, मेरे परिवार से और मेरे मोहल्ले से इसकी शुरुआत करूँगा/करूँगी।",
  rewardPoints: 50
};
