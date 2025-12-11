import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Overview, BrandView, HotelView, PriceMonitoring, ActionCenter } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/brand" element={<BrandView />} />
        <Route path="/hotel" element={<HotelView />} />
        <Route path="/price" element={<PriceMonitoring />} />
        <Route path="/actions" element={<ActionCenter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

