# Generated by Django 2.2.6 on 2019-10-25 04:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('odas', '0004_merge_20191024_0813'),
    ]

    operations = [
        migrations.RenameField(
            model_name='satellite',
            old_name='year_lauched',
            new_name='year_launched',
        ),
    ]
