import React from 'react'
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
export default function EventHome() {
  return (
    <div>
     <h2 className='text-center'>Create and manage Events here</h2>

      <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <h2>
              <Link to="/create-event" className="btn btn-light">
                Create Event
              </Link>
            </h2>
          
          
            <h2>
              <Link to="/eventlist" className="btn btn-light">
                Get Event List
              </Link>
            </h2>
            </Col>
        </Row>
    </div>
  )
}
