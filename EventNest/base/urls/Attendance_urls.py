from base.views import Attendance_views 
from base.views.Attendance_views import *
from django.urls import path

urlpatterns = [



    path('attendance/<int:event_id>/', EventAttendanceView.as_view(), name='event-attendance'),
    path('report/<int:event_id>/', AttendenceReport.as_view(), name='attendance-report'),
    # path('attendance', Attendance.as_view(), name='event-attendance'),

    # # path('attendance/', Attendance_views.Attendance.as_view(), name='event-attendance'), 
    # # path('mark-attendance/<int:event_id>/', Attendance_views.MarkAttendence.as_view(), name='mark-attendance'),   
    # path('report/<int:event_id>/', Attendance_views.AttendenceReport.as_view(), name='attendance-report'),   
  

]