# Generated by Django 5.1.6 on 2025-03-29 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("auth_app", "0004_customuser_last_activity"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="roblox_username",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
