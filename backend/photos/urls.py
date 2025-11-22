from django.urls import path
from . import views

urlpatterns = [
    path('photos/', views.PhotoListView.as_view(), name='photo-list'),
    path('photos/<int:id>/', views.PhotoDetailView.as_view(), name='photo-detail'),
]