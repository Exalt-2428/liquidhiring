# Generated by Django 4.1.7 on 2023-02-25 07:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0004_rename_point_job_location'),
    ]

    operations = [
        migrations.RenameField(
            model_name='job',
            old_name='location',
            new_name='point',
        ),
    ]