
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableSortLabel,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterContainer: {
    marginBottom: '20px',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid rgba(0,0,0,0.1)',
  },
  td: {
    padding: '12px',
    border: '1px solid rgba(0,0,0,0.05)',
    verticalAlign: 'top',
  },
  button: {
    margin: '2px',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  noDocuments: {
    color: '#888',
  },
  documentsList: {
    maxHeight: '200px',
    overflowY: 'auto',
    margin: '-12px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  documentItem: {
    marginBottom: '10px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  approved: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  rejected: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  documentModal: {
    width: '90vw',
    height: '90vh',
    maxWidth: '1200px',
    maxHeight: '90vh',
  },
}));

const STATUS_OPTIONS = {
  Pending: ['Approved', 'Rejected'],
  Approved: ['Rejected'],
  Rejected: ['Approved'],
};

const FILTER_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected'];

function AdminDashboard() {
  const classes = useStyles();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No authentication token found!');
          return;
        }

        const claimRes = await axios.get('https://surakshasathi-backend.onrender.com/api/admin/claims', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const claimsWithUsers = await Promise.all(
          claimRes.data.claims.map(async (claim) => {
            try {
              const userRes = await axios.get(
                `https://surakshasathi-backend.onrender.com/api/admin/users/email/${claim.user_email}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return {
                ...claim,
                user: userRes.data,
              };
            } catch (userError) {
              console.error(`Error fetching user for ${claim.user_email}:`, userError);
              return claim;
            }
          })
        );

        setClaims(claimsWithUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found!');
        return;
      }

      await axios.put(
        `https://surakshasathi-backend.onrender.com/api/admin/claims/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClaims((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredClaims = React.useMemo(() => {
    if (filter === 'All') return claims;
    return claims.filter((claim) => claim.status === filter);
  }, [filter, claims]);

  const searchedClaims = React.useMemo(() => {
    return filteredClaims.filter((claim) =>
      Object.values(claim).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [filteredClaims, searchQuery]);

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setIsDocumentModalOpen(true);
  };

  const closeDocumentModal = () => {
    setSelectedDocument(null);
    setIsDocumentModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h1">Admin Dashboard</Typography>
        {/* <Button variant="contained" color="primary">
          New Claim
        </Button> */}
      </div>

      <Toolbar className={classes.filterContainer}>
        <TextField
          fullWidth
          label="Search claims..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small">
                  <Search />
                </SvgIcon>
              </InputAdornment>
            ),
          }}
        />
        <Select
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {FILTER_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Toolbar>

      <div className={classes.tableContainer}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.th}>User Email</TableCell>
                <TableCell className={classes.th}>Name</TableCell>
                <TableCell className={classes.th}>Claim Type</TableCell>
                <TableCell className={classes.th}>Status</TableCell>
                <TableCell className={classes.th}>Documents</TableCell>
                <TableCell className={classes.th}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedClaims.map((claim) => (
                <TableRow key={claim._id}>
                  <TableCell>{claim.user_email}</TableCell>
                  <TableCell>
                    {claim.user ? claim.user.name : 'Unknown User'}
                  </TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>
                    <span
                      className={`${classes.statusBadge} ${
                        classes[claim.status.toLowerCase()]
                      }`}
                    >
                      {claim.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {claim.documents?.length > 0 ? (
                      <div className={classes.documentsList}>
                        {claim.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className={classes.documentItem}
                            onClick={() => handleDocumentClick(doc)}
                          >
                            <strong>{doc.filename}</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className={classes.noDocuments}>No Documents</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {STATUS_OPTIONS[claim.status]?.map((option) => (
                      <Button
                        key={option}
                        onClick={() => updateStatus(claim._id, option)}
                        className={classes.button}
                        size="small"
                      >
                        {option}
                      </Button>
                    )) || 'No Action'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Document Viewer Modal */}
      <Dialog
        open={isDocumentModalOpen}
        onClose={closeDocumentModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedDocument?.filename}
          <DialogActions>
            <Button onClick={closeDocumentModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </DialogTitle>
        <DialogContent className={classes.documentModal}>
          {selectedDocument && (
            <iframe
              src={selectedDocument.url}
              width="100%"
              height="100%"
              title={selectedDocument.filename}
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;
