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

################################################################################
# PHASE 3: FINANCIAL BACKEND TESTS
# Dashboard + Invest Engine + Wallet Ledger + Admin Adjust
################################################################################

print("\n" + "=" * 80)
print("\n💰 PHASE 3: FINANCIAL BACKEND TESTS")
print("=" * 80)

# Create fresh test user for Phase 3
phase3_timestamp = int(time.time() * 1000)
phase3_user_email = f"investor{phase3_timestamp}@example.com"
phase3_user_phone = f"+91{phase3_timestamp % 10000000000}"
phase3_user_password = "Invest123!"
phase3_user_name = "Phase3 Investor"

phase3_user_token = None
phase3_user_id = None

print(f"\n🔧 Setting up Phase 3 test user: {phase3_user_email}")

# Register Phase 3 user
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": phase3_user_name,
            "email": phase3_user_email,
            "phone": phase3_user_phone,
            "password": phase3_user_password
        },
        timeout=10
    )
    if response.status_code == 201:
        data = response.json()
        phase3_user_token = data["access_token"]
        phase3_user_id = data["user"]["id"]
        print(f"✅ Phase 3 user registered: ID={phase3_user_id}")
    else:
        print(f"❌ Failed to register Phase 3 user: {response.status_code}")
        exit(1)
except Exception as e:
    print(f"❌ Exception registering Phase 3 user: {str(e)}")
    exit(1)

# Get admin token for Phase 3 tests
phase3_admin_token = None
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "admin@easyx.com", "password": "Admin@Easyx2026"},
        timeout=10
    )
    if response.status_code == 200:
        phase3_admin_token = response.json()["access_token"]
        print(f"✅ Admin token obtained for Phase 3")
    else:
        print(f"❌ Failed to get admin token: {response.status_code}")
        exit(1)
except Exception as e:
    print(f"❌ Exception getting admin token: {str(e)}")
    exit(1)

print("\n" + "=" * 80)
print("\n📋 SCENARIO 1: New user GET /api/plans - all locked, exact amounts")
print("-" * 80)

try:
    response = requests.get(
        f"{BASE_URL}/plans",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        timeout=10
    )
    
    if response.status_code == 200:
        plans = response.json()
        
        # Check we have 4 plans
        if len(plans) == 4:
            log_test("GET /api/plans returns 4 plans", True, 200)
        else:
            log_test("GET /api/plans returns 4 plans", False, 200, detail=f"Got {len(plans)} plans")
        
        # Check all unlocked=false
        all_locked = all(not p.get("unlocked", True) for p in plans)
        log_test("All plans unlocked=false for new user", all_locked, 200)
        
        # Find each plan and verify exact amounts
        plan_map = {p["key"]: p for p in plans}
        
        expected = {
            "silver": {"price": "300.00", "profit_amount": "180.00", "maturity_amount": "480.00"},
            "gold": {"price": "1000.00", "profit_amount": "600.00", "maturity_amount": "1600.00"},
            "platinum": {"price": "5000.00", "profit_amount": "5000.00", "maturity_amount": "10000.00"},
            "diamond": {"price": "10000.00", "profit_amount": "10000.00", "maturity_amount": "20000.00"}
        }
        
        for key, exp in expected.items():
            if key in plan_map:
                p = plan_map[key]
                price_ok = p.get("price") == exp["price"]
                profit_ok = p.get("profit_amount") == exp["profit_amount"]
                maturity_ok = p.get("maturity_amount") == exp["maturity_amount"]
                
                if price_ok and profit_ok and maturity_ok:
                    log_test(f"Plan {key} amounts correct", True, 200, 
                            detail=f"price={exp['price']}, profit={exp['profit_amount']}, maturity={exp['maturity_amount']}")
                else:
                    log_test(f"Plan {key} amounts correct", False, 200,
                            detail=f"Got price={p.get('price')}, profit={p.get('profit_amount')}, maturity={p.get('maturity_amount')}")
            else:
                log_test(f"Plan {key} exists", False, 200, detail=f"Plan {key} not found")
    else:
        log_test("GET /api/plans", False, response.status_code, 200)
except Exception as e:
    log_test("GET /api/plans", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 2: Buy with 0 balance -> 402 insufficient_balance")
print("-" * 80)

try:
    response = requests.post(
        f"{BASE_URL}/investments",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        json={"plan_key": "silver"},
        timeout=10
    )
    
    if response.status_code == 402:
        data = response.json()
        detail = data.get("detail", {})
        
        code_ok = detail.get("code") == "insufficient_balance"
        required_ok = detail.get("required") == "300.00"
        available_ok = detail.get("available") == "0.00"
        
        log_test("Buy with 0 balance returns 402", True, 402)
        log_test("Error code is 'insufficient_balance'", code_ok, 402, detail=f"Got code={detail.get('code')}")
        log_test("Required amount is '300.00'", required_ok, 402, detail=f"Got required={detail.get('required')}")
        log_test("Available amount is '0.00'", available_ok, 402, detail=f"Got available={detail.get('available')}")
    else:
        log_test("Buy with 0 balance returns 402", False, response.status_code, 402)
except Exception as e:
    log_test("Buy with 0 balance", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 3: Admin credit 700 -> wallet shows 700.00")
print("-" * 80)

try:
    response = requests.post(
        f"{BASE_URL}/admin/wallet/adjust",
        headers={"Authorization": f"Bearer {phase3_admin_token}"},
        json={
            "user_id": phase3_user_id,
            "amount": "700",
            "direction": "credit",
            "note": "Test funding"
        },
        timeout=10
    )
    
    if response.status_code == 200:
        log_test("Admin credit 700 succeeds", True, 200)
        
        # Check wallet balance
        wallet_response = requests.get(
            f"{BASE_URL}/wallet",
            headers={"Authorization": f"Bearer {phase3_user_token}"},
            timeout=10
        )
        
        if wallet_response.status_code == 200:
            wallet = wallet_response.json()
            balance = wallet.get("available_balance")
            
            if balance == "700.00":
                log_test("Wallet available_balance is '700.00'", True, 200)
            else:
                log_test("Wallet available_balance is '700.00'", False, 200, detail=f"Got {balance}")
        else:
            log_test("GET /api/wallet after credit", False, wallet_response.status_code, 200)
    else:
        log_test("Admin credit 700", False, response.status_code, 200)
except Exception as e:
    log_test("Admin credit", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 4: Idempotency - same key twice = 1 investment, 1 debit")
print("-" * 80)

investment_id_1 = None
investment_id_2 = None

try:
    # First POST with idempotency_key="K1"
    response1 = requests.post(
        f"{BASE_URL}/investments",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        json={"plan_key": "silver", "idempotency_key": "K1"},
        timeout=10
    )
    
    if response1.status_code == 201:
        data1 = response1.json()
        investment_id_1 = data1.get("id")
        log_test("First POST /api/investments with key='K1' returns 201", True, 201)
    else:
        log_test("First POST /api/investments", False, response1.status_code, 201)
    
    # Second POST with same idempotency_key="K1"
    response2 = requests.post(
        f"{BASE_URL}/investments",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        json={"plan_key": "silver", "idempotency_key": "K1"},
        timeout=10
    )
    
    if response2.status_code == 201:
        data2 = response2.json()
        investment_id_2 = data2.get("id")
        log_test("Second POST /api/investments with key='K1' returns 201", True, 201)
        
        # Check both return same investment ID
        if investment_id_1 == investment_id_2:
            log_test("Both requests return SAME investment ID", True, 201, detail=f"ID={investment_id_1}")
        else:
            log_test("Both requests return SAME investment ID", False, 201, 
                    detail=f"ID1={investment_id_1}, ID2={investment_id_2}")
    else:
        log_test("Second POST /api/investments", False, response2.status_code, 201)
    
    # Check wallet balance is 400.00 (700 - 300, only ONE debit)
    wallet_response = requests.get(
        f"{BASE_URL}/wallet",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        timeout=10
    )
    
    if wallet_response.status_code == 200:
        wallet = wallet_response.json()
        balance = wallet.get("available_balance")
        invested = wallet.get("total_invested")
        
        if balance == "400.00":
            log_test("Wallet available_balance is '400.00' (only ONE debit)", True, 200)
        else:
            log_test("Wallet available_balance is '400.00'", False, 200, detail=f"Got {balance}")
        
        if invested == "300.00":
            log_test("Wallet total_invested is '300.00'", True, 200)
        else:
            log_test("Wallet total_invested is '300.00'", False, 200, detail=f"Got {invested}")
    else:
        log_test("GET /api/wallet after idempotent buy", False, wallet_response.status_code, 200)
    
    # Check transactions - should have exactly 1 investment_debit (plus 1 admin credit)
    tx_response = requests.get(
        f"{BASE_URL}/transactions",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        timeout=10
    )
    
    if tx_response.status_code == 200:
        transactions = tx_response.json()
        investment_debits = [t for t in transactions if t.get("type") == "investment_debit"]
        
        if len(investment_debits) == 1:
            log_test("Exactly 1 investment_debit transaction", True, 200)
            
            if investment_debits[0].get("amount") == "300.00":
                log_test("Investment debit amount is '300.00'", True, 200)
            else:
                log_test("Investment debit amount is '300.00'", False, 200, 
                        detail=f"Got {investment_debits[0].get('amount')}")
        else:
            log_test("Exactly 1 investment_debit transaction", False, 200, 
                    detail=f"Found {len(investment_debits)} debits")
    else:
        log_test("GET /api/transactions", False, tx_response.status_code, 200)
        
except Exception as e:
    log_test("Idempotency test", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 5: GET /api/plans - silver unlocked, others locked")
print("-" * 80)

try:
    response = requests.get(
        f"{BASE_URL}/plans",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        timeout=10
    )
    
    if response.status_code == 200:
        plans = response.json()
        plan_map = {p["key"]: p for p in plans}
        
        # Check silver
        if "silver" in plan_map:
            silver = plan_map["silver"]
            
            unlocked_ok = silver.get("unlocked") == True
            cards_ok = silver.get("cards") == 1
            total_invested_ok = silver.get("total_invested") == "300.00"
            active_ok = silver.get("active_investments") == 1
            profit_ok = silver.get("expected_profit") == "180.00"
            maturity_ok = silver.get("expected_maturity") == "480.00"
            has_next_maturity = silver.get("next_maturity") is not None
            
            log_test("Silver unlocked=true", unlocked_ok, 200, detail=f"Got {silver.get('unlocked')}")
            log_test("Silver cards=1", cards_ok, 200, detail=f"Got {silver.get('cards')}")
            log_test("Silver total_invested='300.00'", total_invested_ok, 200, detail=f"Got {silver.get('total_invested')}")
            log_test("Silver active_investments=1", active_ok, 200, detail=f"Got {silver.get('active_investments')}")
            log_test("Silver expected_profit='180.00'", profit_ok, 200, detail=f"Got {silver.get('expected_profit')}")
            log_test("Silver expected_maturity='480.00'", maturity_ok, 200, detail=f"Got {silver.get('expected_maturity')}")
            log_test("Silver next_maturity is set", has_next_maturity, 200, detail=f"Got {silver.get('next_maturity')}")
        else:
            log_test("Silver plan exists", False, 200)
        
        # Check gold, platinum, diamond still locked
        for key in ["gold", "platinum", "diamond"]:
            if key in plan_map:
                locked = not plan_map[key].get("unlocked", True)
                log_test(f"{key.capitalize()} unlocked=false", locked, 200, 
                        detail=f"Got unlocked={plan_map[key].get('unlocked')}")
            else:
                log_test(f"{key.capitalize()} plan exists", False, 200)
    else:
        log_test("GET /api/plans after purchase", False, response.status_code, 200)
except Exception as e:
    log_test("GET /api/plans after purchase", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 6: GET /api/investments - 1 active, ~60 days, principal 300.00")
print("-" * 80)

try:
    response = requests.get(
        f"{BASE_URL}/investments",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        timeout=10
    )
    
    if response.status_code == 200:
        investments = response.json()
        
        if len(investments) == 1:
            log_test("Exactly 1 investment returned", True, 200)
            
            inv = investments[0]
            status_ok = inv.get("status") == "active"
            principal_ok = inv.get("principal") == "300.00"
            remaining = inv.get("remaining_days", 0)
            remaining_ok = 59 <= remaining <= 60
            has_maturity = inv.get("maturity_at") is not None
            
            log_test("Investment status='active'", status_ok, 200, detail=f"Got {inv.get('status')}")
            log_test("Investment principal='300.00'", principal_ok, 200, detail=f"Got {inv.get('principal')}")
            log_test("Investment remaining_days between 59-60", remaining_ok, 200, detail=f"Got {remaining} days")
            log_test("Investment has maturity_at", has_maturity, 200, detail=f"Got {inv.get('maturity_at')}")
        else:
            log_test("Exactly 1 investment returned", False, 200, detail=f"Got {len(investments)} investments")
    else:
        log_test("GET /api/investments", False, response.status_code, 200)
except Exception as e:
    log_test("GET /api/investments", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 7: Buy another silver (new key) -> cards=2, wallet=100.00")
print("-" * 80)

try:
    response = requests.post(
        f"{BASE_URL}/investments",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        json={"plan_key": "silver", "idempotency_key": "K2"},
        timeout=10
    )
    
    if response.status_code == 201:
        log_test("Second silver purchase returns 201", True, 201)
        
        # Check plans - silver should have cards=2
        plans_response = requests.get(
            f"{BASE_URL}/plans",
            headers={"Authorization": f"Bearer {phase3_user_token}"},
            timeout=10
        )
        
        if plans_response.status_code == 200:
            plans = plans_response.json()
            silver = next((p for p in plans if p["key"] == "silver"), None)
            
            if silver:
                cards_ok = silver.get("cards") == 2
                log_test("Silver cards=2 after second purchase", cards_ok, 200, detail=f"Got {silver.get('cards')}")
            else:
                log_test("Silver plan found", False, 200)
        
        # Check wallet balance = 100.00 (400 - 300)
        wallet_response = requests.get(
            f"{BASE_URL}/wallet",
            headers={"Authorization": f"Bearer {phase3_user_token}"},
            timeout=10
        )
        
        if wallet_response.status_code == 200:
            wallet = wallet_response.json()
            balance = wallet.get("available_balance")
            
            if balance == "100.00":
                log_test("Wallet available_balance='100.00' after 2nd purchase", True, 200)
            else:
                log_test("Wallet available_balance='100.00'", False, 200, detail=f"Got {balance}")
        else:
            log_test("GET /api/wallet after 2nd purchase", False, wallet_response.status_code, 200)
    else:
        log_test("Second silver purchase", False, response.status_code, 201)
except Exception as e:
    log_test("Second silver purchase", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 8: Buy gold (needs 1000, only 100 available) -> 402")
print("-" * 80)

try:
    response = requests.post(
        f"{BASE_URL}/investments",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        json={"plan_key": "gold"},
        timeout=10
    )
    
    if response.status_code == 402:
        log_test("Buy gold with insufficient balance returns 402", True, 402)
        
        data = response.json()
        detail = data.get("detail", {})
        
        code_ok = detail.get("code") == "insufficient_balance"
        log_test("Error code is 'insufficient_balance'", code_ok, 402, detail=f"Got {detail.get('code')}")
    else:
        log_test("Buy gold with insufficient balance", False, response.status_code, 402)
except Exception as e:
    log_test("Buy gold insufficient balance", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 9: Data isolation - user B cannot see user A data")
print("-" * 80)

# Register second user (user B)
userB_timestamp = int(time.time() * 1000) + 999
userB_email = f"userB{userB_timestamp}@example.com"
userB_phone = f"+91{userB_timestamp % 10000000000}"
userB_token = None

try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": "User B",
            "email": userB_email,
            "phone": userB_phone,
            "password": "UserB123!"
        },
        timeout=10
    )
    
    if response.status_code == 201:
        userB_token = response.json()["access_token"]
        log_test("User B registered successfully", True, 201)
        
        # Check user B's investments (should be empty)
        inv_response = requests.get(
            f"{BASE_URL}/investments",
            headers={"Authorization": f"Bearer {userB_token}"},
            timeout=10
        )
        
        if inv_response.status_code == 200:
            investments = inv_response.json()
            
            if len(investments) == 0:
                log_test("User B has 0 investments (isolation)", True, 200)
            else:
                log_test("User B has 0 investments", False, 200, detail=f"Got {len(investments)} investments")
        else:
            log_test("GET /api/investments for user B", False, inv_response.status_code, 200)
        
        # Check user B's wallet (should be 0 balance)
        wallet_response = requests.get(
            f"{BASE_URL}/wallet",
            headers={"Authorization": f"Bearer {userB_token}"},
            timeout=10
        )
        
        if wallet_response.status_code == 200:
            wallet = wallet_response.json()
            balance = wallet.get("available_balance")
            
            if balance == "0.00":
                log_test("User B has 0.00 balance (isolation)", True, 200)
            else:
                log_test("User B has 0.00 balance", False, 200, detail=f"Got {balance}")
        else:
            log_test("GET /api/wallet for user B", False, wallet_response.status_code, 200)
    else:
        log_test("Register user B", False, response.status_code, 201)
except Exception as e:
    log_test("Data isolation test", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 10: Auth/role gating - normal user cannot call admin endpoint")
print("-" * 80)

try:
    # Try to call admin endpoint with normal user token
    response = requests.post(
        f"{BASE_URL}/admin/wallet/adjust",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        json={
            "user_id": phase3_user_id,
            "amount": "100",
            "direction": "credit",
            "note": "Unauthorized attempt"
        },
        timeout=10
    )
    
    if response.status_code == 403:
        log_test("Normal user calling admin endpoint returns 403", True, 403)
    else:
        log_test("Normal user calling admin endpoint", False, response.status_code, 403)
except Exception as e:
    log_test("Admin endpoint auth test", False, detail=f"Exception: {str(e)}")

# Test missing token -> 401
try:
    response = requests.get(
        f"{BASE_URL}/dashboard",
        timeout=10
    )
    
    if response.status_code == 401:
        log_test("Missing token returns 401", True, 401)
    else:
        log_test("Missing token returns 401", False, response.status_code, 401)
except Exception as e:
    log_test("Missing token test", False, detail=f"Exception: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 SCENARIO 11: All monetary fields are plain decimal strings")
print("-" * 80)

try:
    # Check wallet response
    wallet_response = requests.get(
        f"{BASE_URL}/wallet",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        timeout=10
    )
    
    if wallet_response.status_code == 200:
        wallet = wallet_response.json()
        
        # Check all monetary fields are strings with 2 decimal places
        balance = wallet.get("available_balance")
        invested = wallet.get("total_invested")
        earned = wallet.get("total_earned")
        
        balance_ok = isinstance(balance, str) and "." in balance and len(balance.split(".")[-1]) == 2
        invested_ok = isinstance(invested, str) and "." in invested and len(invested.split(".")[-1]) == 2
        earned_ok = isinstance(earned, str) and "." in earned and len(earned.split(".")[-1]) == 2
        
        # Check no Decimal128 leakage (no {"$numberDecimal": ...})
        no_decimal128 = "$numberDecimal" not in str(wallet)
        
        log_test("Wallet balance is plain decimal string", balance_ok, 200, detail=f"Got {balance}")
        log_test("Wallet total_invested is plain decimal string", invested_ok, 200, detail=f"Got {invested}")
        log_test("Wallet total_earned is plain decimal string", earned_ok, 200, detail=f"Got {earned}")
        log_test("No Decimal128 leakage in wallet", no_decimal128, 200)
    else:
        log_test("GET /api/wallet for decimal check", False, wallet_response.status_code, 200)
    
    # Check plans response
    plans_response = requests.get(
        f"{BASE_URL}/plans",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        timeout=10
    )
    
    if plans_response.status_code == 200:
        plans = plans_response.json()
        
        # Check all monetary fields in all plans
        all_strings = True
        no_decimal128 = "$numberDecimal" not in str(plans)
        
        for plan in plans:
            for field in ["price", "profit_amount", "maturity_amount", "total_invested", "expected_profit", "expected_maturity"]:
                value = plan.get(field)
                if value and value != "0.00":
                    if not (isinstance(value, str) and "." in value):
                        all_strings = False
                        break
        
        log_test("All plan monetary fields are plain decimal strings", all_strings, 200)
        log_test("No Decimal128 leakage in plans", no_decimal128, 200)
    else:
        log_test("GET /api/plans for decimal check", False, plans_response.status_code, 200)
    
    # Check investments response
    inv_response = requests.get(
        f"{BASE_URL}/investments",
        headers={"Authorization": f"Bearer {phase3_user_token}"},
        timeout=10
    )
    
    if inv_response.status_code == 200:
        investments = inv_response.json()
        
        all_strings = True
        no_decimal128 = "$numberDecimal" not in str(investments)
        
        for inv in investments:
            for field in ["principal", "profit_amount", "maturity_amount"]:
                value = inv.get(field)
                if value:
                    if not (isinstance(value, str) and "." in value):
                        all_strings = False
                        break
        
        log_test("All investment monetary fields are plain decimal strings", all_strings, 200)
        log_test("No Decimal128 leakage in investments", no_decimal128, 200)
    else:
        log_test("GET /api/investments for decimal check", False, inv_response.status_code, 200)
        
except Exception as e:
    log_test("Decimal format check", False, detail=f"Exception: {str(e)}")

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
