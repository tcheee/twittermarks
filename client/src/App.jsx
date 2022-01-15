import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Homepage from './views/Homepage.jsx';
import TweetSearch from './views/TweetSearch.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/search" element={<TweetSearch />} />
        <Route path="/" element={<Homepage />} />
        <Route path="*" exact={true} element={<Homepage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
