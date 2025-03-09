# Generated by Django 5.1.6 on 2025-03-09 12:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api_app", "0009_alter_unoplayer_game"),
    ]

    operations = [
        migrations.AlterField(
            model_name="unoplayer",
            name="game",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="players",
                to="api_app.unogame",
                verbose_name="partie",
            ),
        ),
    ]
