


// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './pages/Dashboard';
// import CarInsurance from './pages/CarInsurance';
// import FloodInsurance from './pages/FloodInsurance';
// import TravelInsurance from './pages/TravelInsurance';
// import HealthInsurance from './pages/HealthInsurance';
// import LifeInsurance from './pages/LifeInsurance';
// import Claims from './pages/Claims';
// import { Container } from 'react-bootstrap';

// function AppContent() {
//   const location = useLocation();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSignup, setIsSignup] = useState(false);

//   const toggleForm = () => setIsSignup(!isSignup);

//   // Hide header/footer on login/signup pages
//   const authPaths = ['/login', '/signup'];
//   const hideHeaderFooter = authPaths.includes(location.pathname);

//   return (
//     <>
//       {!hideHeaderFooter && <Header />}
//       <main className="py-3 min-vh-100">
//         <Container>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/car-insurance" element={<CarInsurance />} />
//             <Route path="/flood-insurance" element={<FloodInsurance />} />
//             <Route path="/travel-insurance" element={<TravelInsurance />} />
//             <Route path="/health-insurance" element={<HealthInsurance />} />
//             <Route path="/life-insurance" element={<LifeInsurance />} />
//             <Route path="/claims" element={<Claims />} />
//           </Routes>
//         </Container>
//       </main>
//       {!hideHeaderFooter && <Footer />}
//     </>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }


// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import CarInsurance from './pages/CarInsurance';
import FloodInsurance from './pages/FloodInsurance';
import TravelInsurance from './pages/TravelInsurance';
import HealthInsurance from './pages/HealthInsurance';
import LifeInsurance from './pages/LifeInsurance';
import Claims from './pages/Claims';
import { Container } from 'react-bootstrap';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Determine if header/footer should be hidden
  const authPaths = ['/login', '/signup' , '/','/admin'];
  const hideHeaderFooter = authPaths.includes(location.pathname);

  // Callback to pass to Login component
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      {!hideHeaderFooter && <Header userLoggedIn={isLoggedIn} />}
      <main className="py-3 min-vh-100">
        <Container>
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route
              path="/"
              element={<Login onLogin={handleLogin} />}
            />
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/car-insurance" element={<CarInsurance />} />
            <Route path="/flood-insurance" element={<FloodInsurance />} />
            <Route path="/travel-insurance" element={<TravelInsurance />} />
            <Route path="/health-insurance" element={<HealthInsurance />} />
            <Route path="/life-insurance" element={<LifeInsurance />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/admin" element={<AdminDashboard />} />

          </Routes>
        </Container>
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

