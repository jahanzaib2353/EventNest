from base.views import Events_views  
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
        path('createevent/', Events_views.CreateEvent.as_view(), name='create-event'),
        path('event/<int:event_id>/', Events_views.getEventById.as_view(), name='update-delete-event'),
        path('eventList/', Events_views.getEvents.as_view(), name='event'),
        path('analytics/', Events_views.EventAnalyticsView.as_view(), name='event-analytics'),

        path('uploadfile/<str:event_id>/', Events_views.UploadFile.as_view(), name='upload-file'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)