import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

export default function RegisterAttendee() {
    const [eventId, setEventId] = useState('');
    const [error, setError] = useState('');

    const {id} = useParams()
    const fetchEvent = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/events/event/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const event = response.data;
            return event
            
        } catch (err) {
            console.error('Error fetching event data:', err);
            setError('Failed to fetch event data.');
        } 
    };

    useEffect(() => {
        if (id) {
            fetchEvent(id);
        }
    }, [id]);

    const handleRegisterAttendee = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/attendees/register/${eventId}/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Registration successful:', response.data);
        } catch (err) {
            // Capture and display the error response from the backend
            const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Error during registration:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div>
            <p>Are you logged in as an attendee to register in an event?</p>
            <p>
                <b className='mt-3'>Or...</b> 
                <Link to="/login">
                    <Button variant="link">Login</Button>
                </Link>
            </p>

            <Container className="mt-3">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2>Registration Form</h2>
                        <Form onSubmit={handleRegisterAttendee}>
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

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
