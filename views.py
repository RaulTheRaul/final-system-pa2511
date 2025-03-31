from rest_framework import viewsets, permissions
from .models import Vacancy
from .serializers import VacancySerializer

class VacancyViewSet(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all().order_by('-created_at')
    serializer_class = VacancySerializer

    def perform_create(self, serializer):
        # Set employer as logged-in user
        serializer.save(employer=self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'create']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]  # Anyone can view
