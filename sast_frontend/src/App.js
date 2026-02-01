import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home       from './components/Home';
import SASTPage   from './components/SAST';
import ContainerPage from './components/trivvy';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/Sast"      element={<SASTPage />} />
        <Route path="/Trivvy" element={<ContainerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
