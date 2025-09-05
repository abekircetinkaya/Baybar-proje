import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../../contexts/AppContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import Heading from '../../components/common/Heading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Login = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (state.user.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [state.user.isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    const result = await actions.adminLogin(data);
    if (result.success) {
      toast.success('Admin girişi başarılı!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || 'Admin girişi başarısız');
    }
  };

  if (state.user.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Giriş yapılıyor..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Girişi - Baybar</title>
        <meta name="description" content="Baybar admin paneline giriş yapın." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
          </div>
          <Heading level={2} className="mt-6 text-center text-3xl font-bold text-gray-900">
            Admin Paneli
          </Heading>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hesabınıza giriş yapın
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="E-posta Adresi"
                type="email"
                placeholder="admin@baybar.com"
                {...register('email', {
                  required: 'E-posta gereklidir',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Geçerli bir e-posta adresi giriniz'
                  }
                })}
                error={errors.email?.message}
                icon={<Mail className="w-5 h-5" />}
              />

              <div className="relative">
                <Input
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifrenizi girin"
                  {...register('password', {
                    required: 'Şifre gereklidir',
                    minLength: { value: 6, message: 'En az 6 karakter olmalıdır' }
                  })}
                  error={errors.password?.message}
                  icon={<Lock className="w-5 h-5" />}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Beni hatırla
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Şifremi unuttum
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={state.user.loading}
              >
                Giriş Yap
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Veya</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="/"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Ana sayfaya dön
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
