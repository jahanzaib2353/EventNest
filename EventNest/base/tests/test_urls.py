from django.test import SimpleTestCase
from django.urls import reverse, resolve
from base.views.Events_views import *


class URLTests(SimpleTestCase):

    def test_event_list_url(self):
        url = reverse('event')
        self.assertEqual(resolve(url).func.view_class, getEvents)
    
    def test_create_event_url(self):
        url = reverse('create-event')
        self.assertEqual(resolve(url).func.view_class, CreateEvent)

    def test_get_event_by_id_url(self):
        url = reverse('update-delete-event', args=[5])
        self.assertEqual(resolve(url).func.view_class, getEventById)
        