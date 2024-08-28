import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Createvent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [virtualVenue, setVirtualVenue] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

            console.log('Event Registration successful:', response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'You are not an organizer.';
            setError(errorMessage);
            console.error('Error during creating event:', err.response ? err.response.data : err.message);
        }
        
        navigate('/event-home');
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner py-10">
                <form onSubmit={handleCreate}>
                    <h3 className='py-10'>Create Event</h3>

                    <div className="mb-3">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Virtual Venue</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="https://google.com"
                            value={virtualVenue}
                            onChange={(e) => setVirtualVenue(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Duration</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Organizer</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Organizer ID"
                            value={organizer}
                            onChange={(e) => setOrganizer(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
