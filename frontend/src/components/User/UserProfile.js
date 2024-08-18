import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please login to view your profile.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('/api/users/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch user profile.');
                console.error('Error fetching profile:', err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUserProfile();
    }, []);

    const handleEditClick = () => {
        if (user && user.id) {
            console.log('Navigating to:', `/edit/${user.id}`);
            navigate(`/edit/${user.id}`);
        } else {
            console.error('User ID is not available');
        }
    };

    return (
        <div className="container my-5 ">
            <h2 className='text-center'>User Profile</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : user ? (
                <>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <th>Username</th>
                                <td>{typeof user.username === 'string' ? user.username : 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{typeof user.email === 'string' ? user.email : 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Organization</th>
                                <td>{typeof user.organization_name === 'string' ? user.organization_name : 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Preferences</th>
                                <td>{typeof user.preferences === 'string' ? user.preferences : 'N/A'}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button onClick={handleEditClick} variant="primary">Edit Profile</Button>
                </>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
}
