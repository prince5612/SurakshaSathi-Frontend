

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import dayjs from 'dayjs';

export default function HealthInsurance() {
  const [formValues, setFormValues] = useState({
    age: '', gender: '', bmi: '', daily_steps: '', sleep_hours: '',
    pre_existing_condition: '', smoking: '', alcohol_consumption: '', city: ''
  });
  const [healthDetails, setHealthDetails] = useState(null);
  const [predictedPremium, setPredictedPremium] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasDetails, setHasDetails] = useState(false);
  const [hasLastPayment, setHasLastPayment] = useState(false);

  const email = localStorage.getItem('userEmail');

  // Fetch saved health details & last payment on mount
  useEffect(() => {
    const fetchDetails = async () => {
      if (!email) {
        setInitialLoading(false);
        return;
      }
      try {
        const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/health/details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          setHasDetails(!!data.details);
          setHasLastPayment(!!data.last_payment);
          if (data.details) {
            setHealthDetails(data.details);
            setFormValues({
              age: data.details.age,
              gender: data.details.gender,
              bmi: data.details.bmi,
              daily_steps: data.details.daily_steps,
              sleep_hours: data.details.sleep_hours,
              pre_existing_condition: data.details.pre_existing_condition,
              smoking: data.details.smoking,
              alcohol_consumption: data.details.alcohol_consumption,
              city: data.details.city
            });
          }
          if (data.last_payment) {
            setLastPayment(data.last_payment);
          }
        }
      } catch (err) {
        console.error('Error fetching health details:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchDetails();
  }, [email]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const calculatePremium = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/health/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formValues,
          age: parseInt(formValues.age, 10),
          bmi: parseFloat(formValues.bmi),
          daily_steps: parseInt(formValues.daily_steps, 10),
          sleep_hours: parseFloat(formValues.sleep_hours)
        })
      });
      const data = await res.json();
      if (res.ok) setPredictedPremium(data.predicted_premium);
      else alert(data.error || 'Failed to calculate premium');
    } catch (err) {
      console.error('Premium error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const saveDetails = async () => {
    setLoading(true);
    try {
      const url = healthDetails ?
        'https://surakshasathi-backend.onrender.com/api/insurance/health/update' :
        'https://surakshasathi-backend.onrender.com/api/insurance/health/create';
      const method =  'POST';
      const payload = { email, ...formValues,
        age: parseInt(formValues.age, 10),
        bmi: parseFloat(formValues.bmi),
        daily_steps: parseInt(formValues.daily_steps, 10),
        sleep_hours: parseFloat(formValues.sleep_hours)
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setHasDetails(true);
        setHealthDetails(payload);
        setEditing(false);
        alert('Details saved successfully');
      } else alert('Save failed');
    } catch (err) {
      console.error('Save error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const payPremium = async () => {
    if (!predictedPremium) return alert('Calculate premium first');
    setLoading(true);
    try {
      const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/health/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formValues, email, predicted_premium: predictedPremium })
      });
      if (res.ok) {
        const now = dayjs().toISOString();
        setLastPayment({ amount: predictedPremium, date: now });
        setHasLastPayment(true);
        setPredictedPremium(null);
        alert('Payment successful');
      } else alert('Payment failed');
    } catch (err) {
      console.error('Payment error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const daysUntilNext = lastPayment ?
    dayjs(lastPayment.date).add(1, 'month').diff(dayjs(), 'day') : null;

  if (initialLoading) return <p>Loading...</p>;

  return (
    <Container className="py-5">
      <h1 className="mb-4">Health Insurance</h1>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Health Details</Card.Header>
            <Card.Body>
              {(!hasDetails || editing) ? (
                <Form onSubmit={calculatePremium}>
                  {/* Left col inputs */}
                  <Form.Group className="mb-3" controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="number" name="age" value={formValues.age} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={formValues.gender} onChange={handleChange} required>
                      <option value="">Select</option><option>male</option><option>female</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="bmi">
                    <Form.Label>BMI</Form.Label>
                    <Form.Control type="number" step="0.1" name="bmi" value={formValues.bmi} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="daily_steps">
                    <Form.Label>Daily Steps</Form.Label>
                    <Form.Control type="number" name="daily_steps" value={formValues.daily_steps} onChange={handleChange} required />
                  </Form.Group>
                  {/* Right col inputs */}
                  <Form.Group className="mb-3" controlId="sleep_hours">
                    <Form.Label>Sleep Hours</Form.Label>
                    <Form.Control type="number" step="0.1" name="sleep_hours" value={formValues.sleep_hours} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="pre_existing_condition">
                    <Form.Label>Pre-Existing Conditions</Form.Label>
                    <Form.Select name="pre_existing_condition" value={formValues.pre_existing_condition} onChange={handleChange} required>
                      <option value="">Select</option><option>yes</option><option>no</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="smoking">
                    <Form.Label>Smoking</Form.Label>
                    <Form.Select name="smoking" value={formValues.smoking} onChange={handleChange} required>
                      <option value="">Select</option><option>yes</option><option>no</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="alcohol_consumption">
                    <Form.Label>Alcohol Consumption</Form.Label>
                    <Form.Select name="alcohol_consumption" value={formValues.alcohol_consumption} onChange={handleChange} required>
                      <option value="">Select</option><option>yes</option><option>no</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control name="city" value={formValues.city} onChange={handleChange} required />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Calculating...' : 'Calculate Premium'}</Button>
                    <Button variant="success" onClick={saveDetails} disabled={loading}>{hasDetails ? 'Update Details' : 'Save Details'}</Button>
                  </div>
                </Form>
              ) : (
                <>
                  <p>Age: {healthDetails.age}</p>
                  <p>Gender: {healthDetails.gender}</p>
                  <p>BMI: {healthDetails.bmi}</p>
                  <p>Daily Steps: {healthDetails.daily_steps}</p>
                  <p>Sleep Hours: {healthDetails.sleep_hours}</p>
                  <p>Pre-Existing: {healthDetails.pre_existing_condition}</p>
                  <p>Smoking: {healthDetails.smoking}</p>
                  <p>Alcohol: {healthDetails.alcohol_consumption}</p>
                  <p>City: {healthDetails.city}</p>
                  <div className="d-flex justify-content-between">
                    <Button onClick={calculatePremium} variant="primary" disabled={loading}>{loading ? 'Calculating...' : 'Calculate Premium'}</Button>
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
                  <h4 className="mt-3">Predicted Premium: ₹{predictedPremium}</h4>
                  <Button variant="success" onClick={payPremium} disabled={loading}>Pay Premium</Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
