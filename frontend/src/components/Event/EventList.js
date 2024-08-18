import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function EventList() {
    const [eventList, setEventList] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const navigate = useNavigate();

    // Function to fetch event list
    async function fetchEventList() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to view events.');
                setLoading(false);
                return;
            }

            const { data } = await axios.get('/api/events/eventList/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (Array.isArray(data)) {
                setEventList(data);
            } else {
                console.error('Data is not an array:', data);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch events. Please try again.';
            setError(errorMessage);
            console.error('Error during fetching events:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEventList(); // Fetch event list when component mounts
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const deleteEvent = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to delete events.');
                return;
            }
            const response = await axios.delete(`/api/events/event/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 204) {
                setEventList(eventList.filter(event => event.id !== id));
                setSuccess('Event deleted successfully');
            } else {
                setError('Failed to delete event. Please try again.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
            setError(errorMessage);
            console.error('Error during deleting event:', err.response ? err.response.data : err.message);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleFileUpload = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to upload files.');
                return;
            }

            if (!selectedFile) {
                setError('No file selected.');
                return;
            }

            // Check file size
            if (selectedFile.size > 100 * 1024 * 1024) { // 100 MB
                setError('File size exceeds 100 MB.');
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Unsupported file type. Please upload an image, PDF, or video.');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('file_type', selectedFile.type);

            const response = await axios.put(`/api/events/uploadfile/${eventId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setSuccess('File uploaded successfully!');
                // Refresh the event list to get the updated file URL
                await fetchEventList();  // Fetch updated event list
                setSelectedFile(null);
                setSelectedEventId(null); // Clear selected event ID after upload
            } else {
                setError('Failed to upload file. Please try again.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'File upload failed. Please try again.';
            setError(errorMessage);
            console.error('Error during file upload:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div>
            <h2>Events</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    {eventList.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Virtual Venue</th>
                                    <th>Date</th>
                                    <th>Duration</th>
                                    <th>File</th> {/* Added File column */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventList.map(event => (
                                    <tr key={event.id}>
                                        <td>{event.id}</td>
                                        <td>{event.title}</td>
                                        <td>{event.description}</td>
                                        <td>{event.virtual_venue}</td>
                                        <td>{event.date}</td>
                                        <td>{event.duration}</td>
                                        <td>
                                            {event.file_url ? (
                                                <img
                                                    src={event.file_url}
                                                    alt="Uploaded"
                                                    style={{ width: '100px', height: 'auto' }}
                                                />
                                            ) : (
                                                <span>No file uploaded</span>
                                            )}
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => deleteEvent(event.id)}>Delete</Button>
                                            <Button variant="primary" onClick={() => handleEdit(event.id)} className="mx-2">Edit</Button>

                                            <Form>
                                                <Form.Group controlId={`formFile-${event.id}`}>
                                                    <Form.Label>Select file</Form.Label>
                                                    <Form.Control 
                                                        type="file" 
                                                        onChange={(e) => {
                                                            setSelectedEventId(event.id);
                                                            handleFileChange(e);
                                                        }} 
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Max size: 100 MB. Supported types: images, PDFs, videos.
                                                    </Form.Text>
                                                </Form.Group>
                                                <Button 
                                                    variant="primary" 
                                                    onClick={() => handleFileUpload(event.id)}
                                                    disabled={!selectedFile || selectedEventId !== event.id}
                                                >
                                                    Upload
                                                </Button>
                                            </Form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No events found.</p>
                    )}
                    <Link to={'/register-attendee'}><Button variant='primary'>Register Attendee</Button></Link>

                    <br />
                    <Link to={'/report'}><Button variant='light' className='my-3'>Attendance</Button></Link>
                </>
            )}
        </div>
    );
}
