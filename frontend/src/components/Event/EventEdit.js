import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
export default function EventEdit() {

    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [virtualVenue, setVirtualVenue] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
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
            console.error('Error fetching event data:', err);
            setError('Failed to fetch event data.');
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
            } else {
                setError('Failed to update event. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    if (loading) return <Spinner animation="border" />;
  return (
    <Container className="mt-3">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2>Edit Event</h2>
                    <Form onSubmit={handleEditEvent}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                            />
                        </Form.Group>

                        <Button className='mt-3' variant="primary" type="submit">
                            Update Event
                        </Button>
                    </Form>

                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Col>
            </Row>
        </Container>
  )
}
