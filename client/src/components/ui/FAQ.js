/**
 * Baybar Kurumsal Tanıtım Sitesi - SSS (FAQ) Bileşeni
 * Accordion şeklinde sıkça sorulan sorular
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState } from 'react';
import './FAQ.scss';

const FAQ = ({ faqs = [], title = "Sıkça Sorulan Sorular", className = "" }) => {
  const [openItems, setOpenItems] = useState(new Set());

  // Varsayılan FAQ verileri
  const defaultFaqs = [
    {
      id: 1,
      question: "Web tasarım hizmetiniz neleri kapsar?",
      answer: "Web tasarım hizmetimiz; responsive tasarım, kullanıcı deneyimi (UX) optimizasyonu, modern arayüz tasarımı, SEO uyumlu kodlama, içerik yönetim sistemi entegrasyonu ve mobil uyumluluk testlerini kapsar. Ayrıca sitenizin hızlı yüklenmesi ve güvenlik önlemleri de dahildir."
    },
    {
      id: 2,
      question: "Bir web sitesi projesi ne kadar sürer?",
      answer: "Proje süresi, sitenin karmaşıklığına göre değişir. Basit kurumsal siteler 2-3 hafta, e-ticaret siteleri 4-6 hafta, özel yazılım gerektiren projeler ise 6-12 hafta sürebilir. Proje başlangıcında size detaylı bir zaman çizelgesi sunuyoruz."
    },
    {
      id: 3,
      question: "Web sitemi kendim güncelleyebilir miyim?",
      answer: "Evet, tüm web sitelerimizi kullanıcı dostu içerik yönetim sistemi (CMS) ile geliştiriyoruz. Size özel eğitim vererek, metin, resim ve sayfa güncellemelerini kolayca yapabilmenizi sağlıyoruz. Ayrıca video eğitim materyalleri de sunuyoruz."
    },
    {
      id: 4,
      question: "SEO hizmetiniz neleri içerir?",
      answer: "SEO hizmetimiz; anahtar kelime araştırması, on-page optimizasyon, teknik SEO, içerik optimizasyonu, Google Analytics kurulumu, site hızı optimizasyonu ve aylık performans raporlarını içerir. Ayrıca yerel SEO ve Google My Business optimizasyonu da sunuyoruz."
    },
    {
      id: 5,
      question: "Kurumsal kimlik tasarımında neler yapıyorsunuz?",
      answer: "Kurumsal kimlik tasarımımız; logo tasarımı, renk paleti belirleme, tipografi seçimi, kartvizit tasarımı, antetli kağıt, zarf tasarımı, sosyal medya görselleri ve marka kullanım kılavuzu hazırlanmasını kapsar. Markanızın tutarlı bir görsel kimlik kazanmasını sağlıyoruz."
    },
    {
      id: 6,
      question: "Proje sonrası destek hizmeti veriyor musunuz?",
      answer: "Evet, tüm projelerimizde 3 ay ücretsiz teknik destek sunuyoruz. Bu süre içinde küçük güncellemeler, hata düzeltmeleri ve teknik sorunlar için destek alabilirsiniz. Sonrasında aylık veya yıllık bakım paketlerimizden faydalanabilirsiniz."
    },
    {
      id: 7,
      question: "E-ticaret sitesi için hangi ödeme yöntemlerini entegre ediyorsunuz?",
      answer: "E-ticaret sitelerinizde kredi kartı, banka kartı, havale/EFT, kapıda ödeme, PayPal, iyzico, PayTR gibi popüler ödeme yöntemlerini entegre ediyoruz. Ayrıca taksitli ödeme seçenekleri ve güvenli ödeme altyapısı da kuruyoruz."
    },
    {
      id: 8,
      question: "Mobil uygulama geliştiriyor musunuz?",
      answer: "Evet, iOS ve Android platformları için native ve hybrid mobil uygulamalar geliştiriyoruz. Ayrıca Progressive Web App (PWA) çözümleri ile web sitenizi mobil uygulama deneyimi sunacak şekilde optimize edebiliyoruz."
    }
  ];

  const faqData = faqs.length > 0 ? faqs : defaultFaqs;

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const isOpen = (id) => openItems.has(id);

  return (
    <section className={`faq ${className}`}>
      <div className="faq__container">
        <div className="faq__header">
          <h2 className="faq__title">{title}</h2>
          <p className="faq__subtitle">
            Merak ettiğiniz konular hakkında detaylı bilgiler
          </p>
        </div>

        <div className="faq__content">
          <div className="faq__list">
            {faqData.map((faq) => (
              <div 
                key={faq.id} 
                className={`faq__item ${isOpen(faq.id) ? 'faq__item--open' : ''}`}
              >
                <button
                  className="faq__question"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen(faq.id)}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="faq__question-text">{faq.question}</span>
                  <span className="faq__question-icon">
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`faq__icon ${isOpen(faq.id) ? 'faq__icon--open' : ''}`}
                    >
                      <path 
                        d="M6 9L12 15L18 9" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                
                <div 
                  id={`faq-answer-${faq.id}`}
                  className="faq__answer"
                  style={{
                    maxHeight: isOpen(faq.id) ? '1000px' : '0',
                    opacity: isOpen(faq.id) ? '1' : '0'
                  }}
                >
                  <div className="faq__answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;