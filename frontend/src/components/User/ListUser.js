import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, Table, Button, Spinner } from 'react-bootstrap';


export default function ListUser() {
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please login to see users list.');
                    return;
                }

                const { data } = await axios.get('/api/users/userlist/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Ensure the data is an array before setting state
                if (Array.isArray(data)) {
                    setUserList(data);
                } else {
                    console.error('Data is not an array:', data);
                }
            } catch (err) {
                // Capture and display the error response from the backend
                const errorMessage = err.response?.data?.error || 'Failed to fetch users. Please login and try again.';
                setError(errorMessage);
                console.error('Error during fetching users:', err.response ? err.response.data : err.message);
            }
            finally {
                setLoading(false); 
            }
        }

        fetchUsers();
    }, []);

    async function deleteUser(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/api/users/user/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            // Check response status
            if (response.status === 204) {
                setUserList(userList.filter(user => user.id !== id));
                console.log('User deleted successfully');
            } else {
                console.error('Failed to delete user:', response.data);
            }
        } catch (err) {
            // Capture and display the error response from the backend
            const errorMessage = err.response?.data?.error || 'only organizer can delete user.';
            setError(errorMessage);
            console.error('Error during fetching users:', err.response ? err.response.data : err.message);
        }
    }

    const handleEdit = (id) => {
        // Navigate to the EditUser component with the user ID
        navigate(`/edit-user/${id}`);
    };

    return (
        <div>
            <h2>Users</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : userList.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td>
                                    <Button variant="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
                                    <Button variant="primary" onClick={() => handleEdit(user.id)} className="ms-2">Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
}