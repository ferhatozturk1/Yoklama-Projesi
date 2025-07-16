import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GirisYap from './components/GirisYap';
import OgretmenKayit from './components/OgretmenKayit';
import OgretmenPanel from './components/OgretmenPanel';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<GirisYap />} />
      <Route path="/giris" element={<GirisYap />} />
      <Route path="/ogretmen-kayit" element={<OgretmenKayit />} />
      <Route path="/ogretmen-panel" element={<OgretmenPanel />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default App;
