#!/usr/bin/env python3
"""
Script to create a test user in the database
"""
from main import SessionLocal, User, pwd_context
import sys

def create_user(username, password, role="admin"):
    """Create a new user with hashed password"""
    db = SessionLocal()
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        print(f"User '{username}' already exists!")
        return False
    
    # Validate password length (bcrypt limit is 72 bytes)
    if len(password) > 72:
        print(f"Error: Password is too long! Maximum 72 characters allowed.")
        return False
    
    # Hash password
    hashed_password = pwd_context.hash(password)
    
    # Create user
    new_user = User(
        username=username,
        hashed_password=hashed_password,
        role=role
    )
    
    db.add(new_user)
    db.commit()
    print(f"✓ User '{username}' created successfully with role '{role}'")
    return True

if __name__ == "__main__":
    # Create admin user
    create_user("admin", "makstark2024", role="admin")
    
    # List all users
    db = SessionLocal()
    users = db.query(User).all()
    print(f"\nTotal users in database: {len(users)}")
    for user in users:
        print(f"  - {user.username} (role: {user.role})")
