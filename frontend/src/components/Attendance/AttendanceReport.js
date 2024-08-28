import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is included


export default function AttendanceReport() {
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [eventId, setEventId] = useState('');
  const [error, setError] = useState('');

  const { id } = useParams(); // Get the event ID from URL parameter

  const handleAttendanceReport = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/attendance/report/${eventId}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Attendance report:', response.data);
      setAttendeeCount(response.data.attendee_count || 0); // Set attendee count
      setAttendanceData(response.data.attendance_records || []); // Set attendance records
      setError(''); // Clear any previous errors
    } catch (err) {
      // Handle different types of errors
      const errorMessage = err.response?.data?.detail || 'Failed to fetch report. Please try again.';
      setError(errorMessage); // Display error message
      setAttendanceData([]); // Clear data on error
      setAttendeeCount(0); // Reset count on error
      console.error('Error during fetching report:', err.response ? err.response.data : err.message);
    }
  };

  // const handleMarkPresent = async (userId) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     await axios.post(`/api/attendance/attendance/${eventId}/`, { user_id: userId }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     // Update the status for the specific user to 'present'
  //     setAttendanceData(prevData => prevData.map(item => item.user_id === userId ? { ...item, status: 'present' } : item));
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.error || 'Failed to mark attendance. Please try again.';
  //     console.error('Error marking present:', errorMessage);
  //     setError(errorMessage); // Display the error message on the UI
  //   }
  // };

  useEffect(() => {
    if (id) {
      setEventId(id);
      handleAttendanceReport({ preventDefault: () => {} }); // Call the report fetch function on load
    }
  }, [id]);

  return (
    <div>
      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className='py-5'>Get Attendance by Event ID</h2>
            <Form onSubmit={handleAttendanceReport}>
              <Form.Group controlId="formEventId">
                <Form.Label>Event Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter eventId"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  required
                />
              </Form.Group>

              <Button className='mt-3' variant="primary" type="submit">
                Submit
              </Button>
            </Form>

            <h3>Attendee Count: {attendeeCount}</h3>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {attendanceData.length > 0 && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Status</th>
                    {/* <th>Mark Present</th> */}
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.user}</td>
                      <td>{item.status}</td>
                      {/* <td>
                        {item.status !== 'present' && (
                          <Button
                            variant="success"
                            onClick={() => handleMarkPresent(item.user_id)}
                          >
                            Mark Present
                          </Button>
                        )}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}