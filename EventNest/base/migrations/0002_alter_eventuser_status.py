# Generated by Django 5.0.6 on 2024-07-11 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventuser',
            name='status',
            field=models.CharField(choices=[('organizer', 'Organizer'), ('attendee', 'Attendee')], default='regular', max_length=10),
        ),
    ]
