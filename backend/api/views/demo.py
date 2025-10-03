from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from api.models.demo import Demo, LastDemo
from api.serializers.demo import DemoSerializer

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
    
class LastDemoView(generics.GenericAPIView):

    def get(self, request):
        try:
            if LastDemo.objects.all().exists():
                holdUser = LastDemo.objects.all()[0].lastLoggedIn
                user = authenticate(username=holdUser.username, password=holdUser.password)
                hold=holdUser.username
                if user is not None:
                    # Generate tokens
                    refresher = RefreshToken.for_user(user)
                    refresh = str(refresher)
                    access = str(refresher.access_token)
                
            else:
                hold = ''
                refresh = ''
                access = ''
        except:
            return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'success', 'loggedInUser': hold, 'access': access, 'refresh': refresh}, status=status.HTTP_200_OK)


class LoginView(generics.GenericAPIView):
    def post(self, request):

        # Authenticate user
        try:
            if not Demo.objects.filter(username=request.data["username"], password=request.data["password"]).exists():
                newDemo=Demo.objects.create(username=request.data["username"], password=request.data["password"], answers=[])
                User.objects.create_user(username=request.data["username"], password=request.data["password"]) 
            else:
                newDemo = Demo.objects.get(username=request.data["username"], password=request.data["password"])
            user = authenticate(username=request.data["username"], password=request.data["password"])
            if user is not None:
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                if not LastDemo.objects.all().exists():
                    LastDemo.objects.create(lastLoggedIn=newDemo)
                else:
                    newLast = LastDemo.objects.all()[0]
                    newLast.lastLoggedIn = newDemo
                    newLast.save()
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