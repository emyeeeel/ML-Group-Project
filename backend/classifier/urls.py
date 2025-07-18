from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_results, name='predict_results'),
]
