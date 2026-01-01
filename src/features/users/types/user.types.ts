export interface User {
  id: string;
  tenant_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "manager" | "technician" | "viewer";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Details
  job_title?: string;
  department?: string;
  site_location?: string;
  shift_schedule?: string;
  start_date?: string;
  phone?: string;
  avatar_url?: string;
  sites?: string;
  language?: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  proficiency_level: string;
  is_verified: boolean;
}

export interface UserCertification {
  id: string;
  user_id: string;
  name: string;
  issuing_organization: string;
  issued_date?: string;
  expiry_date?: string;
  status: string;
  document_url?: string;
}

export interface UserAttachment {
  id: string;
  user_id: string;
  file_name: string;
  file_size: string;
  file_type: string;
  file_url: string;
  uploaded_at: string;
}

export interface UserNote {
  id: string;
  target_user_id: string;
  author_user_id: string;
  content: string;
  created_at: string;
  author?: User;
}

export interface UserProfile {
  user: User;
  skills: UserSkill[];
  certifications: UserCertification[];
  attachments: UserAttachment[];
  notes: UserNote[];
  activity_logs: any[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "admin" | "manager" | "technician" | "viewer";
}

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: "admin" | "manager" | "technician" | "viewer";
  is_active?: boolean;
}
