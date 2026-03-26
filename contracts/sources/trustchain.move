module trustchain::trust_system {
    use one::object::{Self, UID};
    use one::tx_context::{Self, TxContext};
    use one::transfer;
    use one::event;
    use std::string::{Self, String};
    use one::coin::{Self, Coin};
    use one::one::ONE;
    use one::balance::{Self, Balance};
    use one::table::{Self, Table};

    // Error codes
    const EInsufficientReputation: u64 = 1;
    const EUnauthorized: u64 = 2;
    const EInvalidScore: u64 = 3;

    // Structs
    public struct TrustProfile has key, store {
        id: UID,
        owner: address,
        username: String,
        trust_score: u64,
        total_interactions: u64,
        positive_interactions: u64,
        badges: vector<String>,
        created_at: u64,
    }

    public struct TrustBadge has key, store {
        id: UID,
        owner: address,
        badge_name: String,
        badge_type: String,
        issued_at: u64,
        issuer: address,
    }

    public struct TrustRegistry has key {
        id: UID,
        profiles: Table<address, bool>,
        total_profiles: u64,
        admin: address,
    }

    // Events
    public struct ProfileCreated has copy, drop {
        profile_id: address,
        owner: address,
        username: String,
    }

    public struct TrustScoreUpdated has copy, drop {
        profile_owner: address,
        old_score: u64,
        new_score: u64,
    }

    public struct BadgeIssued has copy, drop {
        badge_id: address,
        recipient: address,
        badge_name: String,
    }

    // Initialize registry
    fun init(ctx: &mut TxContext) {
        let registry = TrustRegistry {
            id: object::new(ctx),
            profiles: table::new(ctx),
            total_profiles: 0,
            admin: tx_context::sender(ctx),
        };
        transfer::share_object(registry);
    }

    // Create trust profile
    public entry fun create_profile(
        registry: &mut TrustRegistry,
        username: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        let profile = TrustProfile {
            id: object::new(ctx),
            owner: sender,
            username,
            trust_score: 50, // Starting score
            total_interactions: 0,
            positive_interactions: 0,
            badges: vector::empty(),
            created_at: tx_context::epoch(ctx),
        };

        let profile_addr = object::uid_to_address(&profile.id);
        
        event::emit(ProfileCreated {
            profile_id: profile_addr,
            owner: sender,
            username: profile.username,
        });

        table::add(&mut registry.profiles, sender, true);
        registry.total_profiles = registry.total_profiles + 1;

        transfer::transfer(profile, sender);
    }

    // Update trust score (AI-driven)
    public entry fun update_trust_score(
        profile: &mut TrustProfile,
        new_score: u64,
        is_positive: bool,
        ctx: &mut TxContext
    ) {
        assert!(new_score <= 100, EInvalidScore);
        
        let old_score = profile.trust_score;
        profile.trust_score = new_score;
        profile.total_interactions = profile.total_interactions + 1;
        
        if (is_positive) {
            profile.positive_interactions = profile.positive_interactions + 1;
        };

        event::emit(TrustScoreUpdated {
            profile_owner: profile.owner,
            old_score,
            new_score,
        });
    }

    // Issue badge NFT
    public entry fun issue_badge(
        profile: &mut TrustProfile,
        badge_name: String,
        badge_type: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        let badge = TrustBadge {
            id: object::new(ctx),
            owner: profile.owner,
            badge_name: badge_name,
            badge_type: badge_type,
            issued_at: tx_context::epoch(ctx),
            issuer: sender,
        };

        let badge_addr = object::uid_to_address(&badge.id);
        
        vector::push_back(&mut profile.badges, badge_name);

        event::emit(BadgeIssued {
            badge_id: badge_addr,
            recipient: profile.owner,
            badge_name: badge.badge_name,
        });

        transfer::transfer(badge, profile.owner);
    }

    // View functions
    public fun get_trust_score(profile: &TrustProfile): u64 {
        profile.trust_score
    }

    public fun get_total_interactions(profile: &TrustProfile): u64 {
        profile.total_interactions
    }

    public fun get_username(profile: &TrustProfile): String {
        profile.username
    }
}
