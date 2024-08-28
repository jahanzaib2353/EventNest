from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from base.models import EventUser, Event
from django.utils import timezone
from datetime import timedelta

class EventViewsTest(TestCase):

    def setUp(self):
        self.client = Client()
        # Create test users
        self.organizer = EventUser.objects.create_user(username='testuser', password='testuser', status='organizer')
        self.attendee = EventUser.objects.create_user(username='abc', password='abc', status='attendee')
        #you have to pass only one user, attendee or organizer
    def login_as(self, username, password):
        response = self.client.post('/api/users/login/', {
            'username': username,
            'password': password
        }, format='json')
        self.token = response.data['access']
        # Set the token in the client headers
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.token}'

        # Create an event
        self.event1 = Event.objects.create(
            id = 5,
            title='First Test Event',
            date=timezone.now(),
            duration=timedelta(hours=2),
            virtual_venue='http://example.com',
            organizer=self.organizer
        )
        self.event2 = Event.objects.create(
        id = 6,
        title='New Test Event',
        date=timezone.now(),
        duration=timedelta(hours=2),
        virtual_venue='http://example.com',
        organizer=self.organizer
    )
        self.event3 = Event.objects.create(
        id = 7,
        title='python Event',
        date=timezone.now(),
        duration=timedelta(hours=2),
        virtual_venue='http://example.com',
        organizer=self.organizer
    )

        # Define the URL for fetching event list
        self.list_url = reverse('event')  # Update with your actual URL name
        self.event_by_id_url = reverse('update-delete-event', args=[self.event1.id])
      
    def test_event_list_GET(self):
        self.login_as('abc', 'abc')
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        events = response.data
        self.assertEqual(len(events), 3)  # Ensure 3 events are returned
        self.assertEqual(events[0]['title'], 'First Test Event')
        self.assertEqual(events[1]['title'], 'New Test Event')
        self.assertEqual(events[2]['title'], 'python Event')

    def test_get_events_attendee(self):
        self.login_as('abc', 'abc')  # Log in as attendee
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        events = response.data
        self.assertEqual(len(events), 3)  # Ensure all events are returned
        self.assertEqual(events[0]['title'], 'First Test Event')
        self.assertEqual(events[1]['title'], 'New Test Event')
        self.assertEqual(events[2]['title'], 'python Event')

    def test_get_events_organizer(self):
        self.login_as('testuser', 'testuser')  # Log in as organizer
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        events = response.data
        self.assertEqual(len(events), 3)  # Ensure only organizer's events are returned
        self.assertEqual(events[0]['title'], 'First Test Event')
        self.assertEqual(events[1]['title'], 'New Test Event')
        self.assertEqual(events[2]['title'], 'python Event')

    

    def test_event_by_id_unauthorized_GET(self):
        self.login_as('abc', 'abc')
        self.event_id = 7
        response = self.client.get(self.event_by_id_url)
        self.assertEqual(response.status_code, 403)


    def test_event_by_id_GET(self):
        self.login_as('testuser', 'testuser')
        response = self.client.get(self.event_by_id_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('title', response.data)  # Ensure event details are returned with title field
        self.assertEqual(response.data['title'], 'First Test Event')



    def test_event_update_PUT(self):
        self.login_as('testuser', 'testuser')
        response = self.client.put(self.event_by_id_url, {
        'title': 'New Test Event',
        'date': timezone.now().isoformat(),
        'duration': '02:00:00',
        'virtual_venue': 'http://updated.com',
    }, format='json')
        if(response.status_code==200):
            self.assertEqual(response.data['title'], 'Updated Test Event Title')

    def test_event_update_unauthorized_PUT(self):
        self.login_as('abc', 'abc')
        response = self.client.put(self.event_by_id_url, {
        'title': 'New Test Event',
        'date': timezone.now().isoformat(),
        'duration': '02:00:00',
        'virtual_venue': 'http://updated.com',
    }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_event_update_with_wrong_data_PUT(self):
        self.login_as('testuser', 'testuser')
        response = self.client.put(self.event_by_id_url, {
        'title': 'New Test Event',
        'date': timezone.now().isoformat(),
        'duration': '02:00:00z',
        'virtual_venue': 'updated.com',
    }, format='json', content_type='applicatio/json')
        self.assertEqual(response.status_code, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
        

    #cant delete if event not found
    def test_event_delete_with_status_not_organizer(self):
        self.login_as('testuser', 'testuser')
        self.delete_event_id = 78
        self.url_with_id = reverse('update-delete-event', args=[self.delete_event_id])
        response = self.client.delete(self.url_with_id)
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)



    def test_event_DELETE(self):
        self.login_as('testuser', 'testuser')
        delete_event_id = 6  # Use an ID that does not exist in the database
        self.url_with_id = reverse('update-delete-event', args=[delete_event_id])
        response = self.client.delete(self.url_with_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'success': "Event deleted successfully"})
        
    #cant delete if you are not organizer
    def test_event_delete_with_status_not_organizer(self):
        self.login_as('abc', 'abc')
        self.delete_event_id = 6
        self.url_with_id = reverse('update-delete-event', args=[self.delete_event_id])
        response = self.client.delete(self.url_with_id)
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_event_by_id_not_found(self):
        self.login_as('testuser', 'testuser')
        invalid_event_id = 300  # Use an ID that does not exist in the database
        url_with_invalid_id = reverse('update-delete-event', args=[invalid_event_id])
        
        response = self.client.get(url_with_invalid_id)

        # Check if the response status code is 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error": "Event not found."})


class CreateEventTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.organizer = EventUser.objects.create_user(
            id=40, username='test', password='test', status='organizer')
        self.attendee = EventUser.objects.create_user(
            id= 100, username='testattendee', password='testattendee', status='attendee'
        )
        
    def login_as(self, username, password):
        response = self.client.post('/api/users/login/', {
            'username': username,
            'password': password
        }, format='json')
        self.token = response.data['access']

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.token}'

        self.event_create_url = reverse('create-event')  # Ensure this is correct

        self.event_analytics_url = reverse('event-analytics')

    def test_create_event_POST(self):
        self.login_as('test', 'test')
        response = self.client.post(self.event_create_url, {
            'title': 'AI and robotics',
            'description': 'new era of robots and AI',
            'duration': '02:00:00',
            'date': '2024-07-20T10:00:00Z',
            'virtual_venue': 'http://googlemeet.com',
            'organizer':40
        }, format='json')        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'AI and robotics')
        # Ensure organizer field is correctly set
        event = Event.objects.get(id=response.data['id'])
        self.assertEqual(event.organizer, self.organizer)


    def test_wrong_input_fields_failed_POST(self):
        self.login_as('test', 'test')
        response = self.client.post(self.event_create_url, {
            'title': 'AI and robotics',
            'description': 'new era of robots and AI',
            'duration': '02:00:00',
            'date': '2024-07-:00Z', #wrong date format
            'virtual_venue': 'googlemeet.com', #passing wrong link
            'organizer':40
        }, format='json')  
        print(response.status_code)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        #here if we will login with the attendeee user than our test will be passed
    def test_unauthorized_user_request_POST(self):
        self.login_as('testattendee', 'testattendee')
        response = self.client.post(self.event_create_url, {
            'title': 'AI and robotics',
            'description': 'new era of robots and AI',
            'duration': '02:00:00',
            'date': '2024-07-20T10:00:00Z',
            'virtual_venue': 'http://googlemeet.com',
            'organizer': 100
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {"detail": "You do not have permission to perform this action."})



    def test_event_analytics_GET(self):
        self.login_as('testattendee', 'testattendee')
        response = self.client.get(self.event_analytics_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_event_analytics_unauthorized(self):
        self.event_analytics_url = reverse('event-analytics')
        response = self.client.get(self.event_analytics_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    

    def test_upload_file_PUT(self):
        pass