

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
// import dayjs from 'dayjs';

// export default function CarInsurance() {
//   const [formValues, setFormValues] = useState({
//     manufacturer_date: '',
//     car_price_lakhs: '',
//     city: '',
//     user_age: ''
//   });
//   const [carDetails, setCarDetails] = useState(null);
//   const [predictedPremium, setPredictedPremium] = useState(null);
//   const [lastPayment, setLastPayment] = useState(null);

//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   const [hasDetails, setHasDetails] = useState(false);
//   const [hasLastPayment, setHasLastPayment] = useState(false);

//   const email = localStorage.getItem('userEmail');

//   // Fetch existing car details & last payment on mount
//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (!email) {
//         setInitialLoading(false);
//         return;
//       }
//       try {
//         const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/car/details', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email })
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setHasDetails(!!data.details);
//           setHasLastPayment(!!data.last_payment);

//           if (data.details) {
//             setCarDetails(data.details);
//             setFormValues({
//               manufacturer_date: data.details.manufacturer_date,
//               car_price_lakhs: data.details.car_price_lakhs,
//               city: data.details.city,
//               user_age: data.details.user_age
//             });
//           }
//           if (data.last_payment) {
//             setLastPayment(data.last_payment);
//           }
//         } else {
//           console.warn('Car details endpoint returned non-ok status');
//         }
//       } catch (err) {
//         console.error('Error fetching car details:', err);
//       } finally {
//         setInitialLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [email]);

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setFormValues(prev => ({ ...prev, [name]: value }));
//   };

//   const calculatePremium = async e => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/car/premium', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           manufacturer_date: formValues.manufacturer_date,
//           car_price_lakhs: parseFloat(formValues.car_price_lakhs),
//           city: formValues.city,
//           user_age: parseInt(formValues.user_age, 10)
//         })
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setPredictedPremium(data.predicted_premium);
//       } else {
//         alert(data.error || 'Failed to calculate premium');
//       }
//     } catch (err) {
//       console.error('Error calculating premium:', err);
//       alert('Server error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveDetails = async () => {
//     setLoading(true);
//     try {
//       const url = hasDetails ? 'update' : 'create';
//       const res = await fetch(`https://surakshasathi-backend.onrender.com/api/insurance/car/${url}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formValues, email })
//       });
//       if (res.ok) {
//         setHasDetails(true);
//         setCarDetails({ ...formValues });
//         setEditing(false);
//         alert('Details saved successfully');
//       } else {
//         alert('Failed to save details');
//       }
//     } catch (err) {
//       console.error('Error saving details:', err);
//       alert('Server error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const payPremium = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/car/pay', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formValues, predicted_premium: predictedPremium, email })
//       });
//       const data = await res.json();
//       if (res.ok) {
//         const now = dayjs().toISOString();
//         setLastPayment({ amount: predictedPremium, date: now });
//         setHasLastPayment(true);
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
//       <h1 className="mb-4">Car Insurance</h1>
//       <Row>
//         <Col md={6}>
//           <Card>
//             <Card.Header>Car & User Details</Card.Header>
//             <Card.Body>
//               {(!hasDetails || editing) ? (
//                 <Form onSubmit={calculatePremium}>
//                   <Form.Group className="mb-3" controlId="manufacturer_date">
//                     <Form.Label>Manufacture Date</Form.Label>
//                     <Form.Control
//                       type="date"
//                       name="manufacturer_date"
//                       value={formValues.manufacturer_date}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3" controlId="car_price_lakhs">
//                     <Form.Label>Car Price (lakhs)</Form.Label>
//                     <Form.Control
//                       type="number"
//                       step="0.01"
//                       name="car_price_lakhs"
//                       value={formValues.car_price_lakhs}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3" controlId="city">
//                     <Form.Label>City</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="city"
//                       value={formValues.city}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3" controlId="user_age">
//                     <Form.Label>User Age</Form.Label>
//                     <Form.Control
//                       type="number"
//                       name="user_age"
//                       value={formValues.user_age}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </Form.Group>

//                   <div className="d-flex justify-content-between">
//                     <Button type="submit" variant="primary" disabled={loading}>
//                       {loading ? 'Calculating...' : 'Calculate Premium'}
//                     </Button>
//                     <Button variant="success" onClick={saveDetails} disabled={loading}>
//                       {hasDetails ? 'Update Details' : 'Save Details'}
//                     </Button>
//                   </div>
//                 </Form>
//               ) : (
//                 <>
//                   <p>Manufacture Date: {carDetails.manufacturer_date}</p>
//                   <p>Car Price: ₹{carDetails.car_price_lakhs} lakhs</p>
//                   <p>City: {carDetails.city}</p>
//                   <p>User Age: {carDetails.user_age}</p>
//                   <div className="d-flex justify-content-between">
//                     <Button onClick={calculatePremium} variant="primary" disabled={loading}>
//                       {loading ? 'Calculating...' : 'Calculate Premium'}
//                     </Button>
//                     <Button onClick={() => setEditing(true)}>Edit Details</Button>
//                   </div>
//                   {/* <Button onClick={() => setEditing(true)}>Edit Details</Button> */}
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={6}>
//           <Card>
//             <Card.Header>Premium Details</Card.Header>
//             <Card.Body>
//               {hasLastPayment ? (
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




// src/pages/CarInsurance.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import dayjs from 'dayjs';

export default function CarInsurance() {
  const [formValues, setFormValues] = useState({
    manufacturer_date: '',
    car_price_lakhs: '',
    city: '',
    user_age: '',
    device_id: ''
  });
  const [carDetails, setCarDetails] = useState(null);
  const [predictedPremium, setPredictedPremium] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasDetails, setHasDetails] = useState(false);
  const [hasLastPayment, setHasLastPayment] = useState(false);

  // ← NEW state to hold full features object
  const [features, setFeatures] = useState(null);

  const email = localStorage.getItem('userEmail');
  const appDownloadUrl = 'https://drive.google.com/uc?export=download&id=1QMTIIi-bjH_EporZMA0ybn53vtyZfJ4p';

  // Fetch existing car details & last payment on mount
  useEffect(() => {
    const fetchDetails = async () => {
      if (!email) {
        setInitialLoading(false);
        return;
      }
      try {
        const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/car/details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          setHasDetails(!!data.details);
          setHasLastPayment(!!data.last_payment);

          if (data.details) {
            setCarDetails(data.details);
            setFormValues({
              manufacturer_date: data.details.manufacturer_date,
              car_price_lakhs: data.details.car_price_lakhs,
              city: data.details.city,
              user_age: data.details.user_age,
              device_id: data.details.device_id || ''
            });
          }
          if (data.last_payment) {
            setLastPayment(data.last_payment);
          }
        }
      } catch (err) {
        console.error('Error fetching car details:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchDetails();
  }, [email]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const calculatePremium = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/car/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manufacturer_date: formValues.manufacturer_date,
          car_price_lakhs: parseFloat(formValues.car_price_lakhs),
          city: formValues.city,
          user_age: parseInt(formValues.user_age, 10),
          device_id: formValues.device_id
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPredictedPremium(data.predicted_premium);
        setFeatures(data.features);          // ← capture features
      } else {
        alert(data.error || 'Failed to calculate premium');
      }
    } catch (err) {
      console.error('Error calculating premium:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const saveDetails = async () => {
    setLoading(true);
    try {
      const url = hasDetails
        ? 'https://surakshasathi-backend.onrender.com/api/insurance/car/update'
        : 'https://surakshasathi-backend.onrender.com/api/insurance/car/create';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formValues, email })
      });
      if (res.ok) {
        setHasDetails(true);
        setCarDetails({ ...formValues });
        setEditing(false);
        alert('Details saved successfully');
      } else {
        alert('Failed to save details');
      }
    } catch (err) {
      console.error('Error saving details:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const payPremium = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formValues,
        ...features,                     // ← include all features
        predicted_premium: predictedPremium,
        email
      };
      const res = await fetch('https://surakshasathi-backend.onrender.com/api/insurance/car/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        const now = dayjs().toISOString();
        setLastPayment({ amount: predictedPremium, date: now });
        setHasLastPayment(true);
        setPredictedPremium(null);
        alert('Payment successful!');
      } else {
        alert(data.message || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment Error:', err);
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
      <Row className="mb-4">
        <Col className="text-left">
          <h1 className="mb-4">Car Insurance</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <p className="lead">
            Surakshasathi Car Insurance provides comprehensive coverage for your vehicle with advanced GPS tracking features.
          </p>
        </Col>
        <Col md={6} className="text-center">
          <Button
            variant="success"
            href={appDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4"
          >
            Download Surakshasathi GPS Tracking App
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Car & User Details</Card.Header>
            <Card.Body>
              {(!hasDetails || editing) ? (
                <Form onSubmit={calculatePremium}>
                  <Form.Group className="mb-3" controlId="manufacturer_date">
                    <Form.Label>Manufacture Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="manufacturer_date"
                      value={formValues.manufacturer_date}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="car_price_lakhs">
                    <Form.Label>Car Price (lakhs)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="car_price_lakhs"
                      value={formValues.car_price_lakhs}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formValues.city}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="user_age">
                    <Form.Label>User Age</Form.Label>
                    <Form.Control
                      type="number"
                      name="user_age"
                      value={formValues.user_age}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="device_id">
                    <Form.Label>Device ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="device_id"
                      value={formValues.device_id}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your device ID"
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Calculating...' : 'Calculate Premium'}
                    </Button>
                    <Button variant="success" onClick={saveDetails} disabled={loading}>
                      {hasDetails ? 'Update Details' : 'Save Details'}
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <p>Manufacture Date: {carDetails.manufacturer_date}</p>
                  <p>Car Price: ₹{carDetails.car_price_lakhs} lakhs</p>
                  <p>City: {carDetails.city}</p>
                  <p>User Age: {carDetails.user_age}</p>
                  <p>Device ID: {carDetails.device_id}</p>
                  <div className="d-flex justify-content-between">
                    <Button onClick={calculatePremium} variant="primary" disabled={loading}>
                      {loading ? 'Calculating...' : 'Calculate Premium'}
                    </Button>
                    <Button onClick={() => setEditing(true)}>Edit Details</Button>
                  </div>
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
                <p>No previous payments found.</p>
              )}

              {predictedPremium != null && (
                <>
                  <h4 className="mt-3">Predicted Premium: ₹{predictedPremium}</h4>
                  {/* ← NEW: feature breakdown */}
                  {features && (
                    <div className="mt-2">
                      {/* <p><strong>Features used:</strong></p> */}
                      
                        {/* <p>Manufacture Date (ordinal): {features.manufacturer_date}</p> */}
                        <p>Car Price (lakhs): {features.car_price_lakhs}</p>
                        <p>User Age: {features.user_age}</p>
                        <p>Driver Score: {features.driver_score.toFixed(2)}</p>
                        <p>Weather code: {features.weather}</p>
                    
                    </div>
                  )}
                  <Button variant="success" onClick={payPremium} disabled={loading}>
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
