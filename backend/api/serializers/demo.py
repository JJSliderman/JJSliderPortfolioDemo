from rest_framework import serializers
from api.models.demo import Crew, Crewmate, Demo

class DemoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Demo
        fields = ['username', 'password', 'answers']

class CrewmateSerializer(serializers.ModelSerializer):
    teamname = serializers.SerializerMethodField()
    class Meta:
        model = Crewmate
        fields = ['name', 'epithet', 'color', 'enlistment', 'teamname', 'retired']

    def get_teamname(self, crewmate):
        return crewmate.team.name

class CrewSerializer(serializers.ModelSerializer):
    organizername = serializers.SerializerMethodField()
    class Meta:
        model = Crew
        fields = ['name', 'symbol', 'organizername']

    def get_organizername(self, crew):
        return crew.organizer.username
