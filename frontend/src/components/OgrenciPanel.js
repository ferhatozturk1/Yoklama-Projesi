import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  Chip, 
  AppBar,
  Toolbar,
  Container,
  Paper
} from '@mui/material';
import { 
  School, 
  AccessTime, 
  CheckCircle, 
  Schedule,
  Person,
  ExitToApp,
  Class,
  Groups,
  TrendingDown,
  TrendingUp,
  Assignment
} from '@mui/icons-material';

const OgrenciPanel = () => {
  const [yoklamalar] = useState([
    {
      id: 1,
      ders: "Matematik",
      ogretmen: "Prof. Dr. Ahmet Yılmaz",
      tarih: "13.07.2025",
      saat: "10:00-11:00",
      durum: "aktif",
      katilimci: 25,
      toplamOgrenci: 30
    },
    {
      id: 2,
      ders: "Fizik",
      ogretmen: "Dr. Ayşe Kaya",
      tarih: "13.07.2025",
      saat: "14:00-15:00",
      durum: "beklemede",
      katilimci: 0,
      toplamOgrenci: 28
    },
    {
      id: 3,
      ders: "Kimya",
      ogretmen: "Prof. Dr. Mehmet Özkan",
      tarih: "12.07.2025",
      saat: "09:00-10:00",
      durum: "tamamlandi",
      katilimci: 22,
      toplamOgrenci: 25
    }
  ]);

  // Öğrencinin devamsızlık geçmişi
  const [devamsizlikVerileri] = useState([
    { ders: "Matematik", toplamDers: 25, katilanDers: 23, devamsizlik: 2 },
    { ders: "Fizik", toplamDers: 20, katilanDers: 18, devamsizlik: 2 },
    { ders: "Kimya", toplamDers: 22, katilanDers: 20, devamsizlik: 2 },
    { ders: "Tarih", toplamDers: 18, katilanDers: 16, devamsizlik: 2 },
    { ders: "Coğrafya", toplamDers: 15, katilanDers: 13, devamsizlik: 2 }
  ]);

  // Devamsızlık yüzdesi hesaplama
  const hesaplaDevamsizlikYuzdesi = (devamsizlik, toplamDers) => {
    return ((devamsizlik / toplamDers) * 100).toFixed(1);
  };

  // Genel devamsızlık oranı
  const genelDevamsizlik = () => {
    const toplamDers = devamsizlikVerileri.reduce((acc, curr) => acc + curr.toplamDers, 0);
    const toplamDevamsizlik = devamsizlikVerileri.reduce((acc, curr) => acc + curr.devamsizlik, 0);
    return ((toplamDevamsizlik / toplamDers) * 100).toFixed(1);
  };

  // Devamsızlık durumu rengi
  const getDevamsizlikRengi = (yuzde) => {
    if (yuzde <= 5) return '#4caf50'; // Yeşil
    if (yuzde <= 10) return '#ff9800'; // Turuncu
    return '#f44336'; // Kırmızı
  };

  const getDurumColor = (durum) => {
    switch(durum) {
      case 'aktif': return 'success';
      case 'beklemede': return 'warning';
      case 'tamamlandi': return 'default';
      default: return 'default';
    }
  };

  const getDurumText = (durum) => {
    switch(durum) {
      case 'aktif': return 'Aktif';
      case 'beklemede': return 'Beklemede';
      case 'tamamlandi': return 'Tamamlandı';
      default: return durum;
    }
  };

  const handleYoklamaKatil = (yoklamaId) => {
    alert(`${yoklamaId} numaralı yoklamaya katılım sağlandı!`);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#1a237e' }}>
        <Toolbar>
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Öğrenci Paneli
          </Typography>
          <Button color="inherit" startIcon={<Person />}>
            Ahmet Yılmaz
          </Button>
          <Button color="inherit" startIcon={<ExitToApp />}>
            Çıkış
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {/* Hoşgeldin Mesajı */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            borderRadius: 3,
            color: 'white'
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Hoşgeldin Ahmet! �‍🎓
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Bugün {new Date().toLocaleDateString('tr-TR')} - Yoklama durumunu takip et ve katılım sağla
          </Typography>
        </Paper>

        {/* İstatistikler */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={2} 
              sx={{ 
                bgcolor: '#e8f5e8', 
                borderLeft: '4px solid #4caf50',
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                <Typography variant="h6" color="#2e7d32" sx={{ fontWeight: 'bold' }}>
                  Tamamlanan
                </Typography>
                <Typography variant="h3" color="#2e7d32" sx={{ fontWeight: 'bold' }}>
                  1
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={2} 
              sx={{ 
                bgcolor: '#fff3e0', 
                borderLeft: '4px solid #ff9800',
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Schedule sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                <Typography variant="h6" color="#f57c00" sx={{ fontWeight: 'bold' }}>
                  Bekleyen
                </Typography>
                <Typography variant="h3" color="#f57c00" sx={{ fontWeight: 'bold' }}>
                  1
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={2} 
              sx={{ 
                bgcolor: '#e3f2fd', 
                borderLeft: '4px solid #2196f3',
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AccessTime sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
                <Typography variant="h6" color="#1976d2" sx={{ fontWeight: 'bold' }}>
                  Aktif
                </Typography>
                <Typography variant="h3" color="#1976d2" sx={{ fontWeight: 'bold' }}>
                  1
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={2} 
              sx={{ 
                bgcolor: genelDevamsizlik() > 10 ? '#ffebee' : genelDevamsizlik() > 5 ? '#fff8e1' : '#f1f8e9', 
                borderLeft: `4px solid ${getDevamsizlikRengi(genelDevamsizlik())}`,
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingDown sx={{ fontSize: 48, color: getDevamsizlikRengi(genelDevamsizlik()), mb: 2 }} />
                <Typography variant="h6" color={getDevamsizlikRengi(genelDevamsizlik())} sx={{ fontWeight: 'bold' }}>
                  Devamsızlık
                </Typography>
                <Typography variant="h3" color={getDevamsizlikRengi(genelDevamsizlik())} sx={{ fontWeight: 'bold' }}>
                  %{genelDevamsizlik()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Yoklama Listesi */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
            📋 Yoklama Listesi
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ders yoklamalarını burada takip edebilir ve katılım sağlayabilirsiniz
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {yoklamalar.map((yoklama) => (
            <Grid item xs={12} md={6} lg={4} key={yoklama.id}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {yoklama.durum === 'aktif' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 16,
                      height: 16,
                      bgcolor: '#4caf50',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)' },
                        '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
                        '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' }
                      }
                    }}
                  />
                )}
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                      {yoklama.ders}
                    </Typography>
                    <Chip 
                      label={getDurumText(yoklama.durum)} 
                      color={getDurumColor(yoklama.durum)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ fontSize: 18, color: '#666', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {yoklama.ogretmen}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ fontSize: 18, color: '#666', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {yoklama.tarih} | {yoklama.saat}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Groups sx={{ fontSize: 18, color: '#666', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {yoklama.katilimci}/{yoklama.toplamOgrenci} öğrenci katıldı
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  {yoklama.durum === 'aktif' ? (
                    <Button 
                      variant="contained" 
                      color="success" 
                      fullWidth
                      size="large"
                      startIcon={<CheckCircle />}
                      sx={{ 
                        fontWeight: 'bold',
                        py: 1.5,
                        '&:hover': {
                          bgcolor: '#388e3c'
                        }
                      }}
                      onClick={() => handleYoklamaKatil(yoklama.id)}
                    >
                      Yoklamaya Katıl
                    </Button>
                  ) : yoklama.durum === 'beklemede' ? (
                    <Button 
                      variant="outlined" 
                      color="warning" 
                      fullWidth
                      size="large"
                      disabled
                      startIcon={<Schedule />}
                      sx={{ py: 1.5 }}
                    >
                      Henüz Başlamadı
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      color="inherit" 
                      fullWidth
                      size="large"
                      disabled
                      startIcon={<CheckCircle />}
                      sx={{ py: 1.5 }}
                    >
                      Tamamlandı ✓
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Boş durumu */}
        {yoklamalar.length === 0 && (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              bgcolor: '#fafafa',
              borderRadius: 2
            }}
          >
            <Class sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Henüz yoklama bulunmuyor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Öğretmenleriniz yoklama başlattığında burada görünecek
            </Typography>
          </Paper>
        )}

        {/* Devamsızlık Detayları */}
        <Box sx={{ mb: 3, mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
            📊 Devamsızlık Detayları
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ders bazlı devamsızlık durumunuzu takip edin
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {devamsizlikVerileri.map((ders, index) => {
            const devamsizlikYuzdesi = hesaplaDevamsizlikYuzdesi(ders.devamsizlik, ders.toplamDers);
            return (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    },
                    borderLeft: `4px solid ${getDevamsizlikRengi(devamsizlikYuzdesi)}`
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                        {ders.ders}
                      </Typography>
                      <Chip 
                        label={`%${devamsizlikYuzdesi}`}
                        sx={{ 
                          fontWeight: 'bold',
                          bgcolor: getDevamsizlikRengi(devamsizlikYuzdesi),
                          color: 'white'
                        }}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          📚 Toplam Ders:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {ders.toplamDers}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          ✅ Katılan:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          {ders.katilanDers}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          ❌ Devamsızlık:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: getDevamsizlikRengi(devamsizlikYuzdesi) }}>
                          {ders.devamsizlik}
                        </Typography>
                      </Box>

                      {/* Devamsızlık çubuğu */}
                      <Box sx={{ width: '100%', bgcolor: '#f5f5f5', borderRadius: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            width: `${(ders.katilanDers / ders.toplamDers) * 100}%`,
                            height: 8,
                            bgcolor: '#4caf50',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Katılım oranı: %{((ders.katilanDers / ders.toplamDers) * 100).toFixed(1)}
                      </Typography>
                    </Box>

                    {devamsizlikYuzdesi > 20 && (
                      <Box 
                        sx={{ 
                          bgcolor: '#ffebee', 
                          p: 2, 
                          borderRadius: 1, 
                          border: '1px solid #ffcdd2',
                          mt: 2
                        }}
                      >
                        <Typography variant="body2" color="error" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          ⚠️ Dikkat! Devamsızlık sınırını aştınız
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default OgrenciPanel;
