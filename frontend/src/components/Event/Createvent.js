import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Createvent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [virtualVenue, setVirtualVenue] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [error, setError] = useState('');
    const [organizer, setOrganizer] = useState('')
    const navigate = useNavigate()

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/events/createevent/', {
                title,
                description,
                virtual_venue: virtualVenue, // Match the key used in the backend
                date,
                duration,
                organizer
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Handle successful registration
            console.log('Event Registration successful:', response.data);

            // Optionally, redirect or show success message
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'you are not organizer.';
            setError(errorMessage); // Display error message
            console.error('Error during creating event:', err.response ? err.response.data : err.message);
        }
        
        navigate('/event-home')
    };

  return (
    <div>
      <Container className="mt-3">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2>Create Event</h2>
                    <Form onSubmit={handleCreate}>
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
                        <Form.Group controlId="formOrganizer">
                            <Form.Label>Organizer</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter organizer id"
                                value={organizer}
                                onChange={(e) => setOrganizer(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button className='mt-3' variant="primary" type="submit">
                            Create Event
                        </Button>
                    </Form>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Col>
            </Row>
        </Container>
        

    </div>
  )
}
