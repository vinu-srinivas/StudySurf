from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Bookmark,SurfChat

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    class Meta:
        model = User
        fields = ('username', 'password')
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
class BookmarkSerializer(serializers.ModelSerializer):
    user=serializers.ReadOnlyField(source='user.username')
    class Meta:
        model=Bookmark
        fields=['id','user','title','url','resource_type','created_at','snippet','thumbnail','channel_or_authors']

class SurfChatSerializer(serializers.ModelSerializer):
    user=serializers.ReadOnlyField(source='user.username')
    class Meta:
        model=SurfChat
        fields=['id','user','message','timestamp']