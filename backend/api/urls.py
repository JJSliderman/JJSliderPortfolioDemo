from django.urls import path
from api.views.demo import AnswersView, DefaultView, LastDemoView, LoginView, SetDemoView

urlpatterns = [
    path('getDemo/<str:username>', AnswersView.as_view()),
    path('theLast', LastDemoView.as_view()),
    path('setDemo/', SetDemoView.as_view()),
    path('login/', LoginView.as_view()),
    path('', DefaultView.as_view())
]
