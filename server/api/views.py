from django.contrib.auth.models import User
from rest_framework import generics,viewsets,status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer,BookmarkSerializer,SurfChatSerializer
from .models import SurfChat
from django.conf import settings
from googleapiclient.discovery import build
import arxiv

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LogoutView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        try:
            refresh_token=request.data["refresh_token"]
            token=RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class=BookmarkSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self,request):
        return self.request.user.bookmark_set.all()
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)

class YoutubeSearchView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        query=request.query_params.get('q',None)
        if not query:
            return Response(
                {"error": "A query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            youtube=build('youtube','v3',developerKey=settings.YOUTUBE_API_KEY)
            search_response = youtube.search().list(
                q=query,
                part='snippet',
                maxResults=10, 
                type='video' 
            ).execute()
            results = []
            for item in search_response.get('items', []):
                results.append({
                    'title': item['snippet']['title'],
                    'video_id': item['id']['videoId'],
                    'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    'thumbnail': item['snippet']['thumbnails']['high']['url'],
                    'channel': item['snippet']['channelTitle'],
                    'snippet':item['snippet']['description'],
                })

            return Response(results)
        except Exception as e:
            return Response(
                {"error": f"An error occurred with the YouTube API: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResearchPaperView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        query=request.query_params.get('q',None)
        if not query:
            return Response({"error":"A query parameter is required."},status=status.HTTP_400_BAD_REQUEST)
        try:
            search = arxiv.Search(
                query=query,
                max_results=10,
                sort_by=arxiv.SortCriterion.Relevance
            )
            results = []
            for result in search.results():
                results.append({
                    'title': result.title,
                    'url': result.entry_id,
                    'pdf_url': result.pdf_url,
                    'anippet': result.summary,
                    'authors': [author.name for author in result.authors],
                    'year': result.published.year,
                })
            return Response(results)
        except Exception as e:
            return Response(
                {"error": f"An error occurred with the arXiv API: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class WebSearchView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        query = request.query_params.get('q', None)
        department = request.query_params.get('dept', 'cs')
        if not query:
            return Response(
                {"error": "A 'q' query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        cx_id = settings.SEARCH_ENGINE_IDS.get(department.lower())
        try:
            service = build('customsearch', 'v1', developerKey=settings.YOUTUBE_API_KEY)
            response = service.cse().list(
                q=query,
                cx=cx_id,
                num=10
            ).execute()
            results = []
            for item in response.get('items', []):
                results.append({
                    'title': item.get('title'),
                    'url': item.get('link'),
                    'snippet': item.get('snippet'),
                })
            if not results:
                return Response(
                    {"message": "No results found from the specified websites."},
                    status=status.HTTP_200_OK
                )
            return Response(results)
        except Exception as e:
            return Response(
                {"error": f"An error occurred with the Google Search API: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class SurfChatView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        messages = SurfChat.objects.all().order_by('-timestamp')[:50]
        serializer = SurfChatSerializer(messages, many=True)
        return Response(serializer.data[::-1])
    def post(self, request):
        serializer = SurfChatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)