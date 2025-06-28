# Create a comprehensive backend architecture and ML trust scoring system for Sure Circle

# First, let's create the database schema design
database_schema = {
    "users": {
        "user_id": "UUID PRIMARY KEY",
        "email": "VARCHAR(255) UNIQUE NOT NULL",
        "phone": "VARCHAR(20) UNIQUE",
        "name": "VARCHAR(255) NOT NULL",
        "avatar_url": "TEXT",
        "date_of_birth": "DATE",
        "address": "TEXT",
        "city": "VARCHAR(100)",
        "state": "VARCHAR(100)",
        "pincode": "VARCHAR(10)",
        "kyc_status": "ENUM('pending', 'verified', 'rejected')",
        "kyc_documents": "JSON",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    },
    "pools": {
        "pool_id": "UUID PRIMARY KEY",
        "name": "VARCHAR(255) NOT NULL",
        "description": "TEXT",
        "category": "VARCHAR(100)",
        "created_by": "UUID REFERENCES users(user_id)",
        "max_members": "INTEGER",
        "monthly_contribution": "DECIMAL(10,2)",
        "coverage_limit": "DECIMAL(12,2)",
        "deductible": "DECIMAL(10,2)",
        "governance_type": "ENUM('majority_vote', 'peer_review', 'external_arbitration')",
        "trust_threshold": "INTEGER",
        "pool_rules": "JSON",
        "status": "ENUM('active', 'inactive', 'closed')",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "pool_members": {
        "id": "UUID PRIMARY KEY",
        "pool_id": "UUID REFERENCES pools(pool_id)",
        "user_id": "UUID REFERENCES users(user_id)",
        "joined_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "status": "ENUM('active', 'inactive', 'suspended')",
        "total_contributed": "DECIMAL(12,2) DEFAULT 0",
        "role": "ENUM('member', 'admin', 'moderator')"
    },
    "contributions": {
        "contribution_id": "UUID PRIMARY KEY",
        "pool_id": "UUID REFERENCES pools(pool_id)",
        "user_id": "UUID REFERENCES users(user_id)",
        "amount": "DECIMAL(10,2)",
        "transaction_id": "VARCHAR(255)",
        "payment_method": "VARCHAR(50)",
        "status": "ENUM('pending', 'successful', 'failed')",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "claims": {
        "claim_id": "UUID PRIMARY KEY",
        "pool_id": "UUID REFERENCES pools(pool_id)",
        "claimant_id": "UUID REFERENCES users(user_id)",
        "amount_requested": "DECIMAL(10,2)",
        "description": "TEXT",
        "category": "VARCHAR(100)",
        "incident_date": "DATE",
        "evidence_urls": "JSON",
        "status": "ENUM('submitted', 'under_review', 'voting', 'approved', 'rejected', 'paid')",
        "votes_for": "INTEGER DEFAULT 0",
        "votes_against": "INTEGER DEFAULT 0",
        "total_votes_required": "INTEGER",
        "reviewer_notes": "TEXT",
        "approved_amount": "DECIMAL(10,2)",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "resolved_at": "TIMESTAMP"
    },
    "claim_votes": {
        "vote_id": "UUID PRIMARY KEY",
        "claim_id": "UUID REFERENCES claims(claim_id)",
        "voter_id": "UUID REFERENCES users(user_id)",
        "vote": "ENUM('approve', 'reject')",
        "reason": "TEXT",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "trust_scores": {
        "id": "UUID PRIMARY KEY",
        "user_id": "UUID REFERENCES users(user_id)",
        "score": "INTEGER",
        "factors": "JSON",
        "calculated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "user_activities": {
        "activity_id": "UUID PRIMARY KEY",
        "user_id": "UUID REFERENCES users(user_id)",
        "activity_type": "VARCHAR(100)",
        "description": "TEXT",
        "metadata": "JSON",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    }
}

print("✅ Database Schema Created")
print(f"Total Tables: {len(database_schema)}")
for table, fields in database_schema.items():
    print(f"  📊 {table}: {len(fields)} fields")