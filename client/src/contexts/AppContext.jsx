  import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../utils/api';

const AppContext = createContext();

const initialState = {
  // Content data
  content: {
    home: null,
    about: null,
    services: null,
    contact: null,
    loading: false,
    error: null
  },
  // Partners data
  partners: {
    data: [],
    loading: false,
    error: null
  },
  // User authentication
  user: {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  },
  // UI state
  ui: {
    mobileMenuOpen: false,
    loading: false
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    // Content actions
    case 'CONTENT_LOADING':
      return {
        ...state,
        content: { ...state.content, loading: true, error: null }
      };
    case 'CONTENT_SUCCESS':
      return {
        ...state,
        content: {
          ...state.content,
          loading: false,
          [action.page]: action.data,
          error: null
        }
      };
    case 'CONTENT_ERROR':
      return {
        ...state,
        content: { ...state.content, loading: false, error: action.error }
      };
    
    // Partners actions
    case 'PARTNERS_LOADING':
      return {
        ...state,
        partners: { ...state.partners, loading: true, error: null }
      };
    case 'PARTNERS_SUCCESS':
      return {
        ...state,
        partners: { ...state.partners, loading: false, data: action.data, error: null }
      };
    case 'PARTNERS_ERROR':
      return {
        ...state,
        partners: { ...state.partners, loading: false, error: action.error }
      };
    
    // Auth actions
    case 'AUTH_LOADING':
      return {
        ...state,
        user: { ...state.user, loading: true, error: null }
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: true,
          user: action.user,
          token: action.token,
          loading: false,
          error: null
        }
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        }
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: { ...state.user, loading: false, error: action.error }
      };
    
    // UI actions
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        ui: { ...state.ui, mobileMenuOpen: !state.ui.mobileMenuOpen }
      };
    case 'CLOSE_MOBILE_MENU':
      return {
        ...state,
        ui: { ...state.ui, mobileMenuOpen: false }
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // For now, just set as authenticated
      dispatch({
        type: 'AUTH_SUCCESS',
        user: { username: 'admin' },
        token
      });
    }
  }, []);

  // Actions
  const actions = {
    // Content actions
    loadContent: async (pageName) => {
      dispatch({ type: 'CONTENT_LOADING' });
      // Mock data for now
      setTimeout(() => {
        dispatch({
          type: 'CONTENT_SUCCESS',
          page: pageName,
          data: { title: 'Test Content', description: 'Test Description' }
        });
      }, 1000);
    },

    updateContent: async (pageName, contentData) => {
      return { success: true, data: contentData };
    },

    // Partners actions
    loadPartners: async () => {
      dispatch({ type: 'PARTNERS_LOADING' });
      // Mock data for now
      setTimeout(() => {
        dispatch({
          type: 'PARTNERS_SUCCESS',
          data: []
        });
      }, 1000);
    },

    createPartner: async (partnerData) => {
      return { success: true, data: partnerData };
    },

    updatePartner: async (id, partnerData) => {
      return { success: true, data: partnerData };
    },

    deletePartner: async (id) => {
      return { success: true };
    },

    submitContact: async (contactData) => {
      return { success: true, data: contactData };
    },

    submitQuote: async (quoteData) => {
      try {
        const response = await api.post('/quotes', quoteData);
        return { success: true, data: response.data.data, message: response.data.message };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Teklif gönderilemedi' };
      }
    },

    getMyQuotes: async () => {
      try {
        const response = await api.get('/quotes/my-quotes');
        return { success: true, data: response.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Teklifler yüklenemedi' };
      }
    },

    // API reference for direct calls
    api,

    // Auth actions - Real API implementation
    login: async (credentials) => {
      dispatch({ type: 'AUTH_LOADING' });
      
      try {
        const response = await api.post('/auth/login', credentials);
        
        if (response.data.success) {
          const { user, token } = response.data.data;
          localStorage.setItem('token', token);
          dispatch({
            type: 'AUTH_SUCCESS',
            user: user,
            token: token
          });
          return { success: true };
        } else {
          dispatch({ type: 'AUTH_ERROR', error: response.data.message || 'Giriş başarısız' });
          return { success: false, error: response.data.message || 'Giriş başarısız' };
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Giriş başarısız';
        dispatch({ type: 'AUTH_ERROR', error: errorMessage });
        return { success: false, error: errorMessage };
      }
    },

    // Admin login - separate from customer login
    adminLogin: async (credentials) => {
      dispatch({ type: 'AUTH_LOADING' });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Admin login validation
      if (credentials.email === 'admin@baybar.com' && credentials.password === 'admin123') {
        const mockUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@baybar.com',
          role: 'admin',
          username: 'admin'
        };
        const mockToken = 'mock-admin-token-' + Date.now();
        
        localStorage.setItem('adminToken', mockToken);
        dispatch({
          type: 'AUTH_SUCCESS',
          user: mockUser,
          token: mockToken
        });
        return { success: true };
      } else {
        dispatch({ type: 'AUTH_ERROR', error: 'Geçersiz admin bilgileri' });
        return { success: false, error: 'Geçersiz admin bilgileri' };
      }
    },

    register: async (userData) => {
      dispatch({ type: 'AUTH_LOADING' });
      
      try {
        const response = await api.post('/auth/register-customer', userData);
        
        if (response.data.success) {
          const { user, token } = response.data.data;
          localStorage.setItem('token', token);
          dispatch({
            type: 'AUTH_SUCCESS',
            user: user,
            token: token
          });
          return { success: true, message: 'Kayıt başarılı!' };
        } else {
          dispatch({ type: 'AUTH_ERROR', error: response.data.message || 'Kayıt başarısız' });
          return { success: false, error: response.data.message || 'Kayıt başarısız' };
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Kayıt başarısız';
        dispatch({ type: 'AUTH_ERROR', error: errorMessage });
        return { success: false, error: errorMessage };
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      dispatch({ type: 'AUTH_LOGOUT' });
    },

    // Admin logout - separate from customer logout
    adminLogout: () => {
      localStorage.removeItem('adminToken');
      dispatch({ type: 'AUTH_LOGOUT' });
    },

    // UI actions
    toggleMobileMenu: () => {
      dispatch({ type: 'TOGGLE_MOBILE_MENU' });
    },

    closeMobileMenu: () => {
      dispatch({ type: 'CLOSE_MOBILE_MENU' });
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
