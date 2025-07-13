import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Container,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { 
  School, 
  Person, 
  PersonAdd,
  ArrowBack,
  MenuBook,
  SupervisorAccount
} from '@mui/icons-material';

const KayitOl = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1a237e 30%, #0d47a1 70%, #01579b 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: 'white', fontWeight: 'bold' }}
          >
            Ana Sayfaya Dön
          </Button>
        </Box>

        <Paper elevation={10} sx={{ 
          p: 4, 
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <School sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
              Kayıt Ol
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hesap türünüzü seçerek kayıt işlemini başlatın
            </Typography>
          </Box>

          {/* Kayıt Seçenekleri */}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  border: '2px solid transparent',
                  '&:hover': {
                    border: '2px solid #1a237e'
                  }
                }}
                onClick={() => navigate('/ogrenci-kayit')}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <MenuBook sx={{ 
                    fontSize: 80, 
                    color: '#1a237e', 
                    mb: 3,
                    background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
                    Öğrenci
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Derslerinizin yoklamalarını takip edin ve katılım sağlayın
                  </Typography>
                  <                  Box sx={{ 
                    bgcolor: '#e8f4f8', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 2 
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Özellikler:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Yoklama takibi<br/>
                      • Devam durumu görüntüleme<br/>
                      • Anlık bildirimler
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<PersonAdd />}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0d47a1 30%, #01579b 90%)'
                      }
                    }}
                  >
                    Öğrenci Olarak Kayıt Ol
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  border: '2px solid transparent',
                  '&:hover': {
                    border: '2px solid #1a237e'
                  }
                }}
                onClick={() => navigate('/ogretmen-kayit')}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <SupervisorAccount sx={{ 
                    fontSize: 80, 
                    color: '#1a237e', 
                    mb: 3,
                    background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
                    Öğretmen
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Sınıflarınızı yönetin, yoklama alın ve öğrenci takibi yapın
                  </Typography>
                  <Box sx={{ 
                    bgcolor: '#e8f4f8', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 2 
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Özellikler:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Yoklama oluşturma<br/>
                      • Sınıf yönetimi<br/>
                      • Devam raporları
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<PersonAdd />}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0d47a1 30%, #01579b 90%)'
                      }
                    }}
                  >
                    Öğretmen Olarak Kayıt Ol
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          {/* Alt bilgi */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Zaten hesabınız var mı?{' '}
              <Link 
                to="/giris" 
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none', 
                  fontWeight: 'bold' 
                }}
              >
                Giriş Yap
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default KayitOl;
