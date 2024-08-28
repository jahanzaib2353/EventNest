import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

export default function EventEdit() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [virtualVenue, setVirtualVenue] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            if (event) {
                setTitle(event.title || '');
                setDescription(event.description || '');
                setVirtualVenue(event.virtual_venue || '');
                setDate(event.date || '');
                setDuration(event.duration || '');
            } else {
                setError('No event data received.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'An unexpected error occurred.';
            setError(errorMessage);
            console.error('Error during fetching event:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchEvent(id);
        }
    }, [id]);

    const handleEditEvent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to update events.');
                return;
            }

            const response = await axios.put(`/api/events/event/${id}/`, {
                title,
                description,
                virtual_venue: virtualVenue,
                duration,
                date
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert('Event updated successfully.');
                navigate('/event-home');  // Redirect to event-home after successful update
            } else {
                setError('Failed to update event. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={12}>
                    <div className="login-form-bg h-100">
                        <div className="container h-100">
                            <div className="row justify-content-center h-100">
                                <div className="col-lg-6 login-form">
                                    <h2 className="text-center">Edit Event</h2>
                                    <Form onSubmit={handleEditEvent}>
                                        <Form.Group controlId="formTitle">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                                className="input-custom"
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDescription">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter Description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="input-custom"
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formVirtualVenue">
                                            <Form.Label>Virtual Venue</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="https://google.com"
                                                value={virtualVenue}
                                                onChange={(e) => setVirtualVenue(e.target.value)}
                                                required
                                                className="input-custom"
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDate">
                                            <Form.Label>Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter Date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                                className="input-custom"
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDuration">
                                            <Form.Label>Duration</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Duration"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                required
                                                className="input-custom"
                                            />
                                        </Form.Group>

                                        <Button className='mt-3 w-100' variant="primary" type="submit">
                                            Update Event
                                        </Button>
                                    </Form>

                                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
