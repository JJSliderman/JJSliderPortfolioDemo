from django.urls import path, include

from api.views.demo import DefaultView

urlpatterns = [
	path('api/', include('api.urls')),
    path('', DefaultView.as_view())
]
