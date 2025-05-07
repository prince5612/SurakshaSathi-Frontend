
// pages/Claims.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import { FaFileUpload, FaClock, FaCheck, FaTimes } from "react-icons/fa";
import dayjs from "dayjs";

function Claims() {
  const [claims, setClaims] = useState([]);
  const [requestedClaims, setRequestedClaims] = useState([]);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const email = localStorage.getItem("userEmail");

  // Fetch active policies
  const fetchActivePolicies = async (email) => {
    setLoadingPolicies(true);
    try {
      const res = await fetch(
        "https://surakshasathi-backend.onrender.com/api/insurance/policies",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const { policies } = await res.json();
      if (res.ok) setClaims(policies);
    } catch (err) {
      console.error("Network error fetching policies:", err);
    } finally {
      setLoadingPolicies(false);
    }
  };

  // Fetch requested claims
  useEffect(() => {
    const fetchClaims = async () => {
      setLoadingRequests(true);
      try {
        const res = await fetch(
          "https://surakshasathi-backend.onrender.com/api/insurance/claims/all",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );
        const data = await res.json();
        if (res.ok) setRequestedClaims(data);
      } catch (err) {
        console.error("Network error fetching claims:", err);
      } finally {
        setLoadingRequests(false);
      }
    };
    if (email) fetchClaims();
  }, [email]);

  useEffect(() => {
    if (email) fetchActivePolicies(email);
  }, [email]);

  const handleClaimRequest = (policy) => {
    setSelectedPolicy(policy);
    setShowClaimForm(true);
  };

  const handleFileUpload = (e) => {
    setUploadedFiles(Array.from(e.target.files));
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData();
    form.append("email", email);
    form.append("policy_type", selectedPolicy.type);
    uploadedFiles.forEach((file) => form.append("documents", file));

    try {
      const res = await fetch(
        "https://surakshasathi-backend.onrender.com/api/insurance/claims",
        { method: "POST", body: form }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      alert(`Claim submitted! ID: ${data.claim_id}`);
      // optionally send ack and refresh
      await fetch(
        "https://surakshasathi-backend.onrender.com/api/notif/claim-ack",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, claim_id: data.claim_id }),
        }
      );
      setShowClaimForm(false);
      fetchActivePolicies(email);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getClaimStatus = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="text-warning">
            <FaClock /> {status}
          </span>
        );
      case "Approved":
        return (
          <span className="text-success">
            <FaCheck /> {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="text-danger">
            <FaTimes /> {status}
          </span>
        );
      default:
        return status;
    }
  };

  // Date helpers
  function calc_due(claim) {
    const lastPaid = dayjs(claim.last_payment_date);
    return { dueDate: lastPaid.add(1, "month").format("YYYY-MM-DD") };
  }
  function get_policy_status(dueDateStr) {
    return dayjs(dueDateStr).isBefore(dayjs(), "day") ? "Expired" : "Active";
  }

  return (
    <div className="py-5">
      <Container>
        <h1 className="mb-4">Claims</h1>

        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>Active Policies</Card.Header>
              <Card.Body>
                {loadingPolicies ? (
                  <Spinner animation="border" />
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Expiry</th>
                        <th>Status</th>
                        <th>Premium</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((policy) => (
                        <tr key={policy._id}>
                          <td>{policy.type}</td>
                          <td>{calc_due(policy).dueDate}</td>
                          <td>{get_policy_status(calc_due(policy).dueDate)}</td>
                          <td>{policy.total_premium}</td>
                          <td>
                            <Button
                              variant="primary"
                              disabled={loadingPolicies}
                              onClick={() => handleClaimRequest(policy)}
                            >
                              {loadingPolicies ? "Loading..." : "Request Claim"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {showClaimForm && (
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>Claim Request Form</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmitClaim}>
                    <Form.Group className="mb-3">
                      <Form.Label>Policy Type</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedPolicy?.type}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Upload Documents</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      className="w-100"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />{" "}
                          Submitting...
                        </>
                      ) : (
                        "Submit Claim"
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <Card>
              <Card.Header>Claim Status</Card.Header>
              <Card.Body>
                {loadingRequests ? (
                  <Spinner animation="border" />
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Request Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestedClaims.map((c, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{c.type}</td>
                          <td>{dayjs(c.request_date).format("YYYY-MM-DD")}</td>
                          <td>{getClaimStatus(c.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Claims;



// // pages/Claims.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
// import { FaFileUpload, FaClock, FaCheck, FaTimes, FaFile } from 'react-icons/fa';
// import dayjs from 'dayjs';

// function Claims() {
//   const [claims, setClaims] = useState([]);
//   const [requestedClaims, setRequestedClaims] = useState([]);
//   const [showClaimForm, setShowClaimForm] = useState(false);
//   const [selectedPolicy, setSelectedPolicy] = useState(null);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [uploadedDocsInfo, setUploadedDocsInfo] = useState([]);

//   const fileInputRef = useRef(null);
//   const email = localStorage.getItem('userEmail');

//   // Fetch active policies
//   useEffect(() => {
//     if (!email) return;
//     fetch('http://localhost:5000/api/insurance/policies', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email }),
//     })
//       .then(res => res.json())
//       .then(data => setClaims(data.policies || []))
//       .catch(console.error);
//   }, [email]);

//   // Load all past claims (with documents)
//   const loadClaims = () => {
//     if (!email) return;
//     fetch('http://localhost:5000/api/insurance/claims/all', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email }),
//     })
//       .then(res => res.json())
//       .then(data => setRequestedClaims(data || []))
//       .catch(console.error);
//   };
//   useEffect(loadClaims, [email]);

//   const handleClaimRequest = policy => {
//     setSelectedPolicy(policy);
//     setShowClaimForm(true);
//     setUploadedFiles([]);
//     setUploadedDocsInfo([]);
//   };

//   const handleFileUpload = e => {
//     setUploadedFiles(Array.from(e.target.files));
//   };

//   const handleSubmitClaim = async e => {
//     e.preventDefault();
//     const form = new FormData();
//     form.append('email', email);
//     form.append('policy_type', selectedPolicy.type);
//     uploadedFiles.forEach(file => form.append('documents', file));

//     try {
//       const res = await fetch('http://localhost:5000/api/insurance/claims', {
//         method: 'POST',
//         body: form
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         alert(data.message || 'Submission failed');
//         return;
//       }
//       alert(`Claim submitted! ID: ${data.claim_id}`);

//       // show returned docs (Cloudinary URLs)
//       setUploadedDocsInfo(data.documents || []);

//       // close form
//       setShowClaimForm(false);

//       // refresh claim list
//       loadClaims();
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     }
//   };

//   const getClaimStatus = status => {
//     if (status === 'Pending') return <span className="text-warning"><FaClock /> {status}</span>;
//     if (status === 'Approved') return <span className="text-success"><FaCheck /> {status}</span>;
//     if (status === 'Rejected') return <span className="text-danger"><FaTimes /> {status}</span>;
//     return status;
//   };

//   const calc_due = claim => {
//     const lastPaid = dayjs(claim.last_payment_date);
//     return { dueDate: lastPaid.add(1, 'month').format('YYYY-MM-DD') };
//   };

//   const get_policy_status = dueDateStr =>
//     dayjs(dueDateStr).isBefore(dayjs(), 'day') ? 'Expired' : 'Active';

//   return (
//     <div className="py-5">
//       <Container>
//         <h1 className="mb-4">Claims</h1>

//         {/* Active Policies */}
//         <Row className="mb-4">
//           <Col>
//             <Card>
//               <Card.Header>Active Policies</Card.Header>
//               <Card.Body>
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Type</th>
//                       <th>Next Due Date</th>
//                       <th>Status</th>
//                       <th>Total Paid Premium</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {claims.map(policy => {
//                       const due = calc_due(policy).dueDate;
//                       return (
//                         <tr key={policy._id}>
//                           <td>{policy.type}</td>
//                           <td>{due}</td>
//                           <td>{get_policy_status(due)}</td>
//                           <td>₹{policy.total_premium}</td>
//                           <td>
//                             <Button variant="primary" onClick={() => handleClaimRequest(policy)}>
//                               Request Claim
//                             </Button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Claim Request Form */}
//         {showClaimForm && (
//           <Row className="mb-4">
//             <Col>
//               <Card>
//                 <Card.Header>Claim Request Form</Card.Header>
//                 <Card.Body>
//                   <Form onSubmit={handleSubmitClaim}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Policy Type</Form.Label>
//                       <Form.Control type="text" value={selectedPolicy.type} readOnly />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Upload Documents</Form.Label>
//                       <Form.Control
//                         type="file"
//                         multiple
//                         ref={fileInputRef}
//                         onChange={handleFileUpload}
//                       />
//                       {uploadedFiles.map(file => (
//                         <div key={file.name} className="badge bg-primary mt-1">
//                           <FaFileUpload /> {file.name}
//                         </div>
//                       ))}
//                     </Form.Group>
//                     <Button type="submit" className="w-100">Submit Claim</Button>
//                   </Form>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}

//         {/* Uploaded Documents Preview */}
//         {uploadedDocsInfo.length > 0 && (
//           <Row className="mb-4">
//             <Col>
//               <Card>
//                 <Card.Header>Uploaded Documents</Card.Header>
//                 <Card.Body>
//                   {uploadedDocsInfo.map(doc => (
//                     <div key={doc.url} className="mb-4">
//                       <strong>{doc.filename}</strong>
//                       <iframe
//                         src={doc.url}
//                         width="100%"
//                         height="400px"
//                         title={doc.filename}
//                         style={{ border: '1px solid #ccc', marginTop: '10px' }}
//                       ></iframe>
//                     </div>
//                   ))}
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}

//         {/* Claim Status Section */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>Claim Status</Card.Header>
//               <Card.Body>
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Type</th>
//                       <th>Request Date</th>
//                       <th>Status</th>
//                       <th>Documents</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {requestedClaims.map((claim, idx) => (
//                       <tr key={claim._id || idx}>
//                         <td>{idx + 1}</td>
//                         <td>{claim.type}</td>
//                         <td>{dayjs(claim.date).format('DD/MM/YYYY')}</td>
//                         <td>{getClaimStatus(claim.status)}</td>
//                         <td>
//                           {claim.documents && claim.documents.length > 0 ? (
//                             claim.documents.map(doc => (
//                               <div key={doc.url} className="mb-2">
//                                 <strong>{doc.filename}</strong>
//                                 <iframe
//                                   src={doc.url}
//                                   width="100%"
//                                   height="200px"
//                                   title={doc.filename}
//                                   style={{ border: '1px solid #ccc', marginTop: '5px' }}
//                                 ></iframe>
//                               </div>
//                             ))
//                           ) : (
//                             <span className="text-muted">No docs</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Claims;
