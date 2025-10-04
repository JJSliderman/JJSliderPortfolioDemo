from django.db import models
from django.contrib.postgres.fields import ArrayField

class Demo(models.Model):
    username = models.CharField(max_length=100, default='testuser')
    password = models.CharField(max_length=100, default='testpassword')
    answers = ArrayField(
        models.CharField(max_length=255), 
        blank=True,                        
        default=list                       
    )
    class Meta:
        unique_together=('username', 'password')