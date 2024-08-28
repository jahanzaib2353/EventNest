from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from base.models import Event, EventAttendance, EventUser, AttendeeRegistration
from django.utils import timezone
from datetime import datetime
from datetime import timedelta



class EventAttendanceViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.organizer = EventUser.objects.create_user(username='organizer', password='password', status='organizer')
        self.attendee = EventUser.objects.create_user(username='attendee', password='password', status='attendee')
        self.attendee2 = EventUser.objects.create_user(username='attendee2', password='password', status='attendee')
        self.event3 = Event.objects.create(
        id = 7,
        title='python Event',
        date=timezone.now(),
        duration=timedelta(hours=2),
        virtual_venue='http://example.com',
        organizer=self.organizer
        )

        self.event4 = Event.objects.create(
        id = 8,
        title='New Event',
        date=timezone.now(),
        duration=timedelta(hours=3),
        virtual_venue='http://example.com',
        organizer=self.organizer
        )

    def login_as(self, username, password):
        response = self.client.post('/api/users/login/', {
            'username': username,
            'password': password
        }, format='json')
        self.token = response.data['access']
        # Set the token in the client headers
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.token}'
    
    
        self.attendee_registration = AttendeeRegistration.objects.create(event=self.event3, attendee=self.attendee)

        self.attendance_url = reverse('event-attendance', kwargs={'event_id': self.event3.id})

    def test_get_attendance_records_GET(self):
        # Login as organizer
        self.login_as(username='organizer', password='password')
        # Create an attendance record
        EventAttendance.objects.create(event=self.event3, user=self.attendee, attendee=self.attendee_registration, status='present', check_in_time=timezone.now())

        response = self.client.get(self.attendance_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.data)
        self.assertEqual(len(response.data), 1)  # Expecting one attendance record


    def test_get_attendance_no_records(self):
#         # Login as organizer
        self.login_as(username='organizer', password='password')
        self.event_id = 8
        response = self.client.get(self.attendance_url, args=[self.event_id])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_attendance_by_unauthorized_user_GET(self):
        self.login_as('attendee', 'password')
        self.event_id = 8
        response = self.client.get(self.attendance_url, args=[self.event_id])
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)



    def test_post_event_does_not_exist(self):
        self.login_as(username='organizer', password='password')
        non_existent_event_id = 999  # ID that does not exist

        response = self.client.post(reverse('event-attendance', kwargs={'event_id': non_existent_event_id}))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Event not found.')


    def test_post_user_not_registered_for_event(self):
        self.login_as(username='attendee', password='password')
        event_id = self.event3.id  # Use an event that exists
        response = self.client.post(reverse('event-attendance', kwargs={'event_id': event_id}))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


def test_create_attendance_record_POST(self):
        self.login_as(username='organizer', password='password')
        response = self.client.post(self.attendance_url)
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        attendance_record = EventAttendance.objects.filter(event=self.event4, attendee=self.attendee_registration).first()
        self.assertIsNotNone(attendance_record)
        self.assertEqual(attendance_record.status, 'present')
        self.assertIsNotNone(attendance_record.check_in_time)
