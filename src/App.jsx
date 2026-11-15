import { Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.jsx';
import Content from './components/Content.jsx';
import Footer from './components/Footer.jsx';
import Read from './components/Read.jsx';
import Create from './components/Create.jsx';
import './App.css';

// I use App to hold the layout shared by all three pages.
function App() {
  return (
    <div className="page-layout">
      {/* I keep the navigation visible above the changing content. */}
      <NavigationBar />
      <main className="container page-content">
        <div className="content-panel">
          {/* I change the middle of the page here when the URL changes. */}
          <Routes>
            {/* I show the welcome page at the root URL. */}
            <Route path="/" element={<Content />} />
            {/* I show the server movie list on Read. */}
            <Route path="/read" element={<Read />} />
            {/* I show the form for adding a movie on Create. */}
            <Route path="/create" element={<Create />} />
          </Routes>
        </div>
      </main>
      {/* I put the footer outside Routes so I can see it on every page. */}
      <Footer />
    </div>
  );
}

export default App;
