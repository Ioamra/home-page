export interface UserAccountWithHomeSettings {
  userAccount: UserAccountWithoutDetails;
  homeSettings: HomeSettings;
}

export interface UserAccountWithoutDetails {
  id: number;
  email: string;
  photo: string;
  created_at: Date;
}

export interface HomeSettings {
  backgroundImageUrl: string;
}
