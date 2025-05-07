// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const [history, setHistory] = useState({});
  const [approvedClaims, setApprovedClaims] = useState(0);
  const email = localStorage.getItem('userEmail');

  // Fetch payment history and approved‐claims count
  useEffect(() => {
    if (!email) return;

    // 1) payment history (you already have this)
    fetch('https://surakshasathi-backend.onrender.com/api/insurance/payments/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(setHistory)
    .catch(console.error);

    // 2) approved claims count
    fetch('https://surakshasathi-backend.onrender.com/api/insurance/claims/count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => setApprovedClaims(data.approved_count))
    .catch(console.error);

  }, [email]);

  // derive summary metrics
  const totalPolicies = Object.keys(history).filter(
    policy => (history[policy] || []).length > 0
  ).length;

  const totalPremium = Object.values(history).flat()
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="py-5">
      <Container>
        <h1 className="mb-4">Dashboard</h1>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Header>Active Policies</Card.Header>
              <Card.Body>
                <h2>{totalPolicies}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Header>Total Premium Paid</Card.Header>
              <Card.Body>
                <h2>₹{totalPremium}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Header>Approved Claims</Card.Header>
              <Card.Body>
                <h2>{approvedClaims}</h2>
              </Card.Body>
            </Card>
          </Col>
         
        </Row>

        {/* render a line chart per policy */}
        {Object.entries(history).map(([policy, payments]) =>
          payments.length > 0 && (
            <Card className="mb-4" key={policy}>
              <Card.Header>{policy} Premiums Over Time</Card.Header>
              <Card.Body style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={payments.map(p => ({ date: p.date.slice(0,10), amount: p.amount }))}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          )
        )}
      </Container>
    </div>
  );
}
