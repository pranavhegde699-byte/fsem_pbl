from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_index, name='api_index'),
    path('health/mongo', views.mongo_health, name='mongo_health'),
    path('workers/register', views.register_worker, name='register_worker'),
    path('workers/login', views.login_worker, name='login_worker'),
    path('workers/<str:pk>', views.worker_detail, name='worker_detail'),
    
    path('uploads/upi-pdf', views.upload_upi_pdf, name='upload_upi_pdf'),
    
    path('scores/calculate/<str:pk>', views.calculate_score, name='calculate_score'),
    path('scores/<str:pk>/latest', views.get_latest_score, name='get_latest_score'),
    
    path('schemes/match/<str:pk>', views.match_schemes_api, name='match_schemes_api'),
    
    path('documents/generate/<str:pk>', views.generate_document, name='generate_document'),
    path('documents/<str:pk>/latest', views.get_latest_document, name='get_latest_document'),
]
