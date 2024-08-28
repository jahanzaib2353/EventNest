from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from base.models import *


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        #we don't want to send enough data
        # data['username'] = self.user.username
        # data['status'] = self.user.status  
        # data['email'] = self.user.email

        return data

class EventUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventUser
        fields = ['id', 'username', 'status','email', 'password', 'organization_name', 'preferences']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = EventUser(**validated_data)
        user.set_password(validated_data['password'])  # This hashes the password
        user.save()
        return user
    
    
class UserSerializerWithToken(EventUserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = EventUser
        fields = ['id', 'username', 'email', 'status', 'organization_name', 'preferences', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)



class EventSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'duration', 'virtual_venue', 'organizer', 'file', 'file_type', 'file_url']
        
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

    def validate(self, data):
        file = data.get('file')
        if file:
            # Validate file size
            if file.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("File size must be under 10 MB.")
        return data

  

class AttendeeRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendeeRegistration
        fields = ['id', 'event', 'attendee', 'registration_date']


class EventAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendance
        fields = '__all__'