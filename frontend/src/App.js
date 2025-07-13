import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hosgeldiniz from './components/Hosgeldiniz';
import GirisYap from './components/GirisYap';
import KayitOl from './components/KayitOl';
import OgrenciKayit from './components/OgrenciKayit';
import OgretmenKayit from './components/OgretmenKayit';
import OgrenciPanel from './components/OgrenciPanel';
import OgretmenPanel from './components/OgretmenPanel';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Hosgeldiniz />} />
      <Route path="/giris" element={<GirisYap />} />
      <Route path="/kayit" element={<KayitOl />} />
      <Route path="/ogrenci-kayit" element={<OgrenciKayit />} />
      <Route path="/ogretmen-kayit" element={<OgretmenKayit />} />
      <Route path="/ogrenci-panel" element={<OgrenciPanel />} />
      <Route path="/ogretmen-panel" element={<OgretmenPanel />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default App;
