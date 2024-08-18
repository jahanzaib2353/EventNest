from django.contrib import admin
from base.models import * 
# Register your models here.
admin.site.register(EventUser)
admin.site.register(Event)
admin.site.register(AttendeeRegistration)
admin.site.register(EventAttendance)