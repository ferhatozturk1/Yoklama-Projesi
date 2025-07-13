import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  School, 
  Login, 
  PersonAdd, 
  CheckCircle,
  Timer,
  Groups
} from '@mui/icons-material';

const Hosgeldiniz = () => (
  <Box sx={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #0d1b2a 0%, #1a237e 30%, #0d47a1 70%, #01579b 100%)',
    display: 'flex',
    alignItems: 'center'
  }}>
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center">
        {/* Sol Taraf - Ana İçerik */}
        <Grid item xs={12} md={6}>
          <Box sx={{ color: 'white', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ fontSize: 48, mr: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                EduCheck
              </Typography>
            </Box>
            
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              Yoklama Sistemine Hoşgeldiniz! 🎓
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Modern ve kullanıcı dostu arayüzü ile yoklama takibini kolaylaştırıyoruz. 
              Öğretmenler ve öğrenciler için tasarlanmış güvenli platform.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/giris"
                startIcon={<Login />}
                sx={{ 
                  background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 70%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0d47a1 30%, #01579b 70%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(26, 35, 126, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Giriş Yap
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/kayit"
                startIcon={<PersonAdd />}
                sx={{ 
                  borderColor: '#fff',
                  color: '#fff',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: '#fff',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Kayıt Ol
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Sağ Taraf - Özellikler */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                backdropFilter: 'blur(10px)',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Kolay Yoklama
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tek tıkla yoklama al ve takip et
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                backdropFilter: 'blur(10px)',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Timer sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Anlık Takip
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gerçek zamanlı devam durumu
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                backdropFilter: 'blur(10px)',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Groups sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Sınıf Yönetimi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Öğrenci listelerini düzenle
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                backdropFilter: 'blur(10px)',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <School sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Modern Arayüz
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kullanıcı dostu tasarım
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Alt bilgi */}
      <Box sx={{ textAlign: 'center', mt: 6, color: 'white', opacity: 0.8 }}>
        <Typography variant="body2">
          © 2025 EduCheck -  ENM DİGİTAL
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Hosgeldiniz;
