import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { showSuccess, showError } from '../components/common/ToastNotification';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    title: user?.title || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    university: user?.university || '',
    bio: user?.bio || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(formData);
      setIsEditing(false);
      showSuccess('Profil başarıyla güncellendi!');
    } catch (error) {
      showError('Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      title: user?.title || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      university: user?.university || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1 className="page-title">Profil Ayarları</h1>
          <p className="page-subtitle">Kişisel bilgilerinizi yönetin ve güncelleyin</p>
        </div>

        <div className="profile-grid">
          {/* Profile Card */}
          <Card className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder-large">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">
                  {user?.title} {user?.firstName} {user?.lastName}
                </h2>
                <p className="profile-email">{user?.email}</p>
                <p className="profile-department">{user?.department}</p>
              </div>
              <Button variant="outline" size="sm">
                Fotoğraf Değiştir
              </Button>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="info-card">
            <Card.Header>
              <Card.Title>Kişisel Bilgiler</Card.Title>
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  }
                >
                  Düzenle
                </Button>
              )}
            </Card.Header>

            <Card.Body>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-row">
                    <Input
                      label="Unvan"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Dr., Prof. Dr., vb."
                    />
                    <Input
                      label="Ad"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <Input
                      label="Soyad"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="E-posta"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <Input
                      label="Telefon"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+90 (555) 123 45 67"
                    />
                    <Input
                      label="Bölüm"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Bilgisayar Mühendisliği"
                    />
                  </div>

                  <Input
                    label="Üniversite"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="İstanbul Teknik Üniversitesi"
                  />

                  <div className="form-group">
                    <label className="form-label">Biyografi</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                      rows={4}
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-actions">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      İptal
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      loading={loading}
                    >
                      Kaydet
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="profile-display">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Ad Soyad</label>
                      <span>{user?.title} {user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="info-item">
                      <label>E-posta</label>
                      <span>{user?.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Telefon</label>
                      <span>{user?.phone || 'Belirtilmemiş'}</span>
                    </div>
                    <div className="info-item">
                      <label>Bölüm</label>
                      <span>{user?.department || 'Belirtilmemiş'}</span>
                    </div>
                    <div className="info-item">
                      <label>Üniversite</label>
                      <span>{user?.university || 'Belirtilmemiş'}</span>
                    </div>
                    <div className="info-item full-width">
                      <label>Biyografi</label>
                      <span>{user?.bio || 'Henüz biyografi eklenmemiş.'}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Account Settings */}
          <Card className="settings-card">
            <Card.Header>
              <Card.Title>Hesap Ayarları</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Şifre Değiştir</h4>
                    <p>Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Değiştir
                  </Button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>İki Faktörlü Doğrulama</h4>
                    <p>Hesabınızı daha güvenli hale getirin</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Etkinleştir
                  </Button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Bildirim Ayarları</h4>
                    <p>E-posta ve sistem bildirimlerini yönetin</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ayarla
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Statistics */}
          <Card className="stats-card">
            <Card.Header>
              <Card.Title>İstatistikler</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Toplam Ders</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">245</div>
                  <div className="stat-label">Toplam Öğrenci</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">89%</div>
                  <div className="stat-label">Ortalama Devam</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">156</div>
                  <div className="stat-label">Yoklama Sayısı</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;