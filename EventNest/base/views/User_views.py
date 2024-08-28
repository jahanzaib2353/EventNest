from rest_framework.views import APIView
from django.shortcuts import redirect
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from base.serializers import *
from rest_framework import status
from base.permissions import IsAttendee
from django.shortcuts import render

# Create your views here.
#view is typically used to issue a pair of tokens (access and refresh) 
from rest_framework_simplejwt.views import TokenObtainPairView

    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    

    
def index(request):  # This function will not be included in coverage reports
    return render(request, 'index.html')  # pragma: no cover

def home(request):  # This function will not be included in coverage reports
    print(request) # pragma: no cover
    return render(request, 'index.html')  # pragma: no cover


class RegisterEventUser(APIView):
    def post(self, request):
        # This attribute contains the parsed content of the request body.
        data = request.data
        
        serializer = EventUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  # Save the user instance
            return Response({
                'success': 'User created successfully',
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class getEventUserById(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            user = EventUser.objects.get(id=id)
            serializer = EventUserSerializer(user, many=False)
            return Response(serializer.data)
        except:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, id):
        try:
            user = EventUser.objects.get(id=id)
            if user != request.user:
                return Response({'error': 'You are not authorized to edit this profile'}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = EventUserSerializer(user, data=request.data, partial=True)  # Ensure partial update
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except EventUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, id):
        if request.user.status!='organizer':
            return Response({'error': 'Permission denied. Only organizers can delete users.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = EventUser.objects.get(id=id)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except EventUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class getEventUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user= request.user
        serializer = EventUserSerializer(user, many=False)
        return Response( 
            {'success':'profile fetched succeffuly',
             'data':serializer.data,},
            status=status.HTTP_200_OK)

  

