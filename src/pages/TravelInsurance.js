// pages/TravelInsurance.jsx
import React, { use, useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import dayjs from "dayjs";

function TravelInsurance() {
  const [travelDetails, setTravelDetails] = useState({
    city: "",
    start_date: "",
    end_date: "",
    transport_mode: "",
  });

  const [predictedPremium, setPredictedPremium] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [duration_days, setDuration_days] = useState(null);
  const [state, setState] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [crime_index, setCrime_index] = useState(null);
  const [rainfall_mm, setRainFall_mm] = useState(null);
  const [weather_risk, setWeather_risk] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const today = dayjs().format("YYYY-MM-DD");

  const email = localStorage.getItem("userEmail");
  useEffect(() => {
    const fetchLastPayment = async () => {
      try {
        const res = await fetch(
          "https://surakshasathi-backend.onrender.com/api/insurance/travel/last_payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );
        const data = await res.json();
        if (res.ok && data.last_payment) {
          setLastPayment(data.last_payment);
        }
      } catch (err) {
        console.error("Error fetching last payment:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchLastPayment();
  }, [email]);

  const handleInputChange = (e) => {
    if (
      e.target.name === "start_date" &&
      travelDetails.end_date &&
      e.target.value > travelDetails.end_date
    ) {
      setTravelDetails((prev) => ({
        ...prev,
        start_date: e.target.value,
        end_date: e.target.value,
      }));
      return;
    }
    setTravelDetails({
      ...travelDetails,
      [e.target.name]: e.target.value,
    });
  };

  const calculatePremium = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentDone(false);
    try {
      const response = await fetch(
        "https://surakshasathi-backend.onrender.com/api/insurance/travel/premium",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: travelDetails.city,
            start_date: travelDetails.start_date,
            end_date: travelDetails.end_date,
            transport_mode: travelDetails.transport_mode,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setPredictedPremium(data.predicted_premium);
        setDuration_days(data.duration_days);
        setAqi(data.aqi);
        setCrime_index(data.crime_index);
        setRainFall_mm(data.rainfall_mm);
        setWeather_risk(data.weather_risk);
        setState(data.state);
      } else {
        alert(data.error || "Failed to calculate premium");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const payPremium = async () => {
    try {
      const email = localStorage.getItem("userEmail"); // assuming you stored it during login

      const response = await fetch(
        "https://surakshasathi-backend.onrender.com/api/insurance/travel/pay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            ...travelDetails,
            predicted_premium: predictedPremium,
            duration_days: duration_days,
            aqi: aqi,
            crime_index: crime_index,
            rainfall_mm: rainfall_mm,
            weather_risk: weather_risk,
            state: state,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPaymentDone(true);
        const now = dayjs().toISOString();
        setLastPayment({ amount: predictedPremium, date: now });
        alert("Premium paid and stored successfully!");
      } else {
        alert(data.message || "Failed to store premium");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Server error during payment");
    }
  };

  const daysUntilNext = lastPayment
    ? dayjs(lastPayment.date).add(1, "month").diff(dayjs(), "day")
    : null;

  if (initialLoading) return <p>Loading...</p>;

  return (
    <div className="py-5">
      <Container>
        <h1 className="mb-4">Travel Insurance</h1>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>Travel Details</Card.Header>
              <Card.Body>
                <Form onSubmit={calculatePremium}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      onChange={handleInputChange}
                      placeholder="Enter destination city"
                    />
                  </Form.Group>
                  {/* <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      onChange={handleInputChange}
                    />
                  </Form.Group> */}

                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={travelDetails.start_date}
                      onChange={handleInputChange}
                      min={today} // no past dates
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={travelDetails.end_date}
                      onChange={handleInputChange}
                      min={travelDetails.start_date || today} // ⩾ start_date, or today if none chosen
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Transport Mode</Form.Label>
                    <Form.Select
                      name="transport_mode"
                      onChange={handleInputChange}
                    >
                      <option value="">Select transport mode</option>
                      <option value="air">Flight</option>
                      <option value="train">Train</option>
                      <option value="road">Car/Bus</option>
                    </Form.Select>
                  </Form.Group>
                  {/* <button className="btn btn-primary" onClick={calculatePremium}>
                    Calculate Premium
                  </button> */}
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Calculating..." : "Calculate Premium"}
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
                    <p>Date: {dayjs(lastPayment.date).format("DD MMM YYYY")}</p>
                    <p>Next due in: {daysUntilNext} days</p>
                  </>
                ) : (
                  <p>No previous payments found.</p>
                )}
                {predictedPremium == null ? (
                  <p>Please fill in and calculate your premium.</p>
                ) : (
                  <>
                    <h3>Predicted Premium: ₹{predictedPremium}</h3>
                    <p>city: {travelDetails.city}</p>
                    <p>duration_days: {duration_days}</p>
                    <p>state: {state}</p>
                    <p>crime_index: {crime_index}</p>
                    <p>Aqi: {aqi}</p>
                    <p>rainfall_mm: {rainfall_mm}</p>
                    <p>weather_risk: {weather_risk}</p>
                    <p>transport_mode: {travelDetails.transport_mode}</p>

                    {!paymentDone && (
                      <Button
                        variant="success"
                        className="mt-3"
                        onClick={payPremium}
                      >
                        Pay Premium
                      </Button>
                    )}
                    {paymentDone && (
                      <p className="text-success mt-3">Payment successful!</p>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TravelInsurance;
