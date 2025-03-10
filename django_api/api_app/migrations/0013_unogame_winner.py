# Generated by Django 5.1.6 on 2025-03-09 20:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api_app", "0012_unogame_stored_to_draw"),
    ]

    operations = [
        migrations.AddField(
            model_name="unogame",
            name="winner",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="won",
                to="api_app.unoplayer",
                verbose_name="gagnant",
            ),
        ),
    ]
