# Generated by Django 5.1.6 on 2025-03-06 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api_app", "0005_message"),
    ]

    operations = [
        migrations.CreateModel(
            name="UnoCard",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("color", models.CharField(max_length=100, verbose_name="couleur")),
                ("action", models.CharField(max_length=100, verbose_name="action")),
                (
                    "image",
                    models.ImageField(upload_to="base_cards", verbose_name="image"),
                ),
            ],
            options={
                "verbose_name": "carte",
                "verbose_name_plural": "cartes",
                "ordering": ["color", "action"],
            },
        ),
    ]
