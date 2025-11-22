from rest_framework import serializers
from .models import Photo

class PhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = Photo
        fields = ['id', 'title', 'description', 'image_url', 'created_at', 'updated_at']