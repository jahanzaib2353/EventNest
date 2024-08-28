import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Container } from 'react-bootstrap';

export default function EventHome() {
  return (
    <div className="event-home-page">
      <Container className="mt-5">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/hero-img-1.png"  // Same image as in Home component
              alt="First slide"
            />
            <Carousel.Caption className="carousel-caption-custom">
              <h3>Create Your Event</h3>
              <p>
                Organize your next big event and start gathering your audience.
              </p>
              <Link to="/create-event">
                <button className="btn btn-primary btn-lg">Create Event</button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/hero-img-1.png"  // Same image as in Home component
              alt="Second slide"
            />
            <Carousel.Caption className="carousel-caption-custom">
              <h3>View Event List</h3>
              <p>
                Browse through the list of events to find what interests you.
              </p>
              <Link to="/eventlist">
                <button className="btn btn-secondary btn-lg">View Event List</button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
    </div>
  );
}
