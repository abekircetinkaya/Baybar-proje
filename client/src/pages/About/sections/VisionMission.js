import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaRocket } from 'react-icons/fa';
import './VisionMission.scss';

const VisionMission = () => {
  const cards = [
    {
      id: 1,
      icon: <FaBullseye className="vision-mission__icon" />,
      title: 'Vizyonumuz',
      description: 'Sektörde öncü ve yenilikçi çözümler sunan, müşteri memnuniyetini en üst seviyede tutan, sürdürülebilir büyüme hedefleyen bir şirket olmak.',
      color: '#3b82f6',
      delay: 0.1
    },
    {
      id: 2,
      icon: <FaRocket className="vision-mission__icon" />,
      title: 'Misyonumuz',
      description: 'Müşterilerimize en kaliteli hizmeti sunarak, yenilikçi ve sürdürülebilir çözümlerle iş süreçlerini iyileştirmek, çalışanlarımızın gelişimine katkı sağlamak ve topluma değer katan projeler üretmek.',
      color: '#10b981',
      delay: 0.2
    }
  ];

  return (
    <section className="vision-mission section-padding">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Vizyonumuz & Misyonumuz
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Geleceği şekillendiren değerlerimiz
          </motion.p>
        </div>

        <div className="vision-mission__grid">
          {cards.map((card, index) => (
            <motion.div 
              key={card.id}
              className="vision-mission__card"
              style={{ '--accent-color': card.color }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: card.delay }}
            >
              <div className="vision-mission__icon-wrapper">
                {card.icon}
              </div>
              <h3 className="vision-mission__title">{card.title}</h3>
              <p className="vision-mission__description">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
