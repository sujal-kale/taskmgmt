#!/usr/bin/env python
"""Force drop and recreate database tables using raw SQL."""

from app.database.db import engine
from sqlalchemy import text

print("Connecting to database...")

with engine.connect() as connection:
    # Drop tables in the correct order (foreign key dependencies)
    print("Dropping tables...")
    try:
        connection.execute(text("DROP TABLE IF EXISTS tasks CASCADE"))
        print("✓ Dropped tasks table")
    except Exception as e:
        print(f"! Error dropping tasks: {e}")
    
    try:
        connection.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        print("✓ Dropped users table")
    except Exception as e:
        print(f"! Error dropping users: {e}")
    
    # Commit the drops
    connection.commit()
    print("✓ Committed drops")

# Now recreate using SQLAlchemy
print("\nRecreating tables with SQLAlchemy...")
from app.database.db import Base
from app.models.task import Task
from app.models.user import User

Base.metadata.create_all(bind=engine)
print("✓ Tables recreated successfully")

print("\nDatabase reset complete! You can now register and use the app.")
