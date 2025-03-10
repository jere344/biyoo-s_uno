# Generated by Django 5.1.6 on 2025-03-09 12:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api_app", "0010_alter_unoplayer_game"),
    ]

    operations = [
        migrations.AlterField(
            model_name="unogame",
            name="current_card",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="in_game_current",
                to="api_app.unocard",
                verbose_name="carte actuelle",
            ),
        ),
        migrations.AlterField(
            model_name="unogame",
            name="current_player_number",
            field=models.IntegerField(null=True, verbose_name="joueur actuel"),
        ),
        migrations.AlterField(
            model_name="unogame",
            name="pile",
            field=models.ManyToManyField(
                blank=True,
                related_name="in_game_piles",
                to="api_app.unocard",
                verbose_name="pioche",
            ),
        ),
    ]
