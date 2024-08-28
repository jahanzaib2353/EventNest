import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

export default function RegisterAttendee() {
    const [eventId, setEventId] = useState('');
    const [error, setError] = useState('');

    const { id } = useParams();

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
            return event;
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
            const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Error during registration:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="register-attendee-page">
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-lg border-0 rounded-lg">
                            <Card.Body className="p-5">
                                <h2 className="text-center text-uppercase mb-4">Register for Event</h2>
                                <Form onSubmit={handleRegisterAttendee}>
                                    <Form.Group controlId="formEventId" className="mb-4">
                                        <Form.Label>Event ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Event ID"
                                            value={eventId}
                                            onChange={(e) => setEventId(e.target.value)}
                                            required
                                            className="p-3 rounded-pill"
                                        />
                                    </Form.Group>

                                    <Button
                                        className="btn-lg btn-block btn-gradient"
                                        variant="primary"
                                        type="submit"
                                    >
                                        Register
                                    </Button>
                                </Form>

                                {error && <p className="mt-3 text-danger text-center">{error}</p>}
                            </Card.Body>
                        </Card>
                        <div className="text-center mt-4">
                            <p>
                                Are you logged in as an attendee to register for an event?
                            </p>
                            <p>
                                <b>Or...</b>{' '}
                                <Link to="/login">
                                    <Button variant="link" className="login-link">
                                        Login
                                    </Button>
                                </Link>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
