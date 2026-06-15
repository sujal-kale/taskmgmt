#!/usr/bin/env python
"""Reset database schema to match current models."""

from app.database.db import Base, engine

# Drop all tables
print("Dropping all existing tables...")
Base.metadata.drop_all(bind=engine)
print("✓ Dropped all existing tables")

# Create tables with new schema
print("Creating tables with updated schema...")
Base.metadata.create_all(bind=engine)
print("✓ Created all tables with updated schema")
print("\nDatabase has been reset successfully!")
