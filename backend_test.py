"""
Comprehensive backend test suite for EasyX Phase-1 Authentication API.
Tests all auth endpoints: register, login, me, admin role gating.
"""
import time
import requests
import json

# Read base URL from frontend/.env
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BASE_URL = line.split('=', 1)[1].strip() + '/api'
            break

print(f"🔗 Testing against: {BASE_URL}")
print("=" * 80)

# Test results tracking
passed = 0
failed = 0
test_results = []

def log_test(name, success, status_code=None, expected=None, detail=None):
    global passed, failed
    if success:
        passed += 1
        result = f"✅ PASS"
    else:
        failed += 1
        result = f"❌ FAIL"
    
    msg = f"{result} - {name}"
    if status_code is not None:
        msg += f" (status: {status_code}"
        if expected:
            msg += f", expected: {expected}"
        msg += ")"
    if detail:
        msg += f" - {detail}"
    
    print(msg)
    test_results.append({"test": name, "passed": success, "status": status_code, "detail": detail})

# Generate unique test data using timestamp
timestamp = int(time.time() * 1000)
test_user_email = f"testuser{timestamp}@example.com"
test_user_phone = f"+91{timestamp % 10000000000}"
test_user_password = "TestPass123!"
test_user_name = "Test User"

test_user2_email = f"testuser2{timestamp}@example.com"
test_user2_phone = f"+91{(timestamp + 1) % 10000000000}"

# Initialize variables that will be set during tests
test_user_token = None
test_user_referral_code = None
test_user2_token = None
admin_token = None

print("\n📋 TEST SUITE: POST /api/auth/register")
print("-" * 80)

# Test 1: Successful registration
print("\n1️⃣  Testing successful registration...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": test_user_name,
            "email": test_user_email,
            "phone": test_user_phone,
            "password": test_user_password
        },
        timeout=10
    )
    
    if response.status_code == 201:
        data = response.json()
        
        # Check structure
        has_token = "access_token" in data
        has_token_type = data.get("token_type") == "bearer"
        has_user = "user" in data
        
        if has_token and has_token_type and has_user:
            user = data["user"]
            
            # Verify all required fields
            required_fields = ["id", "name", "email", "phone", "role", "email_verified", 
                             "kyc_status", "referral_code", "status", "created_at"]
            missing_fields = [f for f in required_fields if f not in user]
            
            # Check password_hash is NOT present
            has_password_hash = "password_hash" in user or "password_hash" in data
            
            # Verify field values
            correct_role = user.get("role") == "user"
            correct_kyc = user.get("kyc_status") == "none"
            correct_status = user.get("status") == "active"
            correct_email = user.get("email") == test_user_email.lower()
            has_referral_code = bool(user.get("referral_code"))
            referred_by_null = user.get("referred_by") is None
            
            if not missing_fields and not has_password_hash and correct_role and correct_kyc and correct_status and correct_email and has_referral_code and referred_by_null:
                log_test("Register success (201) with valid structure", True, 201)
                # Store token and referral code for later tests
                test_user_token = data["access_token"]
                test_user_referral_code = user["referral_code"]
            else:
                issues = []
                if missing_fields:
                    issues.append(f"missing fields: {missing_fields}")
                if has_password_hash:
                    issues.append("password_hash exposed in response")
                if not correct_role:
                    issues.append(f"role is '{user.get('role')}' not 'user'")
                if not correct_kyc:
                    issues.append(f"kyc_status is '{user.get('kyc_status')}' not 'none'")
                if not correct_status:
                    issues.append(f"status is '{user.get('status')}' not 'active'")
                if not has_referral_code:
                    issues.append("referral_code missing or empty")
                if not referred_by_null:
                    issues.append(f"referred_by should be null but is '{user.get('referred_by')}'")
                log_test("Register success (201) with valid structure", False, 201, detail="; ".join(issues))
        else:
            log_test("Register success (201) with valid structure", False, 201, 
                    detail=f"Missing: token={has_token}, token_type={has_token_type}, user={has_user}")
    else:
        log_test("Register success (201)", False, response.status_code, 201, 
                detail=response.text[:200])
except Exception as e:
    log_test("Register success (201)", False, detail=f"Exception: {str(e)}")

# Test 2: Duplicate email (409)
print("\n2️⃣  Testing duplicate email...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": "Another User",
            "email": test_user_email,  # Same email
            "phone": f"+91{(timestamp + 999) % 10000000000}",  # Different phone
            "password": test_user_password
        },
        timeout=10
    )
    
    if response.status_code == 409:
        log_test("Duplicate email returns 409", True, 409)
    else:
        log_test("Duplicate email returns 409", False, response.status_code, 409, 
                detail=response.text[:200])
except Exception as e:
    log_test("Duplicate email returns 409", False, detail=f"Exception: {str(e)}")

# Test 3: Duplicate phone (409)
print("\n3️⃣  Testing duplicate phone...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": "Another User",
            "email": f"different{timestamp}@example.com",  # Different email
            "phone": test_user_phone,  # Same phone
            "password": test_user_password
        },
        timeout=10
    )
    
    if response.status_code == 409:
        log_test("Duplicate phone returns 409", True, 409)
    else:
        log_test("Duplicate phone returns 409", False, response.status_code, 409, 
                detail=response.text[:200])
except Exception as e:
    log_test("Duplicate phone returns 409", False, detail=f"Exception: {str(e)}")

# Test 4: Invalid referral code (400)
print("\n4️⃣  Testing invalid referral code...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": "Test User Invalid Ref",
            "email": f"invalidref{timestamp}@example.com",
            "phone": f"+91{(timestamp + 888) % 10000000000}",
            "password": test_user_password,
            "referral_code": "INVALID999"
        },
        timeout=10
    )
    
    if response.status_code == 400:
        log_test("Invalid referral code returns 400", True, 400)
    else:
        log_test("Invalid referral code returns 400", False, response.status_code, 400, 
                detail=response.text[:200])
except Exception as e:
    log_test("Invalid referral code returns 400", False, detail=f"Exception: {str(e)}")

# Test 5: Short password (<8 chars) - 422 Pydantic validation
print("\n5️⃣  Testing short password...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": "Test User Short Pass",
            "email": f"shortpass{timestamp}@example.com",
            "phone": f"+91{(timestamp + 777) % 10000000000}",
            "password": "Short1"  # Only 6 chars
        },
        timeout=10
    )
    
    if response.status_code == 422:
        log_test("Short password (<8 chars) returns 422", True, 422)
    else:
        log_test("Short password (<8 chars) returns 422", False, response.status_code, 422, 
                detail=response.text[:200])
except Exception as e:
    log_test("Short password (<8 chars) returns 422", False, detail=f"Exception: {str(e)}")

# Test 6: Referral flow - register user B with user A's referral code
print("\n6️⃣  Testing referral flow...")
if test_user_referral_code is None:
    log_test("Referral flow: B.referred_by == A.id", False, detail="Skipped - user A registration failed")
else:
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={
                "name": "Test User Referred",
                "email": test_user2_email,
                "phone": test_user2_phone,
                "password": test_user_password,
                "referral_code": test_user_referral_code
            },
            timeout=10
        )
        
        if response.status_code == 201:
            data = response.json()
            user_b = data.get("user", {})
            
            # Get user A's ID from the first registration
            # We need to fetch user A's ID - we can use /me endpoint with user A's token
            me_response = requests.get(
                f"{BASE_URL}/auth/me",
                headers={"Authorization": f"Bearer {test_user_token}"},
                timeout=10
            )
            
            if me_response.status_code == 200:
                user_a = me_response.json()
                user_a_id = user_a.get("id")
                user_b_referred_by = user_b.get("referred_by")
                
                if user_b_referred_by == user_a_id:
                    log_test("Referral flow: B.referred_by == A.id", True, 201)
                    test_user2_token = data["access_token"]
                else:
                    log_test("Referral flow: B.referred_by == A.id", False, 201, 
                            detail=f"B.referred_by={user_b_referred_by}, A.id={user_a_id}")
            else:
                log_test("Referral flow: B.referred_by == A.id", False, 201, 
                        detail=f"Could not fetch user A via /me: {me_response.status_code}")
        else:
            log_test("Referral flow: B.referred_by == A.id", False, response.status_code, 201, 
                    detail=response.text[:200])
    except Exception as e:
        log_test("Referral flow: B.referred_by == A.id", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 TEST SUITE: POST /api/auth/login")
print("-" * 80)

# Test 7: Successful login
print("\n7️⃣  Testing successful login...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": test_user_email,
            "password": test_user_password
        },
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        has_token = "access_token" in data
        has_user = "user" in data
        
        if has_token and has_user:
            log_test("Login success (200) with token and user", True, 200)
        else:
            log_test("Login success (200) with token and user", False, 200, 
                    detail=f"Missing: token={has_token}, user={has_user}")
    else:
        log_test("Login success (200)", False, response.status_code, 200, 
                detail=response.text[:200])
except Exception as e:
    log_test("Login success (200)", False, detail=f"Exception: {str(e)}")

# Test 8: Wrong password (401)
print("\n8️⃣  Testing wrong password...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": test_user_email,
            "password": "WrongPassword123!"
        },
        timeout=10
    )
    
    if response.status_code == 401:
        log_test("Wrong password returns 401", True, 401)
    else:
        log_test("Wrong password returns 401", False, response.status_code, 401, 
                detail=response.text[:200])
except Exception as e:
    log_test("Wrong password returns 401", False, detail=f"Exception: {str(e)}")

# Test 9: Non-existent email (401)
print("\n9️⃣  Testing non-existent email...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": f"nonexistent{timestamp}@example.com",
            "password": test_user_password
        },
        timeout=10
    )
    
    if response.status_code == 401:
        log_test("Non-existent email returns 401", True, 401)
    else:
        log_test("Non-existent email returns 401", False, response.status_code, 401, 
                detail=response.text[:200])
except Exception as e:
    log_test("Non-existent email returns 401", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 TEST SUITE: GET /api/auth/me")
print("-" * 80)

# Test 10: Valid token (200)
print("\n🔟 Testing valid token...")
if test_user_token is None:
    log_test("Valid token returns 200 with user (no password_hash)", False, detail="Skipped - no valid token from registration")
else:
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {test_user_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            user = response.json()
            
            # Verify password_hash is NOT present
            has_password_hash = "password_hash" in user
            has_id = "id" in user
            has_email = "email" in user
            
            if not has_password_hash and has_id and has_email:
                log_test("Valid token returns 200 with user (no password_hash)", True, 200)
            else:
                issues = []
                if has_password_hash:
                    issues.append("password_hash exposed")
                if not has_id:
                    issues.append("missing id")
                if not has_email:
                    issues.append("missing email")
                log_test("Valid token returns 200 with user (no password_hash)", False, 200, 
                        detail="; ".join(issues))
        else:
            log_test("Valid token returns 200", False, response.status_code, 200, 
                    detail=response.text[:200])
    except Exception as e:
        log_test("Valid token returns 200", False, detail=f"Exception: {str(e)}")

# Test 11: Missing token (401)
print("\n1️⃣1️⃣  Testing missing token...")
try:
    response = requests.get(
        f"{BASE_URL}/auth/me",
        timeout=10
    )
    
    if response.status_code == 401:
        log_test("Missing token returns 401", True, 401)
    else:
        log_test("Missing token returns 401", False, response.status_code, 401, 
                detail=response.text[:200])
except Exception as e:
    log_test("Missing token returns 401", False, detail=f"Exception: {str(e)}")

# Test 12: Invalid/garbage token (401)
print("\n1️⃣2️⃣  Testing invalid token...")
try:
    response = requests.get(
        f"{BASE_URL}/auth/me",
        headers={"Authorization": "Bearer invalid_garbage_token_12345"},
        timeout=10
    )
    
    if response.status_code == 401:
        log_test("Invalid token returns 401", True, 401)
    else:
        log_test("Invalid token returns 401", False, response.status_code, 401, 
                detail=response.text[:200])
except Exception as e:
    log_test("Invalid token returns 401", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 TEST SUITE: Admin & Role Gating")
print("-" * 80)

# Test 13: Admin login
print("\n1️⃣3️⃣  Testing admin login...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": "admin@easyx.com",
            "password": "Admin@Easyx2026"
        },
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        user = data.get("user", {})
        role = user.get("role")
        
        if role == "admin":
            log_test("Admin login returns role='admin'", True, 200)
            admin_token = data["access_token"]
        else:
            log_test("Admin login returns role='admin'", False, 200, 
                    detail=f"role is '{role}' not 'admin'")
    else:
        log_test("Admin login returns role='admin'", False, response.status_code, 200, 
                detail=response.text[:200])
except Exception as e:
    log_test("Admin login returns role='admin'", False, detail=f"Exception: {str(e)}")

# Test 14: Normal user has role='user'
print("\n1️⃣4️⃣  Testing normal user role...")
if test_user_token is None:
    log_test("Normal user has role='user'", False, detail="Skipped - no valid token from registration")
else:
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {test_user_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            user = response.json()
            role = user.get("role")
            
            if role == "user":
                log_test("Normal user has role='user'", True, 200)
            else:
                log_test("Normal user has role='user'", False, 200, 
                        detail=f"role is '{role}' not 'user'")
        else:
            log_test("Normal user has role='user'", False, response.status_code, 200, 
                    detail=response.text[:200])
    except Exception as e:
        log_test("Normal user has role='user'", False, detail=f"Exception: {str(e)}")

# Final summary
print("\n" + "=" * 80)
print("\n📊 TEST SUMMARY")
print("=" * 80)
print(f"✅ Passed: {passed}")
print(f"❌ Failed: {failed}")
print(f"📈 Total: {passed + failed}")
print(f"🎯 Success Rate: {(passed / (passed + failed) * 100):.1f}%")
print("=" * 80)

# Exit with appropriate code
exit(0 if failed == 0 else 1)
