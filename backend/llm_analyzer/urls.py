from django.urls import path
from . import views

urlpatterns = [
    path('analysis/', views.llm_analysis, name='llm_analysis'),
]
