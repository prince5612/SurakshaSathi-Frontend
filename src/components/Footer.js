// components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row>
          <Col md={6}>
            <h4>SurakshaSathi</h4>
            <p>Dynamically adjusting insurance premiums for better coverage</p>
          </Col>
          <Col md={3}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-light">About Us</a></li>
              <li><a href="/about" className="text-light">Contact</a></li>
              {/* <li><a href="#faq" className="text-light">FAQ</a></li> */}
            </ul>
          </Col>
          <Col md={3}>
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li>Email: surakshasathi3@gmail.com</li>
              <li>Phone: +1 234 567 890</li>
            </ul>
          </Col>
          {/* <Col md={2}>
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li><a href="#twitter" className="text-light">Twitter</a></li>
              <li><a href="#linkedin" className="text-light">LinkedIn</a></li>
              <li><a href="#facebook" className="text-light">Facebook</a></li>
            </ul>
          </Col> */}
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <p>&copy; 2025 SurakshaSathi. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;