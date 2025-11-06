from django.db import models
from django.contrib.auth.models import User

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    url = models.URLField()
    resource_type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    snippet = models.TextField(blank=True, null=True)
    thumbnail = models.URLField(blank=True, null=True)
    channel_or_authors = models.CharField(max_length=512, blank=True, null=True)
    class Meta:
        ordering = ['-created_at']
    def __str__(self):
        return self.title
    
class SurfChat(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    message=models.TextField()
    timestamp=models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering=['-timestamp']
    def __str__(self):
        return f'{self.user.username}: {self.message[:20]}'