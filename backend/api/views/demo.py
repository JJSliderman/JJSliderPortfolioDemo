from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from api.models.demo import Crew, Crewmate, Demo
from datetime import datetime, timezone
from api.serializers.demo import CrewSerializer, CrewmateSerializer, DemoSerializer
from django.core.paginator import Paginator

class AnswersView(generics.GenericAPIView):
    serializer_class = DemoSerializer

    def get(self, request, username):
        if request.META.get('HTTP_AUTHORIZATION') is not None:
            try:
                hold = Demo.objects.get(username=username).answers
            except:
                return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'status': 'success', 'answers': hold}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error'}, status=status.HTTP_401_UNAUTHORIZED)
        
class CrewView(generics.GenericAPIView):
    serializer_class = CrewSerializer
    mate_serializer_class = CrewmateSerializer

    def get(self, request, username):
        if request.META.get('HTTP_AUTHORIZATION') is not None:
            try:
                hold = Crew.objects.get(organizer=Demo.objects.get(username=username))
                #Filter for url elements in api call url
                nameFilter = request.GET.get("name")
                colorFilter = request.GET.get("color")
                epithetFilter = request.GET.get("epithet")
                dateFilter = request.GET.get("enlistment")
                retiredFilter = request.GET.get("retired")
                sortFilter = request.GET.get("sortBy")
                directionFilter = request.GET.get("direction")
                page = request.GET.get("page")
                rows = request.GET.get("rows")
                reverse=directionFilter == 'up'
                holdMates = Crewmate.objects.filter(team=hold)
                if nameFilter != '':
                    holdMates = holdMates.filter(name__icontains=nameFilter)
                if retiredFilter == 'retired':
                    holdMates = holdMates.filter(retired=True)
                if retiredFilter == 'nonretired':
                    holdMates = holdMates.filter(retired=False)
                if colorFilter != '':
                    holdMates = holdMates.filter(color__icontains=colorFilter)
                if epithetFilter != '':
                    holdMates = holdMates.filter(epithet__icontains=epithetFilter)
                if dateFilter != '':
                    holdMates = holdMates.filter(enlistment=datetime.fromtimestamp(int(dateFilter) / 1000.0, tz=timezone.utc))
                if sortFilter == 'name':
                    #Sorting list of dictionaries
                    holdMates = sorted(holdMates, key=lambda x: x.name.lower(), reverse=reverse)
                    #Sorting dictionary single: key=lambda item: item[0] for key and item[1] for value))
                elif sortFilter == 'color':
                    holdMates = sorted(holdMates, key=lambda x: x.color.lower(), reverse=reverse)
                elif sortFilter == 'epithet':
                    holdMates = sorted(holdMates, key=lambda x: x.epithet.lower(), reverse=reverse)
                elif sortFilter == 'retired':
                    holdMates = sorted(holdMates, key=lambda x: x.retired, reverse=reverse)
                else:
                    holdMates = sorted(holdMates, key=lambda x: x.enlistment, reverse=reverse)
                serializer = self.serializer_class(hold)
                mate_serializer = self.mate_serializer_class(holdMates, many=True)
            except:
                return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            pagination = Paginator(mate_serializer.data, int(rows)) #Groups items in rows per page
            items = pagination.get_page(int(page)+1) #Gets info for one page specifically. Object_list displays objects on that page
            return Response({'status': 'success', 'crew': serializer.data, 'crewmates': items.object_list, 'count': len(mate_serializer.data)}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error'}, status=status.HTTP_401_UNAUTHORIZED)
        
class UpdateCrewView(generics.GenericAPIView):
    serializer_class = CrewSerializer

    def post(self, request):
        if request.META.get('HTTP_AUTHORIZATION') is not None:
            try:
                if Crew.objects.filter(organizer=Demo.objects.get(username=request.data["username"])).exists():
                    hold = Crew.objects.get(organizer=Demo.objects.get(username=request.data["username"]))
                    hold.symbol = request.data["symbol"]
                    hold.name = request.data["name"]
                    hold.save()
                else:
                    Crew.objects.create(organizer=Demo.objects.get(username=request.data["username"]), name=request.data["name"], symbol=request.data["symbol"])
            except:
                return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error'}, status=status.HTTP_401_UNAUTHORIZED)
        
class UpdateCrewmateView(generics.GenericAPIView):
    serializer_class = CrewmateSerializer

    def post(self, request):
        if request.META.get('HTTP_AUTHORIZATION') is not None:
            try:
                if Crewmate.objects.filter(name=request.data["oldname"], team=Crew.objects.get(name=request.data["leader"], organizer=Demo.objects.get(username=request.data["organizer"]))).exists():
                    hold = Crewmate.objects.get(name=request.data["oldname"], team=Crew.objects.get(name=request.data["leader"], organizer=Demo.objects.get(username=request.data["organizer"])))
                    hold.epithet = request.data["epithet"]
                    hold.name = request.data["name"]
                    hold.color = request.data["color"]
                    hold.save()
                else:
                    Crewmate.objects.create(team=Crew.objects.get(name=request.data["leader"], organizer=Demo.objects.get(username=request.data["organizer"])), epithet=request.data["epithet"], name=request.data["name"], enlistment=datetime.now(tz=timezone.utc), color=request.data["color"])
            except:
                return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error'}, status=status.HTTP_401_UNAUTHORIZED)
        
class RetireCrewmateView(generics.GenericAPIView):

    def post(self, request):
        if request.META.get('HTTP_AUTHORIZATION') is not None:
            try:
                if Crewmate.objects.filter(name=request.data["name"], team=Crew.objects.get(name=request.data["leader"], organizer=Demo.objects.get(username=request.data["organizer"]))).exists():
                    hold = Crewmate.objects.get(name=request.data["name"], team=Crew.objects.get(name=request.data["leader"], organizer=Demo.objects.get(username=request.data["organizer"])))
                    hold.retired = True if hold.retired == False else False
                    hold.save()
                else:
                    return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error'}, status=status.HTTP_401_UNAUTHORIZED)
        
class DeleteCrewmateView(generics.GenericAPIView):

    def post(self, request):
        if request.META.get('HTTP_AUTHORIZATION') is not None:
            try:
                if Crewmate.objects.filter(name=request.data["name"], team=Crew.objects.get(name=request.data["leader"], organizer=Demo.objects.get(username=request.data["organizer"]))).exists():
                    hold = Crewmate.objects.get(name=request.data["name"], team=Crew.objects.get(name=request.data["leader"], organizer=Demo.objects.get(username=request.data["organizer"])))
                    hold.delete()
                else:
                    return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error'}, status=status.HTTP_401_UNAUTHORIZED)

class LoginView(generics.GenericAPIView):
    def post(self, request):
        # Authenticate user
        if len(request.data["username"]) > 100 or len(request.data["password"]) > 100:
            return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if not Demo.objects.filter(username=request.data["username"], password=request.data["password"]).exists():
                Demo.objects.create(username=request.data["username"], password=request.data["password"], answers=[])
                User.objects.create_user(username=request.data["username"], password=request.data["password"]) 
            user = authenticate(username=request.data["username"], password=request.data["password"])
            if user is not None:
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    'status': 'success',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'loggedInUser': request.data["username"]
                }, status=status.HTTP_200_OK)
            return Response({'status': 'error'}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
    
class SetDemoView(generics.GenericAPIView):
    serializer_class = DemoSerializer

    def post(self, request):
        if request.META.get('HTTP_AUTHORIZATION') is not None:
            try:
                username = request.data['username']
            except:
                return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                step = request.data['step']
                newValue = request.data['newValue']
            except: 
                return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
            demo = Demo.objects.get(username=username)
            if len(demo.answers) == int(step):
                demo.answers.append(newValue)
            else:
                demo.answers[int(step)] = newValue
            demo.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        return Response({'status': 'error'}, status=status.HTTP_401_UNAUTHORIZED)
    
class DefaultView(generics.GenericAPIView):

    def get(self, request):
        return Response({'status': 'success'}, status=status.HTTP_200_OK)