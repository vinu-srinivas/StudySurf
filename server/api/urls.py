from django.urls import path,include
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'bookmarks',views.BookmarkViewSet,basename='bookmark')

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('logout/',views.LogoutView.as_view(),name="auth_logout"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('',include(router.urls)),

    path('search/youtube/', views.YoutubeSearchView.as_view(), name='search_youtube'),
    path('search/papers/',views.ResearchPaperView.as_view(),name="search_papers"),
    path('search/web/', views.WebSearchView.as_view(), name='search_web'),
    path('chat/messages/',views.SurfChatView.as_view(),name="surf_chat"),
]