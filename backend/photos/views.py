from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Photo
from .serializers import PhotoSerializer

class PhotoListView(generics.ListAPIView):
    """
    API endpoint to list all photos
    """
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

class PhotoDetailView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve a single photo
    """
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    lookup_field = 'id'
