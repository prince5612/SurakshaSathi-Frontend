

// components/Header.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('userEmail'); // or sessionStorage.clear()
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">SurakshaSathi</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/car-insurance">Car Insurance</Nav.Link>
            <Nav.Link as={Link} to="/flood-insurance">Flood Insurance</Nav.Link>
            <Nav.Link as={Link} to="/travel-insurance">Travel Insurance</Nav.Link>
            <Nav.Link as={Link} to="/health-insurance">Health Insurance</Nav.Link>
            <Nav.Link as={Link} to="/life-insurance">Life Insurance</Nav.Link>
            <Nav.Link as={Link} to="/claims">Claims</Nav.Link>
            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            <Nav.Link
              as="span"
              onClick={handleLogout}
              style={{ cursor: 'pointer', color: 'inherit', padding: '0.5rem 1rem' }}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;



