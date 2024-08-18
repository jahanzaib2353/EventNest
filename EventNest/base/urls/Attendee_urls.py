from base.views import Attendee_views  
from django.urls import path


urlpatterns = [
    # path('attendee/', Attendee_views.getAttendeeList.as_view(), name='attendee-list'),
    path('register/<int:event_id>/', Attendee_views.register_attendee.as_view(), name='attendee'),
    path('delete-attendee/<str:event_id>/', Attendee_views.DeleteAttendee.as_view(), name='delete-attendee'),

]