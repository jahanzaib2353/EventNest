from base.models import EventAttendance, Event, AttendeeRegistration
from base.serializers import EventAttendanceSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from base.permissions import IsOrganizer

class EventAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
            if request.user.status == 'organizer':
                try:
                    # Get all attendance records for the event
                    attendance = EventAttendance.objects.filter(event__id=event_id)
                    if not attendance.exists():
                        return Response({'error': 'No attendance records found for this event.'}, status=status.HTTP_404_NOT_FOUND)
                    
                    serializer = EventAttendanceSerializer(attendance, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Only organizers can access this resource.'}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request, event_id):
        user = request.user
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            attendee_registration = AttendeeRegistration.objects.get(event=event, attendee=user)
        except AttendeeRegistration.DoesNotExist:
            return Response({'error': 'User not registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create the attendance record
        attendance, created = EventAttendance.objects.get_or_create(
            event=event,
            attendee=attendee_registration,
            defaults={'status': 'absent'}  # Set default status
        )

        # Only update status if it is not already 'present'
        if attendance.status == 'present':
            return Response({'error': 'User already marked as present.'}, status=status.HTTP_400_BAD_REQUEST)

        attendance.status = 'present'
        attendance.check_in_time = timezone.now()
        attendance.save()

        serializer = EventAttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class Attendance(APIView):
#     permission_classes = [IsAuthenticated, IsOrganizer]

#     def get(self, request):
#         attendance = EventAttendance.objects.all()
#         serializer = EventAttendanceSerializer(attendance, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


class AttendenceReport(APIView):
    permission_classes=[IsAuthenticated, IsOrganizer]
    def get(self, request, event_id):  
        try:
            event =Event.objects.get(id=event_id)
            self.check_object_permissions(request, event)   
        except Event.DoesNotExist:
            return Response({'error':"Event not exist"}, status=status.HTTP_404_NOT_FOUND) 
        attendence_records = EventAttendance.objects.filter(event=event)
        data = []
        for record in attendence_records:
            data.append({
                'user': record.user.username,
                'status':record.status,
                'check_in_time':record.check_in_time,
                'check_out_time':record.check_out_time    
            })
        attendee_count = AttendeeRegistration.objects.filter(event=event).count()
        response_data={
            'attendee_count':attendee_count,
            'attendance_records':data
        }

        return Response(response_data, status=status.HTTP_200_OK)