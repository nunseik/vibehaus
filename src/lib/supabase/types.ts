export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          bio: string | null
          website: string | null
          twitter: string | null
          github: string | null
          favorite_models: string[]
          tech_stack: string[]
          languages: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          twitter?: string | null
          github?: string | null
          favorite_models?: string[]
          tech_stack?: string[]
          languages?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          twitter?: string | null
          github?: string | null
          favorite_models?: string[]
          tech_stack?: string[]
          languages?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: number
          slug: string
          name: string
          icon: string
          description: string | null
        }
        Insert: {
          id?: number
          slug: string
          name: string
          icon?: string
          description?: string | null
        }
        Update: {
          slug?: string
          name?: string
          icon?: string
          description?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          body: string | null
          url: string | null
          category_id: number | null
          score: number
          upvote_count: number
          downvote_count: number
          comment_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          body?: string | null
          url?: string | null
          category_id?: number | null
          score?: number
          upvote_count?: number
          downvote_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          body?: string | null
          url?: string | null
          category_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'posts_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      tags: {
        Row: {
          id: number
          slug: string
          name: string
        }
        Insert: {
          id?: number
          slug: string
          name: string
        }
        Update: {
          slug?: string
          name?: string
        }
        Relationships: []
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: number
        }
        Insert: {
          post_id: string
          tag_id: number
        }
        Update: {
          post_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'post_tags_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          }
        ]
      }
      votes: {
        Row: {
          user_id: string
          post_id: string
          value: number
          created_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          value: number
          created_at?: string
        }
        Update: {
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: 'votes_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          }
        ]
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          parent_id: string | null
          body: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          parent_id?: string | null
          body: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          body?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comments_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      featured_users: {
        Row: {
          author_id: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          favorite_models: string[] | null
          tech_stack: string[] | null
          languages: string[] | null
          total_score: number | null
          post_count: number | null
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type FeaturedUser = Database['public']['Views']['featured_users']['Row']

export type PostWithAuthor = Post & {
  profiles: Pick<Profile, 'username' | 'avatar_url'>
  categories: Pick<Category, 'slug' | 'name' | 'icon'> | null
  tags: Tag[]
  user_vote?: 1 | -1 | null
}

export type CommentWithAuthor = Comment & {
  profiles: Pick<Profile, 'username' | 'avatar_url'>
  replies?: CommentWithAuthor[]
}
