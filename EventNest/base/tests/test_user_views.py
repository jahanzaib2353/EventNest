from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from base.models import EventUser

class UserViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.create_user_url = reverse('register-event-user')
        self.login_user_url = reverse('token_obtain_pair')
        self.user_profile_url = reverse('event-user-profile')

        self.organizer = EventUser.objects.create_user(username='testuser1', password='testuser1', status='organizer')
        self.attendee1 = EventUser.objects.create_user(username='dummy1', password='dummy1', status='attendee')
        self.attendee2 = EventUser.objects.create_user(username='dummy2', password='dummy2', status='attendee')
        self.attendee3 = EventUser.objects.create_user(username='dummy3', password='dummy3', status='attendee')

    def login_as(self, username, password):
        response = self.client.post(self.login_user_url, {
            'username': username,
            'password': password
        }, format='json')
        self.token = response.data['access']
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.token}'

    def test_register_user_POST(self):
        response = self.client.post(self.create_user_url, {
            "username": "test1",
            "email": "test1@example.com",
            "organization": "CG",
            "status": "attendee",
            "password": "test1"
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    def test_register_user_invalid_POST(self):
        response = self.client.post(self.create_user_url,{
            "username": "test1",
            "email": "test1@example.com",
            "organization": "CG",
            "status": "manager",
            "password": ""

        },format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_login_user_POST(self):
        response = self.client.post(self.login_user_url, {
            'username': 'testuser1',
            'password': 'testuser1'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user_not_found(self):
        response = self.client.post(self.login_user_url, {
            'username': 'testuser50',
            'password': 'testuser50'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_by_id_GET(self):
        self.login_as('testuser1', 'testuser1')
        user_id = self.attendee1.id
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.get(user_by_id_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'dummy1')

    def test_get_user_by_id_not_found_GET(self):
        self.login_as('testuser1', 'testuser1')
        user_id = 444
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.get(user_by_id_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_edit_PUT(self):
        self.login_as('dummy1', 'dummy1')
        user_id = self.attendee1.id
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.put(user_by_id_url, {
            'username': 'editeddummy',
        }, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'User updated successfully'})

    def test_user_edit_PUT(self):
        self.login_as('dummy1', 'dummy1')
        user_id = self.attendee1.id
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.put(user_by_id_url, {
            'username': 'edited @ dummy',
        }, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_edit_by_unauthorized_user_PUT(self):
        self.login_as('dummy1', 'dummy1')
        user_id = self.attendee2.id
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.put(user_by_id_url, {
            'username': 'dummyupdate'
        }, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {'error': 'You are not authorized to edit this profile'})

    def test_user_edit_by_not_found_user(self):
        self.login_as('dummy2', 'dummy2')
        user_id = 8
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.put(user_by_id_url, {
            'username': 'newdummy',
            'password': 'newdummy'
        }, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'User not found'})

    def test_user_delete_by_organizer_DELETE(self):
        self.login_as('testuser1', 'testuser1')
        user_id = self.attendee3.id
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.delete(user_by_id_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data, {'message': 'User deleted successfully'})

    def test_user_delete_by_unauthorized_user_DELETE(self):
        self.login_as('dummy1', 'dummy1')
        user_id = self.attendee3.id
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.delete(user_by_id_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {'error': 'Permission denied. Only organizers can delete users.'})

    def test_user_delete_user_not_found_DELETE(self):
        self.login_as('testuser1', 'testuser1')
        user_id = 999
        user_by_id_url = reverse('event-user-by-id', args=[user_id])

        response = self.client.delete(user_by_id_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'User not found'})

    def test_user_profile_GET(self):
        self.login_as('dummy2', 'dummy2')
        response = self.client.get(self.user_profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_profile_not_logged_in_GET(self):
        response = self.client.get(self.user_profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
