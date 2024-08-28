from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from base.models import Event
from base.serializers import EventSerializer
from base.permissions import IsOrganizer
from base.models import Event, AttendeeRegistration

class CreateEvent(APIView):
    permission_classes = [IsAuthenticated, IsOrganizer]

    def post(self, request):
        data = request.data
        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Print validation errors for debugging
            return Response({'error': 'Bad input request', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        
class getEventById(APIView):
    permission_classes = [IsAuthenticated, IsOrganizer]
    def get(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
            serializer = EventSerializer(event)
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


    def put(self, request, event_id):
        user = request.user
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.status == 'organizer' and event.organizer == user:
            data = request.data
            serializer = EventSerializer(event, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"error": "You are not authorized to update this event."}, status=status.HTTP_403_FORBIDDEN)
        
    def delete(self, request, event_id):
        user = request.user
        if user.status == 'organizer':
            try:
                event = Event.objects.get(id=event_id)
                event.delete()
                return Response({'success': "Event deleted successfully"}, status=status.HTTP_200_OK)
            except Event.DoesNotExist:
                return Response({'error': "Event not found"}, status=404)
        else:
            return Response({'error': "You are not authorized to delete this event"}, status=status.HTTP_403_FORBIDDEN)

class getEvents(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        if user.status == 'attendee':
            events = Event.objects.all()
        elif user.status == 'organizer':
            events = Event.objects.filter(organizer=user)
        else:
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UploadFile(APIView):
    permission_classes = [IsAuthenticated, IsOrganizer]
    MAX_FILE_SIZE_MB = 100  # Maximum file size in megabytes
    ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4']  # Add video types if needed

    def put(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        if event.organizer != request.user:
            return Response({"error": "You are not authorized to upload files for this event."}, status=status.HTTP_403_FORBIDDEN)

        file = request.FILES.get('file')
        file_type = request.data.get('file_type')

        if not file:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Check file size
        if file.size > self.MAX_FILE_SIZE_MB * 1024 * 1024:
            return Response({"error": f"File size exceeds {self.MAX_FILE_SIZE_MB} MB."}, status=status.HTTP_400_BAD_REQUEST)

        # Check file type
        if file.content_type not in self.ALLOWED_FILE_TYPES:
            return Response({"error": "Unsupported file type."}, status=status.HTTP_400_BAD_REQUEST)

        # Handle file upload
        event.file = file
        event.file_type = file_type if file_type else event.file_type
        event.save()

        # Get the URL for the uploaded file
        file_url = event.file.url

        # Serialize the event data
        serializer = EventSerializer(event)
        data = serializer.data
        data['file_url'] = file_url  # Include file URL in the response

        return Response(data, status=status.HTTP_200_OK)
    

class EventAnalyticsView(APIView):
    permission_classes = [IsAuthenticated,  IsOrganizer]

    def get(self, request):
        events = Event.objects.all()
        analytics_data = []

        for event in events:
            attendee_count = AttendeeRegistration.objects.filter(event=event).count()
            analytics_data.append({
                'id': event.id,
                'title': event.title,
                'attendees': attendee_count,
            })

        # Debugging: Log analytics data to ensure it's correct
        print('Analytics Data:', analytics_data)

        return Response(analytics_data, status=status.HTTP_200_OK)