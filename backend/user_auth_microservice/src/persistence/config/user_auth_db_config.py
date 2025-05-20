from peewee import MySQLDatabase

from shared.env_config import Settings

db = MySQLDatabase(
    database=Settings.MYSQL_DATABASE,
    user=Settings.MYSQL_USER,
    password=Settings.MYSQL_PASSWORD,
    host=Settings.MYSQL_HOST,
    port=Settings.MYSQL_PORT,
)