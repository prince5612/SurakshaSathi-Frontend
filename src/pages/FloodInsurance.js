

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
// import dayjs from 'dayjs';

// export default function FloodInsurance() {
//   const [city, setCity] = useState('');
//   const [predictedPremium, setPredictedPremium] = useState(null);
//   const [lastPayment, setLastPayment] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   const email = localStorage.getItem('userEmail');

//   // On load, fetch last flood premium payment if any
//   useEffect(() => {
//     const fetchLastPayment = async () => {
//       try {
//         const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/flood/last_payment', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email })
//         });
//         const data = await res.json();
//         if (res.ok && data.last_payment) {
//           setLastPayment(data.last_payment);
//         }
//       } catch (err) {
//         console.error('Error fetching last payment:', err);
//       } finally {
//         setInitialLoading(false);
//       }
//     };
//     fetchLastPayment();
//   }, [email]);

//   const calculatePremium = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/flood/premium', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ city })
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setPredictedPremium(data.predicted_premium);
//       } else {
//         alert(data.error || 'Failed to calculate premium');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Server error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const payPremium = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/flood/pay', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ city, predicted_premium: predictedPremium, email })
//       });
//       const data = await res.json();
//       if (res.ok) {
//         const now = dayjs().toISOString();
//         setLastPayment({ amount: predictedPremium, date: now });
//         setPredictedPremium(null);
//         alert('Payment successful!');
//       } else {
//         alert(data.message || 'Payment failed');
//       }
//     } catch (err) {
//       console.error('Payment Error:', err);
//       alert('Server error during payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const daysUntilNext = lastPayment
//     ? dayjs(lastPayment.date).add(1, 'month').diff(dayjs(), 'day')
//     : null;

//   if (initialLoading) return <p>Loading...</p>;

//   return (
//     <Container className="py-5">
//       <h1 className="mb-4">Flood Insurance</h1>
//       <Row>
//         <Col md={6}>
//           <Card>
//             <Card.Header>Flood Risk Factor</Card.Header>
//             <Card.Body>
//               <Form onSubmit={calculatePremium}>
//                 <Form.Group controlId="city" className="mb-3">
//                   <Form.Label>City</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="city"
//                     value={city}
//                     onChange={e => setCity(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <Button type="submit" variant="primary" disabled={loading}>
//                   {loading ? 'Calculating...' : 'Calculate Premium'}
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={6}>
//           <Card>
//             <Card.Header>Premium Details</Card.Header>
//             <Card.Body>
//               {lastPayment ? (
//                 <>
//                   <h5>Last Paid Premium</h5>
//                   <p>Amount: ₹{lastPayment.amount}</p>
//                   <p>Date: {dayjs(lastPayment.date).format('DD MMM YYYY')}</p>
//                   <p>Next due in: {daysUntilNext} days</p>
//                 </>
//               ) : (
//                 <p>No previous payments found.</p>
//               )}

//               {predictedPremium != null && (
//                 <>
//                   <h4 className="mt-3">Predicted Premium: ₹{predictedPremium}</h4>
//                   <Button variant="success" onClick={payPremium} disabled={loading}>
//                     Pay Premium
//                   </Button>
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }


// pages/FloodInsurance.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import dayjs from 'dayjs';

export default function FloodInsurance() {
  const [city, setCity] = useState('');
  const [predictedPremium, setPredictedPremium] = useState(null);

  // NEW: feature states
  const [rainMm, setRainMm]         = useState(null);
  const [hasAlert, setHasAlert]     = useState(null);
  const [nearWater, setNearWater]   = useState(null);
  const [lat, setLat]               = useState(null);
  const [lon, setLon]               = useState(null);

  const [lastPayment, setLastPayment] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const email = localStorage.getItem('userEmail');

  // On mount, fetch last payment
  useEffect(() => {
    const fetchLast = async () => {
      try {
        const res = await fetch(
          'https://surakshasathi-backend.onrender.com/api/insurance/flood/last_payment',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          }
        );
        const data = await res.json();
        if (res.ok && data.last_payment) {
          setLastPayment(data.last_payment);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchLast();
  }, [email]);

  const calculatePremium = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        'https://surakshasathi-backend.onrender.com/api/insurance/flood/premium',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city })
        }
      );
      const data = await res.json();
      if (res.ok) {
        // set premium + all features
        setPredictedPremium(data.predicted_premium);
        setRainMm(data.rain_mm);
        setHasAlert(data.has_alert);
        setNearWater(data.near_water);
        setLat(data.lat);
        setLon(data.lon);
      } else {
        alert(data.error || 'Failed to calculate premium');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const payPremium = async () => {
    setLoading(true);
    try {
      const payload = {
        email,
        city,
        rain_mm:      rainMm,
        has_alert:    hasAlert,
        near_water:   nearWater,
        lat,
        lon,
        predicted_premium: predictedPremium
      };

      const res = await fetch(
        'https://surakshasathi-backend.onrender.com/api/insurance/flood/pay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      const data = await res.json();
      if (res.ok) {
        // reflect new last payment
        const now = dayjs().toISOString();
        setLastPayment({ ...payload, amount: predictedPremium, date: now });
        setPredictedPremium(null);
        alert('Payment successful!');
      } else {
        alert(data.message || 'Payment failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error during payment');
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
      <h1 className="mb-4">Flood Insurance</h1>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Flood Risk Factor</Card.Header>
            <Card.Body>
              <Form onSubmit={calculatePremium}>
                <Form.Group controlId="city" className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Calculating...' : 'Calculate Premium'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Premium Details</Card.Header>
            <Card.Body>
              {lastPayment ? (
                <>
                  <h5>Last Paid Premium</h5>
                  <p>Amount: ₹{lastPayment.amount}</p>
                  <p>Date: {dayjs(lastPayment.date).format('DD MMM YYYY')}</p>
                  <p>Next due in: {daysUntilNext} days</p>
                </>
              ) : (
                <p>No previous payments found.</p>
              )}

              {predictedPremium != null && (
                <>
                  <h4 className="mt-3">Predicted Premium: ₹{predictedPremium}</h4>
                  {/* NEW: display all feature values */}
                  <p>Rain (mm): {rainMm}</p>
                  <p>Has alert: {hasAlert ? 'Yes' : 'No'}</p>
                  <p>Near water: {nearWater ? 'Yes' : 'No'}</p>
                  <p>Latitude: {lat}</p>
                  <p>Longitude: {lon}</p>

                  <Button
                    variant="success"
                    onClick={payPremium}
                    disabled={loading}
                  >
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
