-- =====================================================
-- MediaVerse Database Schema for Supabase
-- =====================================================
-- Run this entire file in the Supabase SQL Editor at:
-- https://rzgalxnpfywtourbuzoq.supabase.co
-- =====================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES (extends Supabase auth.users)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  avatar_letter TEXT DEFAULT 'U',
  avatar_color TEXT DEFAULT '#8B5CF6',
  bio TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  is_creator BOOLEAN DEFAULT FALSE,
  content_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  total_likes BIGINT DEFAULT 0,
  monthly_reach BIGINT DEFAULT 0,
  age_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. CONTENT (videos, reels, images, audio, docs, 3D, live)
-- =====================================================
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('video', 'reel', 'audio', 'image', 'document', '3d', 'live')),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  media_url TEXT,
  duration TEXT, -- e.g. '12:34' or '3:02:15'
  file_size BIGINT, -- in bytes
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count BIGINT DEFAULT 0,
  is_explicit BOOLEAN DEFAULT FALSE,
  is_adult BOOLEAN DEFAULT FALSE,
  content_rating TEXT DEFAULT 'general' CHECK (content_rating IN ('general', 'mature', 'explicit', 'adult')),
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'processing', 'published', 'removed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. CONTENT TAGS
-- =====================================================
CREATE TABLE content_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: no duplicate tags per content
CREATE UNIQUE INDEX idx_content_tags_unique ON content_tags(content_id, tag);

-- =====================================================
-- 4. LIKES
-- =====================================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_likes_unique ON likes(user_id, content_id);

-- =====================================================
-- 5. COMMENTS
-- =====================================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for nested replies
  body TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. FOLLOWS
-- =====================================================
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE UNIQUE INDEX idx_follows_unique ON follows(follower_id, following_id);

-- =====================================================
-- 7. CONVERSATIONS (DM threads)
-- =====================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. CONVERSATION PARTICIPANTS
-- =====================================================
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  last_read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_conversation_participants_unique ON conversation_participants(conversation_id, user_id);

-- =====================================================
-- 9. MESSAGES
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'emoji')),
  media_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. COMMUNITIES
-- =====================================================
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  avatar_letter TEXT DEFAULT 'C',
  avatar_color TEXT DEFAULT '#8B5CF6',
  cover_color TEXT DEFAULT '#1a0533',
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Video', 'Art', 'Music', 'Photo', 'Film', 'Tech', 'Gaming', 'Adult', 'Other')),
  is_adult BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. COMMUNITY MEMBERS
-- =====================================================
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin', 'owner')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_community_members_unique ON community_members(community_id, user_id);

-- =====================================================
-- 12. COMMUNITY POSTS (discussions)
-- =====================================================
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 13. STORIES (ephemeral content - 24h)
-- =====================================================
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  views_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 14. STORY VIEWS
-- =====================================================
CREATE TABLE story_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_story_views_unique ON story_views(story_id, viewer_id);

-- =====================================================
-- 15. SUBSCRIPTION TIERS (creator-defined)
-- =====================================================
CREATE TABLE subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. 'Fan', 'Supporter', 'VIP'
  price_cents INTEGER NOT NULL, -- 499 = $4.99
  color TEXT DEFAULT '#8B5CF6',
  perks TEXT[] DEFAULT '{}', -- array of perk descriptions
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 16. SUBSCRIPTIONS (active subscriptions)
-- =====================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_subscriptions_unique ON subscriptions(subscriber_id, creator_id);

-- =====================================================
-- 17. TIPS
-- =====================================================
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL, -- 500 = $5.00
  message TEXT,
  content_id UUID REFERENCES content(id) ON DELETE SET NULL, -- optional: tip on specific content
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 18. USER SETTINGS
-- =====================================================
CREATE TABLE user_settings (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  -- Content & Safety
  show_explicit BOOLEAN DEFAULT FALSE,
  show_adult BOOLEAN DEFAULT FALSE,
  blur_explicit BOOLEAN DEFAULT TRUE,
  safe_search BOOLEAN DEFAULT TRUE,
  -- Privacy
  private_profile BOOLEAN DEFAULT FALSE,
  hide_activity BOOLEAN DEFAULT FALSE,
  allow_dms BOOLEAN DEFAULT TRUE,
  show_online BOOLEAN DEFAULT TRUE,
  -- Notifications
  push_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  live_alerts BOOLEAN DEFAULT TRUE,
  new_follower_notifications BOOLEAN DEFAULT TRUE,
  mention_notifications BOOLEAN DEFAULT TRUE,
  -- Appearance
  dark_mode BOOLEAN DEFAULT TRUE,
  autoplay_videos BOOLEAN DEFAULT TRUE,
  compact_view BOOLEAN DEFAULT FALSE,
  reduce_motion BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 19. NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention', 'tip', 'subscription', 'community_invite', 'live_start', 'system')),
  title TEXT NOT NULL,
  body TEXT,
  reference_type TEXT, -- 'content', 'comment', 'community', etc.
  reference_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 20. TRENDING TAGS (aggregated)
-- =====================================================
CREATE TABLE trending_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag TEXT UNIQUE NOT NULL,
  post_count BIGINT DEFAULT 0,
  trend_score DOUBLE PRECISION DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- INDEXES for performance
-- =====================================================

-- Content queries
CREATE INDEX idx_content_user_id ON content(user_id);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_created_at ON content(created_at DESC);
CREATE INDEX idx_content_likes_count ON content(likes_count DESC);
CREATE INDEX idx_content_views_count ON content(views_count DESC);
CREATE INDEX idx_content_status ON content(status);

-- Tags search
CREATE INDEX idx_content_tags_tag ON content_tags(tag);

-- Comments
CREATE INDEX idx_comments_content_id ON comments(content_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- Messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Communities
CREATE INDEX idx_communities_category ON communities(category);
CREATE INDEX idx_community_posts_community ON community_posts(community_id, created_at DESC);

-- Stories (filter expired)
CREATE INDEX idx_stories_user_id ON stories(user_id, expires_at DESC);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- Follows
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- Trending
CREATE INDEX idx_trending_tags_score ON trending_tags(trend_score DESC);


-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_tags ENABLE ROW LEVEL SECURITY;

-- PROFILES: anyone can read, owners can update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- CONTENT: published content is viewable by everyone, owners manage their own
CREATE POLICY "Published content is viewable" ON content FOR SELECT USING (status = 'published');
CREATE POLICY "Users can insert own content" ON content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content" ON content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content" ON content FOR DELETE USING (auth.uid() = user_id);

-- CONTENT TAGS: viewable with content, manageable by content owner
CREATE POLICY "Tags are viewable by everyone" ON content_tags FOR SELECT USING (true);
CREATE POLICY "Content owners can manage tags" ON content_tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM content WHERE content.id = content_id AND content.user_id = auth.uid())
);
CREATE POLICY "Content owners can delete tags" ON content_tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM content WHERE content.id = content_id AND content.user_id = auth.uid())
);

-- LIKES: viewable by everyone, users manage their own
CREATE POLICY "Likes are viewable" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON likes FOR DELETE USING (auth.uid() = user_id);

-- COMMENTS: viewable by everyone, users manage their own
CREATE POLICY "Comments are viewable" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can edit own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- FOLLOWS: viewable by everyone, users manage their own
CREATE POLICY "Follows are viewable" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- CONVERSATIONS: participants only
CREATE POLICY "Conversation participants can view" ON conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
);
CREATE POLICY "Authenticated users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- CONVERSATION PARTICIPANTS
CREATE POLICY "Participants can view" ON conversation_participants FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
  )
);
CREATE POLICY "Authenticated users can add participants" ON conversation_participants FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- MESSAGES: conversation participants only
CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- COMMUNITIES: public communities are viewable by everyone
CREATE POLICY "Public communities are viewable" ON communities FOR SELECT USING (is_private = false);
CREATE POLICY "Creators can create communities" ON communities FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own communities" ON communities FOR UPDATE USING (auth.uid() = creator_id);

-- COMMUNITY MEMBERS
CREATE POLICY "Community members are viewable" ON community_members FOR SELECT USING (true);
CREATE POLICY "Users can join communities" ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave communities" ON community_members FOR DELETE USING (auth.uid() = user_id);

-- COMMUNITY POSTS
CREATE POLICY "Community posts are viewable" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Members can create posts" ON community_posts FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM community_members WHERE community_id = community_posts.community_id AND user_id = auth.uid())
);
CREATE POLICY "Users can edit own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- STORIES: viewable by everyone, owners manage their own
CREATE POLICY "Active stories are viewable" ON stories FOR SELECT USING (expires_at > NOW());
CREATE POLICY "Users can create stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid() = user_id);

-- STORY VIEWS
CREATE POLICY "Story owners can see views" ON story_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM stories WHERE stories.id = story_id AND stories.user_id = auth.uid())
  OR viewer_id = auth.uid()
);
CREATE POLICY "Users can mark stories viewed" ON story_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);

-- SUBSCRIPTION TIERS: viewable by everyone
CREATE POLICY "Tiers are viewable" ON subscription_tiers FOR SELECT USING (true);
CREATE POLICY "Creators can manage tiers" ON subscription_tiers FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update tiers" ON subscription_tiers FOR UPDATE USING (auth.uid() = creator_id);

-- SUBSCRIPTIONS
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (
  auth.uid() = subscriber_id OR auth.uid() = creator_id
);
CREATE POLICY "Users can subscribe" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);
CREATE POLICY "Users can cancel own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = subscriber_id);

-- TIPS
CREATE POLICY "Users can view own tips" ON tips FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send tips" ON tips FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- USER SETTINGS: only own settings
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can create own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = id);

-- NOTIFICATIONS: only own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- TRENDING TAGS: viewable by everyone
CREATE POLICY "Trending tags are viewable" ON trending_tags FOR SELECT USING (true);


-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-create profile + settings on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, handle)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'handle', 'user_' || LEFT(NEW.id::text, 8))
  );
  INSERT INTO user_settings (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_content BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_comments BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_communities BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_community_posts BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_subscription_tiers BEFORE UPDATE ON subscription_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_subscriptions BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_user_settings BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_conversations BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
