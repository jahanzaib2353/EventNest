from rest_framework.permissions import BasePermission

class IsOrganizer(BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated and has an organizer status
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.status == 'organizer'

    def has_object_permission(self, request, view, obj):
        # Check if the user is the organizer of the event
        return request.user.status == 'organizer' and request.user == obj.organizer
    

class IsAttendee(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.status == 'attendee'
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            return obj.attendee == request.user
        return False
    

 