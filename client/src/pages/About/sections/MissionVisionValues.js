import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiAward, FiUsers, FiLayers, FiTrendingUp } from 'react-icons/fi';
import './MissionVisionValues.scss';

const MissionVisionValues = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('.mission-vision-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const tabs = [
    { id: 'mission', label: 'Misyonumuz', icon: <FiTarget /> },
    { id: 'vision', label: 'Vizyonumuz', icon: <FiEye /> },
    { id: 'values', label: 'Değerlerimiz', icon: <FiAward /> },
  ];

  const values = [
    {
      id: 1,
      title: 'Müşteri Memnuniyeti',
      description: 'Müşterilerimizin ihtiyaç ve beklentilerini aşan çözümler sunarak uzun vadeli ilişkiler kurmayı hedefliyoruz.',
      icon: <FiUsers />,
    },
    {
      id: 2,
      title: 'Kalite',
      description: 'En yüksek kalite standartlarını benimseyerek, ürün ve hizmetlerimizde sürekli iyileştirme sağlıyoruz.',
      icon: <FiAward />,
    },
    {
      id: 3,
      title: 'İnovasyon',
      description: 'Yenilikçi çözümler geliştirerek sektörde öncü olmayı ve sürekli gelişmeyi hedefliyoruz.',
      icon: <FiLayers />,
    },
    {
      id: 4,
      title: 'Sürdürülebilirlik',
      description: 'Çevreye duyarlı ve sürdürülebilir iş modelleriyle gelecek nesillere daha yaşanabilir bir dünya bırakmayı amaçlıyoruz.',
      icon: <FiTrendingUp />,
    },
  ];

  const tabContent = {
    mission: {
      title: 'Misyonumuz',
      description: 'Müşterilerimize en kaliteli ürün ve hizmetleri sunarak, onların işlerini büyütmelerine ve hedeflerine ulaşmalarına yardımcı olmak. Yenilikçi çözümlerimiz ve uzman ekibimizle sektörde fark yaratarak, müşteri memnuniyetini her zaman ön planda tutuyoruz.',
      icon: <FiTarget />,
    },
    vision: {
      title: 'Vizyonumuz',
      description: 'Sektörde öncü ve güvenilir bir marka olarak, sürekli gelişen ve değişen dünyada müşterilerimizin yanında olmak. Gelecekte daha geniş kitlelere ulaşarak, küresel ölçekte başarılı işbirlikleri gerçekleştirmek ve sürdürülebilir büyümeyi hedefliyoruz.',
      icon: <FiEye />,
    },
    values: {
      title: 'Değerlerimiz',
      description: 'Çalışma prensiplerimizin temelini oluşturan değerlerimiz, iş yapış şeklimizin ve kurum kültürümüzün ayrılmaz bir parçasıdır.',
      icon: <FiAward />,
    },
  };

  const currentContent = tabContent[activeTab];

  return (
    <section className={`mission-vision-section ${isVisible ? 'visible' : ''}`}>
      <div className="section-inner">
        <div className="tabs-container">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
            <motion.div 
              className="tab-indicator"
              layoutId="tab-indicator"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          </div>
        </div>

        <div className="tab-content">
          <motion.div
            key={activeTab}
            className={`tab-pane ${activeTab === 'values' ? 'values-tab' : ''} ${isVisible ? 'active' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="icon">
              {currentContent.icon}
            </div>
            <h3>{currentContent.title}</h3>
            <p>{currentContent.description}</p>

            {activeTab === 'values' && (
              <div className="values-grid">
                {values.map((value) => (
                  <motion.div
                    key={value.id}
                    className="value-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.1 * value.id }}
                  >
                    <div className="icon">
                      {value.icon}
                    </div>
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Decorative shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
    </section>
  );
};

export default MissionVisionValues;
