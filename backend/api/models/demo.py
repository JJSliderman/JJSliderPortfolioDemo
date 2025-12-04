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

class Crew(models.Model):
    name = models.CharField(max_length=100, default='newcrew')
    symbol = models.CharField(max_length=100, default='skull')
    organizer = models.ForeignKey(Demo, on_delete=models.CASCADE, related_name='crew')

    class Meta:
        unique_together=('name', 'symbol', 'organizer')

class Crewmate(models.Model):
    name = models.CharField(max_length=100, default='crewmember')
    color = models.CharField(max_length=30, default='blue')
    epithet = models.CharField(max_length=100, default='swabber')
    enlistment = models.DateField()
    team = models.ForeignKey(Crew, on_delete=models.CASCADE, related_name='crewmates')
    retired = models.BooleanField(default=False)

    class Meta:
        unique_together=('name', 'enlistment', 'epithet', 'team', 'color')