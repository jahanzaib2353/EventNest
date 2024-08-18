from django.contrib.auth.models import AbstractUser
from django.db import models

class EventUser(AbstractUser):
    STATUS_CHOICES = (
        
        ('organizer', 'Organizer'),
        ('attendee', 'Attendee'),
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='organizer')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    organization_name = models.CharField(max_length=255, null=True, blank=True)
    preferences = models.JSONField(null=True, blank=True)

    # groups = models.ManyToManyField(Group, related_name='event_user_groups')
    # user_permissions = models.ManyToManyField(Permission, related_name='event_user_permissions')

    def __str__(self):
        return self.username



class Event(models.Model):
    FILE_TYPE_CHOICES = (
    ('image', 'Image'),
    ('video', 'Video'),
    ('document', 'Document'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    duration = models.DurationField()
    virtual_venue = models.URLField()
    organizer = models.ForeignKey(EventUser, on_delete=models.CASCADE)
    
    file = models.FileField(upload_to='media', null=True, blank=True)
    file_type = models.CharField(max_length=50, choices=FILE_TYPE_CHOICES, null=True, blank=True)

    def __str__(self):
        return self.title
    

class AttendeeRegistration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    attendee = models.ForeignKey(EventUser, on_delete=models.CASCADE) #it is an instance of EventUser
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.attendee.username} - {self.event.title}"
    

class EventAttendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
    ]

    user = models.ForeignKey(EventUser, on_delete=models.CASCADE) # fieldname should be the organizer
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    attendee = models.ForeignKey(AttendeeRegistration, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='absent')
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.event.title} - {self.status}"