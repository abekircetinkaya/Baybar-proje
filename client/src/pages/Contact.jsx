import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../contexts/AppContext';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Heading from '../components/common/Heading';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Contact = () => {
  const { state, actions } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    if (!state.content.contact && !state.content.loading) {
      actions.loadContent('contact');
    }
  }, [state.content.contact, state.content.loading, actions]);

  // Google Maps initialization
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && !mapInstanceRef.current && window.google && window.google.maps) {
        try {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 41.0082, lng: 28.9784 }, // İstanbul coordinates
            zoom: 15,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry.fill',
                stylers: [{ weight: '2.00' }]
              },
              {
                featureType: 'all',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#9c9c9c' }]
              },
              {
                featureType: 'all',
                elementType: 'labels.text',
                stylers: [{ visibility: 'on' }]
              },
              {
                featureType: 'landscape',
                elementType: 'all',
                stylers: [{ color: '#f2f2f2' }]
              },
              {
                featureType: 'landscape',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }]
              },
              {
                featureType: 'landscape.man_made',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }]
              },
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'road',
                elementType: 'all',
                stylers: [{ saturation: -100 }, { lightness: 45 }]
              },
              {
                featureType: 'road',
                elementType: 'geometry.fill',
                stylers: [{ color: '#eeeeee' }]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#7b7b7b' }]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'all',
                stylers: [{ visibility: 'simplified' }]
              },
              {
                featureType: 'road.arterial',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'transit',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'water',
                elementType: 'all',
                stylers: [{ color: '#46bcec' }, { visibility: 'on' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{ color: '#c8d7d4' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#070707' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
              }
            ]
          });

          // Add marker
          new window.google.maps.Marker({
            position: { lat: 41.0082, lng: 28.9784 },
            map: map,
            title: 'Baybar Ofisi',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#1A237E" stroke="#ffffff" stroke-width="2"/>
                  <path d="M16 8l-4 8h8l-4-8z" fill="#ffffff"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });

          mapInstanceRef.current = map;
        } catch (error) {
          console.error('Google Maps initialization error:', error);
        }
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          initMap();
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
    }

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await actions.submitContact(data);
      if (result.success) {
        setIsSubmitted(true);
        reset();
        toast.success('Mesajınız başarıyla gönderildi!');
      } else {
        toast.error(result.error || 'Mesaj gönderilemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            onClick={() => actions.loadContent('contact')}
            className="btn btn-primary"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <Heading level={2} className="mb-4 text-gray-900">
            Mesajınız Gönderildi!
          </Heading>
          <p className="text-gray-600 mb-8">
            Mesajınız başarıyla alındı. En kısa sürede size dönüş yapacağız.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="primary"
          >
            Yeni Mesaj Gönder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>İletişim - Baybar</title>
        <meta name="description" content="Baybar ile iletişime geçin. E-ticaret danışmanlığı, dijital pazarlama ve teknik destek hizmetleri için bizimle iletişime geçin." />
      </Helmet>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding hero-bg">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-fade-in-up">
                <Heading level={1} className="mb-6" gradient>
                  İletişim
                </Heading>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Projeleriniz hakkında konuşmak için bizimle iletişime geçin. 
                  Uzman ekibimiz size en uygun çözümleri sunmak için burada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Heading level={2} className="mb-8">
                  Mesaj Gönderin
                </Heading>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Ad Soyad"
                      placeholder="Adınız ve soyadınız"
                      {...register('name', { 
                        required: 'Ad soyad gereklidir',
                        minLength: { value: 2, message: 'En az 2 karakter olmalıdır' }
                      })}
                      error={errors.name?.message}
                    />
                    
                    <Input
                      label="E-posta"
                      type="email"
                      placeholder="ornek@email.com"
                      {...register('email', { 
                        required: 'E-posta gereklidir',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Geçerli bir e-posta adresi giriniz'
                        }
                      })}
                      error={errors.email?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Telefon"
                      type="tel"
                      placeholder="+90 555 123 45 67"
                      {...register('phone')}
                    />
                    
                    <Input
                      label="Şirket"
                      placeholder="Şirket adınız"
                      {...register('company')}
                    />
                  </div>

                  <Input
                    label="Konu"
                    placeholder="Mesajınızın konusu"
                    {...register('subject', { 
                      required: 'Konu gereklidir',
                      minLength: { value: 5, message: 'En az 5 karakter olmalıdır' }
                    })}
                    error={errors.subject?.message}
                  />

                  <Textarea
                    label="Mesaj"
                    placeholder="Mesajınızı buraya yazın..."
                    rows={6}
                    {...register('message', { 
                      required: 'Mesaj gereklidir',
                      minLength: { value: 10, message: 'En az 10 karakter olmalıdır' }
                    })}
                    error={errors.message?.message}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isSubmitting}
                    className="w-full"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Mesaj Gönder
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <Heading level={2} className="mb-8">
                  İletişim Bilgileri
                </Heading>

                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefon</h3>
                      <p className="text-gray-600 mb-1">+90 555 123 45 67</p>
                      <p className="text-sm text-gray-500">Pazartesi - Cuma: 09:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">E-posta</h3>
                      <p className="text-gray-600 mb-1">info@baybar.com</p>
                      <p className="text-sm text-gray-500">24 saat içinde yanıt veriyoruz</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Adres</h3>
                      <p className="text-gray-600 mb-1">
                        Merkez Mahallesi<br />
                        İş Merkezi No: 123<br />
                        İstanbul, Türkiye
                      </p>
                    </div>
                  </div>
                </div>

                {/* Google Maps */}
                <div className="mt-8">
                  <div 
                    ref={mapRef}
                    className="w-full h-64 rounded-lg shadow-lg border border-gray-200"
                    style={{ minHeight: '256px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
