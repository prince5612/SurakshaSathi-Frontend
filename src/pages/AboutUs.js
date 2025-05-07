// pages/AboutUs.jsx
import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { FaBullseye, FaUsers, FaHandshake } from 'react-icons/fa';

function AboutUs() {
  return (
    <div className="py-5" style={{ backgroundColor: '#f5f8fa' }}>
      <Container>
        {/* Hero Section */}
        <Row className="mb-5 text-center">
          <Col>
            <h1 className="display-4 fw-bold text-primary">About SurakshaSathi</h1>
            <p className="lead text-secondary">
              Your trusted partner for dynamic, personalized insurance pricing powered by AI and real-time data.
            </p>
          </Col>
        </Row>

        {/* Mission & Vision */}
        <Row className="mb-5 text-center">
          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaBullseye size={50} className="text-primary mb-3" />
                <Card.Title className="mb-3 fw-bold">Our Mission</Card.Title>
                <Card.Text className="text-muted">
                  To revolutionize insurance by providing fair, dynamic premiums through cutting-edge technology, helping customers secure their future effortlessly.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaUsers size={50} className="text-primary mb-3" />
                <Card.Title className="mb-3 fw-bold">Our Vision</Card.Title>
                <Card.Text className="text-muted">
                  To be the leading platform that empowers insurance with transparency, personalization, and real-time adaptability for all.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaHandshake size={50} className="text-primary mb-3" />
                <Card.Title className="mb-3 fw-bold">Our Promise</Card.Title>
                <Card.Text className="text-muted">
                  We promise to deliver trust, innovation, and unmatched support to our customers every step of the way.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="mb-4">
          <Col>
            <h2 className="mb-4 text-center text-primary fw-bold">Meet Our Team</h2>
            <Row className="justify-content-center gy-4">
              {/* Team member 1 */}
              <Col md={4} lg={3}>
                <Card className="text-center border-0 shadow-sm h-100">
                  <Card.Body>
                    <Image
                      src="https://res.cloudinary.com/dxvbmboj9/image/upload/v1746619215/jay_the_boss_cgnqtl.jpg"
                      roundedCircle
                      fluid
                      alt="Chavda Jay"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      className="mb-3"
                    />
                    <Card.Title>Chavda Jay</Card.Title>
                    {/* <Card.Subtitle className="mb-2 text-muted">CEO & Founder</Card.Subtitle>
                    <Card.Text className="text-muted">
                      Visionary leader driving innovation and customer-centric solutions.
                    </Card.Text> */}
                  </Card.Body>
                </Card>
              </Col>
              {/* Team member 2 */}
              <Col md={4} lg={3}>
                <Card className="text-center border-0 shadow-sm h-100">
                  <Card.Body>
                    <Image
                      src="https://res.cloudinary.com/dxvbmboj9/image/upload/v1746619053/prince_ceo_of_SurakshaSathi_s2wbvk.jpg"
                      roundedCircle
                      fluid
                      alt="Chaniyara Prince"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      className="mb-3"
                    />
                    <Card.Title>Chaniyara Prince</Card.Title>
                    {/* <Card.Subtitle className="mb-2 text-muted">Chief Technology Officer</Card.Subtitle>
                    <Card.Text className="text-muted">
                      Leading tech innovation and ensuring cutting-edge platform performance.
                    </Card.Text> */}
                  </Card.Body>
                </Card>
              </Col>
              {/* Team member 3 */}
              <Col md={4} lg={3}>
                <Card className="text-center border-0 shadow-sm h-100">
                  <Card.Body>
                    <Image
                      src="https://res.cloudinary.com/dxvbmboj9/image/upload/v1746619256/jainil_babu_ihthzu.jpg"
                      roundedCircle
                      fluid
                      alt="Modi Jainil"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      className="mb-3"
                    />
                    <Card.Title>Modi Jainil</Card.Title>
                    {/* <Card.Subtitle className="mb-2 text-muted">Head of Data Science</Card.Subtitle>
                    <Card.Text className="text-muted">
                      Designing advanced machine learning models for dynamic premium pricing.
                    </Card.Text> */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Closing Statement */}
        <Row>
          <Col className="text-center">
            <h3 className="fw-bold text-primary">Join us on our journey to transform insurance for everyone.</h3>
            <p className="text-secondary fs-5">
              At SurakshaSathi, we blend technology with trust to ensure your peace of mind.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutUs;