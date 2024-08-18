from django.db.models.signals import pre_save
from base.models import *

def updateUser(sender, instance, **kwargs):
   # user = instance
   # if user.email != '':
   #    user.username= user.email
   pass
pre_save.disconnect(updateUser, sender=EventUser)