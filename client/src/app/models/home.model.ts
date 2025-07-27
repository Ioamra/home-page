export interface UserInfo {
  user_account: UserAccount | null;
  homeSettings: HomeSettings;
}

export interface UserAccount {
  id: string;
  email: string;
  photo: string;
  created_at: string;
}

export interface HomeSettings {
  backgroundImageUrl: string;
}
