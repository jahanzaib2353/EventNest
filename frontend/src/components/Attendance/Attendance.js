import {  useNavigate } from 'react-router-dom';
export default function Attendance() {
    const navigate = useNavigate()
    // const [attendanceData, setAttendanceData] = useState([]); // Initialize as an empty array
    // const handleAttendance = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get('api/attendance/attendance/', {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         const data = response.data;
    //         if (Array.isArray(data)) { // Check if the response is an array
    //             setAttendanceData(data);
    //         } else {
    //             console.error('Data is not an array');
    //             setError('Data is not in the expected format.');
    //         }
    //     } catch (err) {
    //         const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
    //         setError(errorMessage);
    //         console.error('Error during fetching:', err.response ? err.response.data : err.message);
    //     }
    // };

    
  
    const handleRedirectToReport = ()=>{
        navigate('/report')
    }
    return (
        <div>
            {/* <button onClick={handleAttendance}>Fetch Attendance</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {attendanceData.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Event</th>
                            <th>Attendee</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.user}</td>
                                <td>{item.event}</td>
                                <td>{item.attendee}</td>
                                <td>{item.status}</td>
                               
                            </tr>
                        ))}
                    </tbody>
                </table>


            )} */}

        <button onClick={handleRedirectToReport}>Get Attendance Report</button> {/* Added button */}

        </div>
    );
}
