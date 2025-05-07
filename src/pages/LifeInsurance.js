

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import dayjs from 'dayjs';

export default function LifeInsurance() {
  const [formValues, setFormValues] = useState({
    age: '', gender: '', income: '', occupation_risk: '', dependents: ''
  });
  const [lifeDetails, setLifeDetails] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);
  const [predictedPremium, setPredictedPremium] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasDetails, setHasDetails] = useState(false);
  const [hasLastPayment, setHasLastPayment] = useState(false);

  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!email) {
        setInitialLoading(false);
        return;
      }
      try {
        const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/life/details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          // flags
          setHasDetails(!!data.details);
          setHasLastPayment(!!data.last_payment);

          // populate states
          if (data.details) {
            setLifeDetails(data.details);
            setFormValues({
              age: data.details.age,
              gender: data.details.gender,
              income: data.details.income,
              occupation_risk: data.details.occupation_risk,
              dependents: data.details.dependents,
            });
          }
          if (data.last_payment) {
            setLastPayment(data.last_payment);
          }
        } else {
          console.warn('Details endpoint returned non-ok status');
        }
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchDetails();
  }, [email]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'dependents' ? parseInt(value, 10) || '' : value,
    }));
  };

  const calculatePremium = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/life/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formValues.age, 10),
          gender: formValues.gender,
          income: parseFloat(formValues.income),
          occupation_risk: formValues.occupation_risk,
          dependents: parseInt(formValues.dependents, 10),
        }),
      });
      const data = await res.json();
      if (res.ok) setPredictedPremium(data.predicted_premium);
      else alert(data.error || 'Failed to calculate premium');
    } catch {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const saveDetails = async () => {
    setLoading(true);
    try {
      const url = hasDetails ? 'update' : 'create';
      const res = await fetch(`https://surakshasathi-backend.onrender.com/api/insurance/life/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formValues, email }),
      });
      if (res.ok) {
        setHasDetails(true);
        setLifeDetails({ ...formValues });
        setEditing(false);
        alert('Details saved');
      } else alert('Save failed');
    } catch {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const payPremium = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/life/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formValues, predicted_premium: predictedPremium, email }),
      });
      if (res.ok) {
        const now = dayjs().toISOString();
        const newPay = { amount: predictedPremium, date: now };
        setLastPayment(newPay);
        setHasLastPayment(true);
        setPredictedPremium(null);
        alert('Payment successful');
      } else alert('Payment failed');
    } catch {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const daysUntilNext = lastPayment
    ? dayjs(lastPayment.date).add(1, 'month').diff(dayjs(), 'day')
    : null;

  if (initialLoading) return <p>Loading...</p>;

  return (
    <Container className="py-5">
      <h1 className="mb-4">Life Insurance</h1>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Personal Details</Card.Header>
            <Card.Body>
              {(!hasDetails || editing) ? (
                <Form onSubmit={calculatePremium}>
                  <Form.Group className="mb-3" controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number" name="age"
                      value={formValues.age}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formValues.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="income">
                    <Form.Label>Annual Income</Form.Label>
                    <Form.Control
                      type="number" name="income"
                      value={formValues.income}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="occupation_risk">
                    <Form.Label>Occupation Risk</Form.Label>
                    <Form.Select
                      name="occupation_risk"
                      value={formValues.occupation_risk}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select risk</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="dependents">
                    <Form.Label>Dependents</Form.Label>
                    <Form.Control
                      type="number" name="dependents"
                      value={formValues.dependents}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Calculating…' : 'Calculate Premium'}
                    </Button>
                    <Button variant="success" onClick={saveDetails} disabled={loading}>
                      {hasDetails ? 'Update Details' : 'Save Details'}
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <p>Age: {lifeDetails.age}</p>
                  <p>Gender: {lifeDetails.gender}</p>
                  <p>Income: ₹{lifeDetails.income}</p>
                  <p>Occupation Risk: {lifeDetails.occupation_risk}</p>
                  <p>Dependents: {lifeDetails.dependents}</p>
                  <div className="d-flex justify-content-between">
                    <Button variant="primary" disabled={loading} onClick={calculatePremium}>
                      {loading ? 'Calculating…' : 'Calculate Premium'}
                    </Button>
                    <Button onClick={() => setEditing(true)}>Edit Details</Button>
                  </div>
                  {/* <Button onClick={() => setEditing(true)}>Edit Details</Button> */}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Premium Details</Card.Header>
            <Card.Body>
              {hasLastPayment ? (
                <>
                  <h5>Last Paid Premium</h5>
                  <p>Amount: ₹{lastPayment.amount}</p>
                  <p>Date: {dayjs(lastPayment.date).format('DD MMM YYYY')}</p>
                  <p>Next due in: {daysUntilNext} days</p>
                </>
              ) : (
                <p>No payments yet.</p>
              )}
              {predictedPremium != null && (
                <>
                  <h4 className="mt-3">Predicted: ₹{predictedPremium}</h4>
                  <Button onClick={payPremium} disabled={loading}>
                    Pay Premium
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
