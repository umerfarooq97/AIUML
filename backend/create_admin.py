from app.database import SessionLocal
from app.models import User, SubscriptionPlan
import bcrypt
import sys

# Workaround for passlib validation if we were to use it
# But let's use bcrypt directly to be safe and avoid the library mismatch
# The backend uses passlib, so we must produce a hash compatible with passlib's bcrypt handler.
# Passlib's bcrypt hash format usually starts with $2b$ or $2a$. standard bcrypt produces this.

def get_password_hash(password):
    # Hash a password for the first time
    # (Using bcrypt, the salt is saved into the hash itself)
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def create_admin():
    db = SessionLocal()
    print("Database connection established.")
    
    try:
        # User details
        target_email = "umerfarooq97@gmail.com" # Use standard email format
        username_alias = "umerfarooq97" # We will try to create this one too just in case
        password = "Umeeqa97@"
        
        # 1. Create/Update the Gmail user
        user = db.query(User).filter(User.email == target_email).first()
        
        if user:
            print(f"User {target_email} found. Updating to Admin...")
            user.is_admin = True
            user.subscription_plan = SubscriptionPlan.PRO
            user.password_hash = get_password_hash(password)
        else:
            print(f"Creating new Admin user: {target_email}")
            user = User(
                email=target_email,
                password_hash=get_password_hash(password),
                subscription_plan=SubscriptionPlan.PRO,
                is_admin=True
            )
            db.add(user)
            
        # 2. Create/Update the Username-style user (just to be sure which one you are trying)
        user2 = db.query(User).filter(User.email == username_alias).first()
        if user2:
             print(f"User {username_alias} found. Updating to Admin...")
             user2.is_admin = True
             user2.subscription_plan = SubscriptionPlan.PRO
             user2.password_hash = get_password_hash(password)
        else:
             print(f"Creating new Admin user (username style): {username_alias}")
             user2 = User(
                email=username_alias,
                password_hash=get_password_hash(password),
                subscription_plan=SubscriptionPlan.PRO,
                is_admin=True
             )
             db.add(user2)
        
        db.commit()
        print("--------------------------------------------------")
        print("ADMIN USERS CREATED/UPDATED SUCCESSFULLY")
        print(f"1. Login: {target_email} / {password}")
        print(f"2. Login: {username_alias} / {password}")
        print("--------------------------------------------------")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
