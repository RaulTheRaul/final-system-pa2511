from django.db import models
from django.contrib.auth.models import User

JOB_TYPES = (
    ('Full-time', 'Full-time'),
    ('Part-time', 'Part-time'),
    ('Casual', 'Casual'),
)

class Vacancy(models.Model):
    employer = models.ForeignKey(User, on_delete=models.CASCADE)  # assuming User is employer
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=20, choices=JOB_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
