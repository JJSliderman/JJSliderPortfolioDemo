from django.urls import path
from api.views.demo import AnswersView, CrewView, DefaultView, DeleteCrewmateView, LoginView, RetireCrewmateView, SetDemoView, UpdateCrewView, UpdateCrewmateView

urlpatterns = [
    path('getDemo/<str:username>', AnswersView.as_view()),
    path('getCrew/<str:username>', CrewView.as_view()),
    path('setCrew/', UpdateCrewView.as_view()),
    path('setCrewmate/', UpdateCrewmateView.as_view()),
    path('retireCrewmate/', RetireCrewmateView.as_view()),
    path('deleteCrewmate/', DeleteCrewmateView.as_view()),
    path('setDemo/', SetDemoView.as_view()),
    path('login/', LoginView.as_view()),
    path('', DefaultView.as_view())
]
