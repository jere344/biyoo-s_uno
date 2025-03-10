# Generated by Django 5.1.6 on 2025-03-09 12:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api_app", "0007_unogame_unoplayer"),
    ]

    operations = [
        migrations.AddField(
            model_name="unogame",
            name="room",
            field=models.OneToOneField(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to="api_app.room",
                verbose_name="salle",
            ),
            preserve_default=False,
        ),
    ]
