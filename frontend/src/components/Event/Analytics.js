import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, BarChart, XAxis, YAxis, Legend, CartesianGrid, Bar } from "recharts";

export default function Analytics() {
    const [eventData, setEventData] = useState([]);
    const [error, setError] = useState('');

    const fetchEventData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/events/analytics/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            setEventData(response.data);
            setError('');
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to fetch event data.';
            setError(errorMessage);
            setEventData([]);
            console.error('Error fetching event data:', err.response ? err.response.data : err.message);
        }
    };

    useEffect(() => {
        fetchEventData();
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Event Analytics</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {eventData.length === 0 && !error && <p>No data available</p>}

            <div className="charts-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {eventData.length > 0 ? (
                    <>
                        {/* Pie Chart */}
                        <div style={{ marginRight: '20px' }}>
                            <PieChart width={400} height={400}>
                                <Pie
                                    dataKey="attendees"
                                    isAnimationActive={false}
                                    data={eventData}
                                    cx={200}
                                    cy={200}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                />
                                <Tooltip />
                            </PieChart>
                        </div>

                        {/* Bar Chart */}
                        <div>
                            <BarChart
                                width={500}
                                height={300}
                                data={eventData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 80,
                                    bottom: 5,
                                }}
                                barSize={20}
                            >
                                <XAxis
                                    dataKey="title"
                                    scale="point"
                                    padding={{ left: 10, right: 10 }}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="attendees" fill="#8884d8" background={{ fill: "#eee" }} key={(item, index) => index} />
                            </BarChart>
                        </div>
                    </>
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </div>
    );
}
