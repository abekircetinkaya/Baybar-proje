/**
 * Memory Database Seed Script
 * MongoDB Memory Server'a demo veri ekler
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Project = require('../models/Project');

// Demo proje verileri
const demoProjects = [
  {
    title: "E-Ticaret Platformu - TechStore",
    description: "Modern ve kullanıcı dostu e-ticaret platformu. React.js ve Node.js teknolojileri kullanılarak geliştirilmiş, mobil uyumlu tasarım ve güvenli ödeme sistemi içeren kapsamlı bir çözüm.",
    shortDescription: "Modern e-ticaret platformu - React.js ve Node.js ile geliştirilmiş",
    image: "/uploads/projects/techstore-main.jpg",
    gallery: [
      "/uploads/projects/techstore-1.jpg",
      "/uploads/projects/techstore-2.jpg",
      "/uploads/projects/techstore-3.jpg"
    ],
    technologies: [
      { name: "React.js", icon: "⚛️", color: "#61DAFB" },
      { name: "Node.js", icon: "🟢", color: "#339933" },
      { name: "MongoDB", icon: "🍃", color: "#47A248" },
      { name: "Express.js", icon: "🚀", color: "#000000" }
    ],
    category: "web",
    status: "completed",
    client: {
      name: "TechStore Ltd.",
      logo: "/uploads/clients/techstore-logo.png",
      website: "https://techstore.com"
    },
    projectUrl: "https://techstore-demo.baybar.com",
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-30'),
    budget: 25000,
    teamSize: 4,
    isFeatured: true,
    isActive: true,
    order: 1,
    tags: ["e-ticaret", "react", "nodejs", "mongodb"],
    features: [
      "Responsive tasarım",
      "Güvenli ödeme sistemi",
      "Stok yönetimi",
      "Admin paneli",
      "SEO optimizasyonu"
    ],
    viewCount: 245
  },
  {
    title: "Mobil Uygulama - FitTracker",
    description: "Fitness takibi için geliştirilmiş mobil uygulama. React Native teknolojisi kullanılarak iOS ve Android platformları için geliştirilmiş, kullanıcı dostu arayüz ve detaylı analiz özellikleri içeren kapsamlı bir fitness çözümü.",
    shortDescription: "Fitness takip uygulaması - React Native ile geliştirilmiş",
    image: "/uploads/projects/fittracker-main.jpg",
    gallery: [
      "/uploads/projects/fittracker-1.jpg",
      "/uploads/projects/fittracker-2.jpg",
      "/uploads/projects/fittracker-3.jpg"
    ],
    technologies: [
      { name: "React Native", icon: "📱", color: "#61DAFB" },
      { name: "Firebase", icon: "🔥", color: "#FFCA28" },
      { name: "Redux", icon: "🔄", color: "#764ABC" },
      { name: "TypeScript", icon: "📘", color: "#3178C6" }
    ],
    category: "mobile",
    status: "completed",
    client: {
      name: "HealthTech Solutions",
      logo: "/uploads/clients/healthtech-logo.png",
      website: "https://healthtech.com"
    },
    projectUrl: "https://fittracker-app.com",
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-06-15'),
    budget: 35000,
    teamSize: 5,
    isFeatured: true,
    isActive: true,
    order: 2,
    tags: ["mobil", "fitness", "react-native", "firebase"],
    features: [
      "Antrenman takibi",
      "Beslenme planı",
      "İlerleme analizi",
      "Sosyal özellikler",
      "Wearable entegrasyonu"
    ],
    viewCount: 189
  },
  {
    title: "Kurumsal Web Sitesi - InnovateCorp",
    description: "Kurumsal kimlik ve modern tasarım anlayışını yansıtan web sitesi. Next.js ve TypeScript teknolojileri kullanılarak geliştirilmiş, SEO optimizasyonu ve yüksek performans odaklı çözüm.",
    shortDescription: "Kurumsal web sitesi - Next.js ve TypeScript ile geliştirilmiş",
    image: "/uploads/projects/innovate-main.jpg",
    gallery: [
      "/uploads/projects/innovate-1.jpg",
      "/uploads/projects/innovate-2.jpg",
      "/uploads/projects/innovate-3.jpg"
    ],
    technologies: [
      { name: "Next.js", icon: "▲", color: "#000000" },
      { name: "TypeScript", icon: "📘", color: "#3178C6" },
      { name: "Tailwind CSS", icon: "🎨", color: "#06B6D4" },
      { name: "Vercel", icon: "🔺", color: "#000000" }
    ],
    category: "web",
    status: "completed",
    client: {
      name: "InnovateCorp",
      logo: "/uploads/clients/innovate-logo.png",
      website: "https://innovatecorp.com"
    },
    projectUrl: "https://innovatecorp-new.com",
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-20'),
    budget: 18000,
    teamSize: 3,
    isFeatured: true,
    isActive: true,
    order: 3,
    tags: ["kurumsal", "nextjs", "typescript", "seo"],
    features: [
      "Modern tasarım",
      "SEO optimizasyonu",
      "Yüksek performans",
      "Mobil uyumlu",
      "CMS entegrasyonu"
    ],
    viewCount: 156
  },
  {
    title: "AI Chatbot Sistemi - SmartAssist",
    description: "Yapay zeka destekli müşteri hizmetleri chatbot sistemi. Python ve TensorFlow teknolojileri kullanılarak geliştirilmiş, doğal dil işleme ve makine öğrenmesi özellikleri içeren gelişmiş bir AI çözümü.",
    shortDescription: "AI chatbot sistemi - Python ve TensorFlow ile geliştirilmiş",
    image: "/uploads/projects/smartassist-main.jpg",
    gallery: [
      "/uploads/projects/smartassist-1.jpg",
      "/uploads/projects/smartassist-2.jpg",
      "/uploads/projects/smartassist-3.jpg"
    ],
    technologies: [
      { name: "Python", icon: "🐍", color: "#3776AB" },
      { name: "TensorFlow", icon: "🧠", color: "#FF6F00" },
      { name: "FastAPI", icon: "⚡", color: "#009688" },
      { name: "Docker", icon: "🐳", color: "#2496ED" }
    ],
    category: "ai",
    status: "completed",
    client: {
      name: "CustomerCare Inc.",
      logo: "/uploads/clients/customercare-logo.png",
      website: "https://customercare.com"
    },
    projectUrl: "https://smartassist-demo.com",
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-07-30'),
    budget: 45000,
    teamSize: 6,
    isFeatured: true,
    isActive: true,
    order: 4,
    tags: ["ai", "chatbot", "python", "tensorflow"],
    features: [
      "Doğal dil işleme",
      "Makine öğrenmesi",
      "Çoklu dil desteği",
      "API entegrasyonu",
      "Analitik dashboard"
    ],
    viewCount: 298
  },
  {
    title: "Blockchain Wallet - CryptoSafe",
    description: "Güvenli kripto para cüzdanı uygulaması. Solidity ve Web3.js teknolojileri kullanılarak geliştirilmiş, çoklu blockchain desteği ve gelişmiş güvenlik özellikleri içeren kapsamlı bir blockchain çözümü.",
    shortDescription: "Blockchain cüzdan uygulaması - Solidity ve Web3.js ile geliştirilmiş",
    image: "/uploads/projects/cryptosafe-main.jpg",
    gallery: [
      "/uploads/projects/cryptosafe-1.jpg",
      "/uploads/projects/cryptosafe-2.jpg",
      "/uploads/projects/cryptosafe-3.jpg"
    ],
    technologies: [
      { name: "Solidity", icon: "⬢", color: "#363636" },
      { name: "Web3.js", icon: "🌐", color: "#F16822" },
      { name: "Ethereum", icon: "♦️", color: "#627EEA" },
      { name: "React", icon: "⚛️", color: "#61DAFB" }
    ],
    category: "blockchain",
    status: "development",
    client: {
      name: "CryptoTech Ltd.",
      logo: "/uploads/clients/cryptotech-logo.png",
      website: "https://cryptotech.com"
    },
    projectUrl: "https://cryptosafe-beta.com",
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-10-30'),
    budget: 60000,
    teamSize: 7,
    isFeatured: true,
    isActive: true,
    order: 5,
    tags: ["blockchain", "crypto", "solidity", "web3"],
    features: [
      "Çoklu blockchain desteği",
      "Güvenli anahtar yönetimi",
      "DeFi entegrasyonu",
      "NFT desteği",
      "Staking özellikleri"
    ],
    viewCount: 167
  },
  {
    title: "IoT Dashboard - SmartHome",
    description: "Akıllı ev sistemleri için IoT kontrol paneli. Vue.js ve MQTT teknolojileri kullanılarak geliştirilmiş, gerçek zamanlı veri izleme ve cihaz kontrolü özellikleri içeren modern bir IoT çözümü.",
    shortDescription: "IoT kontrol paneli - Vue.js ve MQTT ile geliştirilmiş",
    image: "/uploads/projects/smarthome-main.jpg",
    gallery: [
      "/uploads/projects/smarthome-1.jpg",
      "/uploads/projects/smarthome-2.jpg",
      "/uploads/projects/smarthome-3.jpg"
    ],
    technologies: [
      { name: "Vue.js", icon: "💚", color: "#4FC08D" },
      { name: "MQTT", icon: "📡", color: "#660066" },
      { name: "InfluxDB", icon: "📊", color: "#22ADF6" },
      { name: "Grafana", icon: "📈", color: "#F46800" }
    ],
    category: "iot",
    status: "completed",
    client: {
      name: "SmartTech Solutions",
      logo: "/uploads/clients/smarttech-logo.png",
      website: "https://smarttech.com"
    },
    projectUrl: "https://smarthome-dashboard.com",
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-06-30'),
    budget: 28000,
    teamSize: 4,
    isFeatured: true,
    isActive: true,
    order: 6,
    tags: ["iot", "smarthome", "vuejs", "mqtt"],
    features: [
      "Gerçek zamanlı izleme",
      "Cihaz kontrolü",
      "Enerji analizi",
      "Otomasyon kuralları",
      "Mobil uygulama"
    ],
    viewCount: 134
  }
];

// Memory DB'ye veri ekle
async function seedMemoryDB() {
  try {
    console.log('🧠 MongoDB Memory Server başlatılıyor...');
    
    // Memory Server oluştur
    const mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    
    // Bağlan
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Memory Server bağlantısı başarılı');
    
    // Mevcut projeleri temizle
    await Project.deleteMany({});
    console.log('🗑️ Mevcut projeler temizlendi');
    
    // Demo projeleri ekle
    const createdProjects = await Project.insertMany(demoProjects);
    
    console.log(`\n✅ ${createdProjects.length} demo proje Memory DB'ye eklendi!`);
    console.log('\n📋 Oluşturulan projeler:');
    createdProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.category})`);
    });
    
    console.log('\n🌟 Öne çıkan projeler:', createdProjects.filter(p => p.isFeatured).length);
    console.log('\n🔗 API Test URL: http://localhost:5000/api/projects/featured?limit=6');
    console.log('\n💡 Memory Server URI:', mongoUri);
    
    // Bağlantıyı açık bırak (sunucu çalışırken)
    console.log('\n⚠️ Memory Server çalışmaya devam ediyor...');
    
  } catch (error) {
    console.error('❌ Hata oluştu:', error.message);
    process.exit(1);
  }
}

// Script'i çalıştır
if (require.main === module) {
  seedMemoryDB();
}

module.exports = seedMemoryDB;