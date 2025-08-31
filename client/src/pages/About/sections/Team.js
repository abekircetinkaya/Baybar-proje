import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaTwitter, FaGithub } from 'react-icons/fa';
import './Team.scss';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      position: 'Kurucu & CEO',
      image: '/images/team/ahmet-yilmaz.jpg',
      bio: '15+ yıllık sektör deneyimi ile şirketimizin vizyoner lideridir. İnovatif çözümler ve sürdürülebilir büyüme stratejileri konusunda uzmandır.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['Strateji', 'Yönetim', 'İnovasyon']
    },
    {
      id: 2,
      name: 'Ayşe Kaya',
      position: 'Teknoloji Direktörü',
      image: '/images/team/ayse-kaya.jpg',
      bio: 'Yazılım mühendisliği ve teknoloji yönetimi konusunda uzmanlaşmış, yenilikçi çözümler üretmeye odaklanmıştır.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['Yazılım', 'Mimari', 'AI']
    },
    {
      id: 3,
      name: 'Mehmet Demir',
      position: 'Ürün Müdürü',
      image: '/images/team/mehmet-demir.jpg',
      bio: 'Kullanıcı deneyimi ve ürün yönetimi konusunda uzman, müşteri odaklı çözümler geliştirir.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['Ürün', 'UX', 'Pazarlama']
    },
    {
      id: 4,
      name: 'Zeynep Şahin',
      position: 'Tasarım Yöneticisi',
      image: '/images/team/zeynep-sahin.jpg',
      bio: 'Yaratıcı ve kullanıcı odaklı tasarımlar ile marka kimliğimizi güçlendiriyor.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['UI/UX', 'Marka', 'Grafik']
    },
    {
      id: 5,
      name: 'Emre Yıldırım',
      position: 'Geliştirme Takım Lideri',
      image: '/images/team/emre-yildirim.jpg',
      bio: 'Yazılım geliştirme süreçlerini yönetiyor ve ekibin teknik yetkinliklerini geliştiriyor.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['Backend', 'Mimari', 'Güvenlik']
    }
  ];

  return (
    <section className="team section-padding bg-light">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ekibimiz
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Uzman kadromuzla yanınızdayız
          </motion.p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={member.id}
              className="team-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="team-card__image">
                <div className="team-card__image-inner">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.textContent = member.name.split(' ').map(n => n[0]).join('');
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="team-card__initials"></div>
                </div>
                <div className="team-card__social">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`}>
                      <FaLinkedinIn />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} Twitter`}>
                      <FaTwitter />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub`}>
                      <FaGithub />
                    </a>
                  )}
                </div>
              </div>
              <div className="team-card__content">
                <h3 className="team-card__name">{member.name}</h3>
                <p className="team-card__position">{member.position}</p>
                <p className="team-card__bio">{member.bio}</p>
                <div className="team-card__expertise">
                  {member.expertise.map((skill, i) => (
                    <span key={i} className="expertise-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
