from django.urls import path
from base.views import User_views
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )


urlpatterns = [
    path('login/', User_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('userlist/', User_views.getEventUsers.as_view(), name='event-user'),
    
    path('', User_views.index),
    path('home/', User_views.home),

    path('profile/', User_views.getEventUserProfile.as_view(), name='event-user-profile'),

    path('user/<str:id>/', User_views.getEventUserById.as_view(), name='event-user-by-id'),

    path('register/', User_views.RegisterEventUser.as_view(), name='register-event-user'),
    # path('update/<str:id>', User_views.EditEventUser.as_view(), name='update-event-user'),
    # path('delete/<str:id>', User_views.DeleteEventUser.as_view(), name='delete-event-user'),
]