import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaLightbulb, 
  FaUsers, 
  FaHandshake, 
  FaChartLine, 
  FaShieldAlt,
  FaRocket
} from 'react-icons/fa';
import './Values.scss';

const Values = () => {
  const values = [
    {
      id: 1,
      icon: <FaLightbulb className="values__icon" />,
      title: 'Yenilikçilik',
      description: 'Sürekli gelişen teknolojiyi takip ederek yenilikçi çözümler sunuyoruz.'
    },
    {
      id: 2,
      icon: <FaUsers className="values__icon" />,
      title: 'Müşteri Memnuniyeti',
      description: 'Müşterilerimizin ihtiyaçlarını anlayarak onlara en iyi hizmeti sunuyoruz.'
    },
    {
      id: 3,
      icon: <FaHandshake className="values__icon" />,
      title: 'Güvenilirlik',
      description: 'Sözlerimizin arkasında durarak güvenilir bir iş ortağı olmayı hedefliyoruz.'
    },
    {
      id: 4,
      icon: <FaChartLine className="values__icon" />,
      title: 'Sürdürülebilirlik',
      description: 'Çevreye ve topluma karşı sorumluluklarımızın bilinciyle hareket ediyoruz.'
    },
    {
      id: 5,
      icon: <FaShieldAlt className="values__icon" />,
      title: 'Kalite',
      description: 'En yüksek kalite standartlarında hizmet sunmayı taahhüt ediyoruz.'
    },
    {
      id: 6,
      icon: <FaRocket className="values__icon" />,
      title: 'Gelişim',
      description: 'Sürekli öğrenme ve kendimizi geliştirme anlayışıyla ilerliyoruz.'
    }
  ];

  return (
    <section className="values section-padding">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Değerlerimiz
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            İş yapış şeklimizi şekillendiren temel değerlerimiz
          </motion.p>
        </div>

        <div className="values-grid">
          {values.map((value, index) => (
            <motion.div 
              key={value.id}
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="value-card__icon">
                {value.icon}
              </div>
              <h3 className="value-card__title">{value.title}</h3>
              <p className="value-card__description">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
