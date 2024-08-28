from django.test import TestCase
from base.serializers import EventUserSerializer
from base.models import EventUser

class EventUserSerializerTests(TestCase):
    
    def setUp(self):
        self.valid_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
            'status': 'attendee',
            'organization_name': 'Test Org',
            'preferences': 'some preferences'
        }
        self.serializer = EventUserSerializer(data=self.valid_data)

        self.invalid_data = {
            'username': 'testuser',
            'email': 'testuser.com',
            'password': 'testpassword',
            'status': 'attendee',
            'organization_name': 'Test Org',
            'preferences': 'some preferences'

        }

        self.invalid_serializer = EventUserSerializer(data = self.invalid_data)
    
    def test_serializer_valid(self):
        is_valid = self.serializer.is_valid()
        print("Serializer is valid:", is_valid)
        print("Validation errors:", self.serializer.errors)
        
        self.assertTrue(is_valid)
        
        data = self.serializer.validated_data
        self.assertEqual(data['username'], self.valid_data['username'])
        self.assertEqual(data['email'], self.valid_data['email'])
        self.assertEqual(data['status'], self.valid_data['status'])
        self.assertEqual(data['organization_name'], self.valid_data['organization_name'])
        self.assertEqual(data['preferences'], self.valid_data['preferences'])
    def test_serializer_invalid_data(self):
        is_valid = self.invalid_serializer.is_valid()
        print("Serializer is invalid", is_valid)
        self.assertFalse(is_valid)


