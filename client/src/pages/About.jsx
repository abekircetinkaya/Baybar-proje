import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../contexts/AppContext';
import { Users, Target, Award, CheckCircle, Calendar, MapPin, Trophy, Rocket } from 'lucide-react';
import Heading from '../components/common/Heading';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PartnersSection from '../components/ui/PartnersSection';

const About = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    if (!state.content.about && !state.content.loading) {
      actions.loadContent('about');
    }
  }, [state.content.about, state.content.loading, actions]);

  if (state.content.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Sayfa yükleniyor..." />
      </div>
    );
  }

  if (state.content.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bir hata oluştu</h2>
          <p className="text-gray-600 mb-4">{state.content.error}</p>
          <button
            onClick={() => actions.loadContent('about')}
            className="btn btn-primary"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const aboutContent = state.content.about;

  return (
    <>
      <Helmet>
        <title>Hakkımızda - Baybar</title>
        <meta name="description" content="Baybar hakkında bilgi edinin. E-ticaret sektöründe yurtdışına hizmet veren profesyonel ekibimiz ve değerlerimiz." />
      </Helmet>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding hero-bg">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-fade-in-up">
                <Heading level={1} className="mb-6" gradient>
                  {aboutContent?.sections?.[0]?.title || 'Hakkımızda'}
                </Heading>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {aboutContent?.sections?.[0]?.text || 'E-ticaret sektöründe yurtdışına hizmet veren profesyonel şirket olarak, müşterilerimize en kaliteli hizmeti sunmayı hedefliyoruz.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-primary-600" />
                  </div>
                  <Heading level={2}>Misyonumuz</Heading>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  E-ticaret sektöründe yenilikçi çözümler sunarak, müşterilerimizin dijital dönüşüm süreçlerini 
                  başarıyla yönetmelerine yardımcı olmak. Güvenilir, şeffaf ve müşteri odaklı hizmet anlayışımızla 
                  sektörde öncü konumumuzu sürdürmek.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-secondary-600" />
                  </div>
                  <Heading level={2}>Vizyonumuz</Heading>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Türkiye'nin en güvenilir e-ticaret danışmanlık şirketi olmak ve yurtdışı pazarında 
                  Türk markalarının başarısına katkıda bulunmak. Teknoloji ve insan odaklı yaklaşımımızla 
                  sürdürülebilir büyüme sağlamak.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <Heading level={2} className="mb-6" gradient>
                Değerlerimiz
              </Heading>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Çalışma prensiplerimizi oluşturan temel değerler
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  title: 'Kalite',
                  description: 'Her projede en yüksek kalite standartlarını uygularız.'
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: 'Güvenilirlik',
                  description: 'Müşterilerimizle kurduğumuz güven ilişkisi bizim en değerli varlığımızdır.'
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: 'Müşteri Odaklılık',
                  description: 'Müşteri memnuniyeti her zaman önceliğimizdir.'
                }
              ].map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center group hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <Heading level={2} className="mb-6" gradient>
                Yolculuğumuz
              </Heading>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Geçmişten bugüne gelişimimizi, önemli olayları ve projelerimizi kronolojik sırayla keşfedin
              </p>
            </div>

            <div className="relative">
              {/* Timeline line with gradient */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-300 via-blue-500 to-blue-300 rounded-full shadow-lg"></div>

              <div className="space-y-16">
                {[
                  {
                    year: '2020',
                    title: 'Kuruluş',
                    description: 'Baybar olarak e-ticaret danışmanlığı alanında faaliyet göstermeye başladık.',
                    icon: <Rocket className="w-5 h-5" />,
                    side: 'left',
                    color: 'from-blue-500 to-blue-600'
                  },
                  {
                    year: '2021',
                    title: 'İlk Büyük Proje',
                    description: 'Türkiye\'nin önde gelen e-ticaret platformlarından biri ile ilk büyük projemizi gerçekleştirdik.',
                    icon: <Trophy className="w-5 h-5" />,
                    side: 'right',
                    color: 'from-green-500 to-green-600'
                  },
                  {
                    year: '2022',
                    title: 'Yurtdışı Genişleme',
                    description: 'Avrupa ve Orta Doğu pazarlarına açılarak uluslararası müşteri portföyümüzü genişlettik.',
                    icon: <MapPin className="w-5 h-5" />,
                    side: 'left',
                    color: 'from-purple-500 to-purple-600'
                  },
                  {
                    year: '2023',
                    title: 'Teknoloji Yatırımı',
                    description: 'Yapay zeka ve otomasyon teknolojilerine yatırım yaparak hizmet kalitemizi artırdık.',
                    icon: <Award className="w-5 h-5" />,
                    side: 'right',
                    color: 'from-orange-500 to-orange-600'
                  },
                  {
                    year: '2024',
                    title: 'Dijital Dönüşüm',
                    description: 'Müşterilerimizin dijital dönüşüm süreçlerinde öncü konumumuzu pekiştirdik.',
                    icon: <Target className="w-5 h-5" />,
                    side: 'left',
                    color: 'from-indigo-500 to-indigo-600'
                  }
                ].map((milestone, index) => (
                  <div key={index} className={`relative flex items-start ${milestone.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline dot with glow effect */}
                    <div className="relative z-20">
                      <div className={`w-12 h-12 bg-gradient-to-r ${milestone.color} rounded-full flex items-center justify-center text-white shadow-xl transform hover:scale-110 transition-all duration-300`}>
                        {milestone.icon}
                      </div>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 w-12 h-12 bg-gradient-to-r ${milestone.color} rounded-full opacity-30 blur-md animate-pulse`}></div>
                    </div>

                    {/* Content card with better spacing */}
                    <div className={`ml-8 md:ml-12 ${milestone.side === 'left' ? 'md:mr-12 md:text-right' : 'md:ml-12 md:text-left'} w-full md:w-5/12`}>
                      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-500 group">
                        <div className="flex items-center mb-4">
                          <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                          <span className="text-lg font-bold text-blue-600">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-base">
                          {milestone.description}
                        </p>
                        
                        {/* Decorative element */}
                        <div className={`mt-4 w-16 h-1 bg-gradient-to-r ${milestone.color} rounded-full ${milestone.side === 'left' ? 'md:ml-auto' : ''}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <PartnersSection />
      </main>
    </>
  );
};

export default About;
