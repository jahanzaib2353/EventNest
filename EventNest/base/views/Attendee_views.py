from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from base.models import Event, AttendeeRegistration, EventAttendance
from base.serializers import AttendeeRegistrationSerializer, EventSerializer
from base.permissions import IsAttendee


class register_attendee(APIView):
    permission_classes = [IsAuthenticated, IsAttendee]
    def post(self, request, event_id):
            if request.user.status != 'attendee':
                return Response({'error': 'Only attendees can register.'}, status=status.HTTP_403_FORBIDDEN)
            
            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            if AttendeeRegistration.objects.filter(event=event, attendee=request.user).exists():
                return Response({'error': 'User already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)
            
            attendee_registration = AttendeeRegistration.objects.create(event=event, attendee=request.user)

            # Create an EventAttendance record for this new registration
            EventAttendance.objects.get_or_create(
                event=event,
                user=request.user,  # Ensure the 'user' field is correctly provided
                attendee=attendee_registration,
                defaults={
                    'status': 'absent',
                    'check_in_time': None,
                    'check_out_time': None
                }
            )

            serializer = AttendeeRegistrationSerializer(attendee_registration)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class DeleteAttendee(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, event_id):
        attendee = AttendeeRegistration.objects.get(id=event_id)
        attendee.delete()
        return Response({'success': "deleted successfully"})




# class getAttendeeList(APIView):
#     def get(self, request):
#         attendees = AttendeeRegistration.objects.all()
#         serializer = AttendeeRegistrationSerializer(attendees, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)