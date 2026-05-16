export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<{
        id: string;
        email: string | null;
        full_name: string | null;
        avatar_url: string | null;
        role: string;
        created_at: string;
        updated_at: string;
      }>;
      clients: Table<{
        id: string;
        user_id: string;
        name: string;
        company: string;
        email: string | null;
        status: string;
        tags: string[];
        revenue: number;
        last_contact: string | null;
        notes: string | null;
        created_at: string;
        updated_at: string;
      }>;
      projects: Table<{
        id: string;
        user_id: string;
        client_id: string | null;
        title: string;
        description: string | null;
        status: string;
        priority: string;
        deadline: string | null;
        progress: number;
        labels: string[];
        attachments: Json;
        created_at: string;
        updated_at: string;
      }>;
      tasks: Table<{
        id: string;
        user_id: string;
        project_id: string | null;
        title: string;
        description: string | null;
        status: string;
        priority: string;
        due_at: string | null;
        reminder_at: string | null;
        subtasks: Json;
        created_at: string;
        updated_at: string;
      }>;
      finances: Table<{
        id: string;
        user_id: string;
        client_id: string | null;
        project_id: string | null;
        kind: string;
        title: string;
        amount: number;
        category: string;
        status: string;
        occurred_on: string;
        created_at: string;
      }>;
      vault_items: Table<{
        id: string;
        user_id: string;
        kind: string;
        title: string;
        encrypted_value: string;
        tags: string[];
        created_at: string;
        updated_at: string;
      }>;
      notes: Table<{
        id: string;
        user_id: string;
        client_id: string | null;
        project_id: string | null;
        title: string;
        body: string | null;
        created_at: string;
        updated_at: string;
      }>;
      tags: Table<{
        id: string;
        user_id: string;
        name: string;
        color: string | null;
        created_at: string;
      }>;
      activities: Table<{
        id: string;
        user_id: string;
        entity_type: string;
        entity_id: string | null;
        type: string;
        title: string;
        metadata: Json;
        created_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
