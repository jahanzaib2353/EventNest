import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, BarChart, XAxis, YAxis, Legend, CartesianGrid, Bar } from "recharts";

export default function Analytics() {


    const [eventData, setEventData] = useState([]);
    const [error, setError] = useState('');
  
    // Fetch event data from backend
    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/events/analytics/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setEventData(response.data || []);
        setError(''); // Clear any previous errors
      } catch (err) {
        const errorMessage = err.response?.data?.detail || 'Failed to fetch event data.';
        setError(errorMessage); // Display error message
        setEventData([]); // Clear data on error
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
  
        <div className="App">
          {/* Pie Chart */}
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
  
          {/* Bar Chart */}
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
            <Bar dataKey="attendees" fill="#8884d8" background={{ fill: "#eee" }} />
          </BarChart>
        </div>
      </div>
  )
}
