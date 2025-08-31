/**
 * Projeler Sayfası
 * Tüm projeleri listeleyen ve filtreleme imkanı sunan sayfa
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services';
import Loading from '../components/ui/Loading';
import './Projects.scss';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadProjects();
    loadCategories();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, selectedCategory, searchTerm, sortBy]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll();
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await projectService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      // Fallback kategoriler
      setCategories([
        'Web Development',
        'Web Design', 
        'Mobile Development',
        'UI/UX Design',
        'E-Commerce',
        'SEO'
      ]);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.technologies && project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Sıralama
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || b.completedDate || 0) - new Date(a.createdAt || a.completedDate || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || a.completedDate || 0) - new Date(b.createdAt || b.completedDate || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in_progress': return '#17a2b8';
      case 'planning': return '#ffc107';
      case 'on_hold': return '#fd7e14';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'planning': return 'Planlama';
      case 'on_hold': return 'Beklemede';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  if (loading) {
    return <Loading variant="logo" size="large" fullscreen text="Projeler yükleniyor..." />;
  }

  return (
    <div className="projects">
      <div className="container">
        {/* Header */}
        <div className="projects__header">
          <div className="projects__title">
            <h1>Projelerimiz</h1>
            <p>Müşterilerimiz için gerçekleştirdiğimiz başarılı projeler</p>
          </div>
          <div className="projects__stats">
            <div className="projects__stat">
              <span className="projects__stat-number">{projects.length}</span>
              <span className="projects__stat-label">Toplam Proje</span>
            </div>
            <div className="projects__stat">
              <span className="projects__stat-number">{projects.filter(p => p.status === 'completed').length}</span>
              <span className="projects__stat-label">Tamamlanan</span>
            </div>
            <div className="projects__stat">
              <span className="projects__stat-number">{projects.filter(p => p.featured).length}</span>
              <span className="projects__stat-label">Öne Çıkan</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="projects__filters">
          <div className="projects__search">
            <input
              type="text"
              placeholder="Proje ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="projects__search-input"
            />
          </div>
          
          <div className="projects__filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="projects__select"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="projects__select"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="title">Alfabetik</option>
              <option value="featured">Öne Çıkanlar</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects__grid">
          {filteredProjects.length === 0 ? (
            <div className="projects__empty">
              <h3>Proje bulunamadı</h3>
              <p>Arama kriterlerinize uygun proje bulunmuyor.</p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <div key={project.id || project._id} className="project-card">
                {project.featured && (
                  <div className="project-card__featured-badge">Öne Çıkan</div>
                )}
                
                <div className="project-card__image">
                  <img 
                    src={project.image || '/images/projects/default.jpg'} 
                    alt={project.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="project-card__image-placeholder" style={{ display: 'none' }}>
                    📁
                  </div>
                  <div className="project-card__overlay">
                    <div className="project-card__actions">
                      {project.projectUrl && (
                        <a 
                          href={project.projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="project-card__action"
                          title="Projeyi Görüntüle"
                        >
                          🔗
                        </a>
                      )}
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="project-card__action"
                          title="GitHub'da Görüntüle"
                        >
                          📂
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="project-card__content">
                  <div className="project-card__header">
                    <h3 className="project-card__title">{project.title}</h3>
                    <span 
                      className="project-card__status"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  
                  <p className="project-card__description">{project.description}</p>
                  
                  <div className="project-card__meta">
                    <span className="project-card__category">{project.category}</span>
                    {project.client && (
                      <span className="project-card__client">• {project.client}</span>
                    )}
                  </div>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="project-card__technologies">
                      {project.technologies.slice(0, 4).map(tech => (
                        <span key={tech} className="project-card__tech">{tech}</span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="project-card__tech project-card__tech--more">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="project-card__details">
                    {project.duration && (
                      <div className="project-card__detail">
                        <span className="project-card__detail-label">Süre:</span>
                        <span className="project-card__detail-value">{project.duration}</span>
                      </div>
                    )}
                    {project.teamSize && (
                      <div className="project-card__detail">
                        <span className="project-card__detail-label">Ekip:</span>
                        <span className="project-card__detail-value">{project.teamSize} kişi</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredProjects.length > 0 && filteredProjects.length < projects.length && (
          <div className="projects__load-more">
            <button 
              className="btn btn--outline"
              onClick={() => {
                // Implement pagination if needed
              }}
            >
              Daha Fazla Proje Yükle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;