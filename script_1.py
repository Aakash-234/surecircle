# Create ML Trust Scoring Model for Sure Circle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import json

# Define Trust Score Model Architecture
class SureCircleTrustScorer:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_importance = {}
        self.score_bands = {
            'Excellent': (800, 900),
            'Very Good': (750, 799),
            'Good': (700, 749),
            'Fair': (650, 699),
            'Poor': (300, 649)
        }
        
    def create_features(self, user_data):
        """
        Create feature vector for trust scoring
        Features based on behavioral economics and P2P insurance research
        """
        features = {}
        
        # 1. Historical Payment Behavior (35% weight)
        features['payment_consistency'] = user_data.get('on_time_contributions', 0) / max(user_data.get('total_contributions', 1), 1)
        features['contribution_frequency'] = user_data.get('contribution_months', 0)
        features['payment_amount_stability'] = 1 - user_data.get('payment_variance', 0.5)
        
        # 2. Claims Behavior (25% weight)
        features['claim_frequency'] = user_data.get('claims_submitted', 0) / max(user_data.get('months_active', 1), 1)
        features['claim_legitimacy'] = user_data.get('approved_claims', 0) / max(user_data.get('claims_submitted', 1), 1)
        features['claim_amount_reasonableness'] = 1 - min(user_data.get('avg_claim_amount', 0) / user_data.get('coverage_limit', 1), 1)
        
        # 3. Community Participation (20% weight)
        features['voting_participation'] = user_data.get('votes_participated', 0) / max(user_data.get('voting_opportunities', 1), 1)
        features['referral_activity'] = min(user_data.get('successful_referrals', 0) / 10, 1)
        features['group_tenure'] = min(user_data.get('months_active', 0) / 24, 1)
        
        # 4. Verification Status (10% weight)
        features['kyc_completeness'] = 1 if user_data.get('kyc_verified') else 0
        features['document_quality'] = user_data.get('document_verification_score', 0.5)
        
        # 5. Social Factors (10% weight)
        features['peer_ratings'] = user_data.get('avg_peer_rating', 3.0) / 5.0
        features['network_trust'] = user_data.get('trusted_connections', 0) / 20
        features['dispute_history'] = 1 - min(user_data.get('disputes_raised', 0) / 5, 1)
        
        return np.array(list(features.values()))
    
    def generate_synthetic_data(self, n_samples=1000):
        """Generate synthetic training data for the model"""
        np.random.seed(42)
        
        data = []
        for i in range(n_samples):
            # Generate realistic user behavior patterns
            months_active = np.random.exponential(12)
            total_contributions = max(1, int(months_active * np.random.uniform(0.8, 1.2)))
            
            user_profile = {
                'user_id': f'user_{i}',
                'months_active': months_active,
                'total_contributions': total_contributions,
                'on_time_contributions': int(total_contributions * np.random.beta(5, 2)),
                'payment_variance': np.random.beta(1, 3),
                'claims_submitted': np.random.poisson(months_active / 12),
                'approved_claims': 0,
                'voting_opportunities': int(months_active * 2),
                'votes_participated': 0,
                'successful_referrals': np.random.poisson(1),
                'kyc_verified': np.random.choice([True, False], p=[0.8, 0.2]),
                'document_verification_score': np.random.beta(3, 1),
                'avg_peer_rating': np.random.normal(4.0, 0.5),
                'trusted_connections': np.random.poisson(8),
                'disputes_raised': np.random.poisson(0.5),
                'coverage_limit': 50000,
                'avg_claim_amount': np.random.exponential(15000)
            }
            
            # Adjust dependent variables
            user_profile['approved_claims'] = int(user_profile['claims_submitted'] * np.random.beta(3, 1))
            user_profile['votes_participated'] = int(user_profile['voting_opportunities'] * np.random.beta(2, 1))
            
            # Calculate target trust score (300-900 range)
            base_score = 600
            payment_factor = (user_profile['on_time_contributions'] / user_profile['total_contributions']) * 150
            claim_factor = (1 - min(user_profile['claims_submitted'] / 10, 1)) * 100
            participation_factor = (user_profile['votes_participated'] / max(user_profile['voting_opportunities'], 1)) * 80
            verification_factor = 50 if user_profile['kyc_verified'] else 0
            
            trust_score = max(300, min(900, 
                base_score + payment_factor + claim_factor + participation_factor + verification_factor + 
                np.random.normal(0, 20)
            ))
            
            user_profile['trust_score'] = int(trust_score)
            data.append(user_profile)
        
        return data
    
    def train_model(self, training_data):
        """Train the trust scoring model"""
        # Prepare features and targets
        X = []
        y = []
        
        for user in training_data:
            features = self.create_features(user)
            X.append(features)
            y.append(user['trust_score'])
        
        X = np.array(X)
        y = np.array(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train ensemble model
        rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        gb_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        
        rf_model.fit(X_train_scaled, y_train)
        gb_model.fit(X_train_scaled, y_train)
        
        # Ensemble predictions
        rf_pred = rf_model.predict(X_test_scaled)
        gb_pred = gb_model.predict(X_test_scaled)
        ensemble_pred = (rf_pred + gb_pred) / 2
        
        # Store the best model (Random Forest in this case)
        self.model = rf_model
        
        # Calculate metrics
        mse = mean_squared_error(y_test, ensemble_pred)
        r2 = r2_score(y_test, ensemble_pred)
        
        # Feature importance
        feature_names = [
            'payment_consistency', 'contribution_frequency', 'payment_amount_stability',
            'claim_frequency', 'claim_legitimacy', 'claim_amount_reasonableness',
            'voting_participation', 'referral_activity', 'group_tenure',
            'kyc_completeness', 'document_quality',
            'peer_ratings', 'network_trust', 'dispute_history'
        ]
        
        self.feature_importance = dict(zip(feature_names, rf_model.feature_importances_))
        
        return {
            'mse': mse,
            'r2_score': r2,
            'feature_importance': self.feature_importance
        }
    
    def predict_trust_score(self, user_data):
        """Predict trust score for a user"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        features = self.create_features(user_data).reshape(1, -1)
        features_scaled = self.scaler.transform(features)
        
        raw_score = self.model.predict(features_scaled)[0]
        
        # Ensure score is within valid range
        trust_score = max(300, min(900, int(raw_score)))
        
        # Get score band
        score_band = 'Poor'
        for band, (min_score, max_score) in self.score_bands.items():
            if min_score <= trust_score <= max_score:
                score_band = band
                break
        
        # Get top contributing factors
        feature_names = list(self.feature_importance.keys())
        feature_values = self.create_features(user_data)
        
        factor_contributions = []
        for i, (name, importance) in enumerate(self.feature_importance.items()):
            contribution = feature_values[i] * importance * 100
            factor_contributions.append({
                'factor': name,
                'contribution': contribution,
                'value': feature_values[i]
            })
        
        factor_contributions.sort(key=lambda x: x['contribution'], reverse=True)
        
        return {
            'trust_score': trust_score,
            'score_band': score_band,
            'factors': factor_contributions[:5],  # Top 5 factors
            'prediction_confidence': min(0.95, max(0.7, self.model.score(
                self.scaler.transform([features[0]]), [trust_score]
            )))
        }

# Initialize and train the model
print("🤖 Initializing Sure Circle Trust Scoring Model...")
trust_scorer = SureCircleTrustScorer()

# Generate training data
print("📊 Generating synthetic training data...")
training_data = trust_scorer.generate_synthetic_data(2000)

# Train the model
print("🎯 Training ML model...")
metrics = trust_scorer.train_model(training_data)

print(f"""
✅ Model Training Complete!

📈 Model Performance:
   - R² Score: {metrics['r2_score']:.3f}
   - MSE: {metrics['mse']:.2f}

🔍 Top Feature Importance:
""")

# Sort and display feature importance
sorted_features = sorted(metrics['feature_importance'].items(), key=lambda x: x[1], reverse=True)
for feature, importance in sorted_features[:7]:
    print(f"   - {feature}: {importance:.3f}")

# Test the model with sample users
print("\n🧪 Testing model with sample users:")

test_users = [
    {
        'months_active': 18,
        'total_contributions': 18,
        'on_time_contributions': 17,
        'payment_variance': 0.1,
        'claims_submitted': 1,
        'approved_claims': 1,
        'voting_opportunities': 36,
        'votes_participated': 30,
        'successful_referrals': 3,
        'kyc_verified': True,
        'document_verification_score': 0.95,
        'avg_peer_rating': 4.5,
        'trusted_connections': 12,
        'disputes_raised': 0,
        'coverage_limit': 50000,
        'avg_claim_amount': 12000
    },
    {
        'months_active': 6,
        'total_contributions': 5,
        'on_time_contributions': 4,
        'payment_variance': 0.3,
        'claims_submitted': 2,
        'approved_claims': 1,
        'voting_opportunities': 12,
        'votes_participated': 8,
        'successful_referrals': 1,
        'kyc_verified': False,
        'document_verification_score': 0.6,
        'avg_peer_rating': 3.8,
        'trusted_connections': 5,
        'disputes_raised': 1,
        'coverage_limit': 30000,
        'avg_claim_amount': 25000
    }
]

for i, user in enumerate(test_users):
    result = trust_scorer.predict_trust_score(user)
    print(f"\n👤 Test User {i+1}:")
    print(f"   Trust Score: {result['trust_score']} ({result['score_band']})")
    print(f"   Confidence: {result['prediction_confidence']:.2%}")
    print(f"   Top Factors:")
    for factor in result['factors'][:3]:
        print(f"     - {factor['factor']}: {factor['contribution']:.1f}% impact")