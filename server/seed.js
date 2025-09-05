require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Content = require('./models/Content');
const Partner = require('./models/Partner');
const User = require('./models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Content.deleteMany({});
    await Partner.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@baybar.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create sample content
    const homeContent = new Content({
      pageName: 'home',
      sections: [
        {
          title: 'E-ticaret Sektöründe Güvenilir Partneriniz',
          text: 'Baybar olarak, e-ticaret sektöründe yurtdışına hizmet veren profesyonel ekibimizle müşterilerimize en kaliteli hizmeti sunuyoruz. Güvenilir ve şeffaf yaklaşımımızla dijital dönüşüm yolculuğunuzda yanınızdayız.',
          image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          order: 0,
          type: 'hero'
        },
        {
          title: 'Hizmetlerimiz',
          text: 'E-ticaret danışmanlığından dijital pazarlamaya, teknik destekten eğitim programlarına kadar geniş bir yelpazede hizmet sunuyoruz.',
          order: 1,
          type: 'service'
        },
        {
          title: 'Bizimle İletişime Geçin',
          text: 'Projeleriniz hakkında konuşmak için bizimle iletişime geçin. Uzman ekibimiz size en uygun çözümleri sunmak için burada.',
          order: 2,
          type: 'cta'
        }
      ],
      seo: {
        title: 'Baybar - E-ticaret Danışmanlığı',
        description: 'E-ticaret sektöründe yurtdışına hizmet veren profesyonel şirket. Güvenilir ve kaliteli hizmet anlayışımızla müşterilerimize en iyi deneyimi sunuyoruz.',
        keywords: ['baybar', 'e-ticaret', 'danışmanlık', 'dijital pazarlama']
      }
    });
    await homeContent.save();

    const aboutContent = new Content({
      pageName: 'about',
      sections: [
        {
          title: 'Hakkımızda',
          text: 'Baybar olarak, e-ticaret sektöründe yenilikçi çözümler sunarak, müşterilerimizin dijital dönüşüm süreçlerini başarıyla yönetmelerine yardımcı oluyoruz.',
          order: 0,
          type: 'text'
        },
        {
          title: 'Misyonumuz',
          text: 'E-ticaret sektöründe yenilikçi çözümler sunarak, müşterilerimizin dijital dönüşüm süreçlerini başarıyla yönetmelerine yardımcı olmak.',
          order: 1,
          type: 'text'
        },
        {
          title: 'Vizyonumuz',
          text: 'Türkiye\'nin en güvenilir e-ticaret danışmanlık şirketi olmak ve yurtdışı pazarında Türk markalarının başarısına katkıda bulunmak.',
          order: 2,
          type: 'text'
        }
      ],
      seo: {
        title: 'Hakkımızda - Baybar',
        description: 'Baybar hakkında bilgi edinin. E-ticaret sektöründe yurtdışına hizmet veren profesyonel ekibimiz ve değerlerimiz.',
        keywords: ['baybar', 'hakkımızda', 'misyon', 'vizyon']
      }
    });
    await aboutContent.save();

    const servicesContent = new Content({
      pageName: 'services',
      sections: [
        {
          title: 'Hizmetlerimiz',
          text: 'E-ticaret sektöründe ihtiyacınız olan tüm hizmetleri tek çatı altında sunuyoruz. Profesyonel ekibimizle birlikte dijital dönüşüm yolculuğunuzda yanınızdayız.',
          order: 0,
          type: 'text'
        }
      ],
      seo: {
        title: 'Hizmetlerimiz - Baybar',
        description: 'Baybar\'ın sunduğu e-ticaret danışmanlığı, dijital pazarlama, teknik destek ve eğitim hizmetleri hakkında detaylı bilgi.',
        keywords: ['baybar', 'hizmetler', 'e-ticaret', 'danışmanlık']
      }
    });
    await servicesContent.save();

    const contactContent = new Content({
      pageName: 'contact',
      sections: [
        {
          title: 'İletişim',
          text: 'Projeleriniz hakkında konuşmak için bizimle iletişime geçin. Uzman ekibimiz size en uygun çözümleri sunmak için burada.',
          order: 0,
          type: 'text'
        }
      ],
      seo: {
        title: 'İletişim - Baybar',
        description: 'Baybar ile iletişime geçin. E-ticaret danışmanlığı, dijital pazarlama ve teknik destek hizmetleri için bizimle iletişime geçin.',
        keywords: ['baybar', 'iletişim', 'destek', 'danışmanlık']
      }
    });
    await contactContent.save();

    console.log('Content created');

    // Create sample partners
    const partners = [
      {
        name: 'Microsoft',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        website: 'https://microsoft.com',
        description: 'Teknoloji devi Microsoft ile iş birliği',
        order: 0
      },
      {
        name: 'Google',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        website: 'https://google.com',
        description: 'Google ile dijital pazarlama iş birliği',
        order: 1
      },
      {
        name: 'Amazon',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        website: 'https://amazon.com',
        description: 'Amazon ile e-ticaret platformu iş birliği',
        order: 2
      },
      {
        name: 'Shopify',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg',
        website: 'https://shopify.com',
        description: 'Shopify ile e-ticaret çözümleri',
        order: 3
      }
    ];

    for (const partnerData of partners) {
      const partner = new Partner(partnerData);
      await partner.save();
    }

    console.log('Partners created');
    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
