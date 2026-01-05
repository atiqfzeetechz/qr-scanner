// types/qr.types.ts
export interface UserData {
  id?: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  customFields: Array<{
    key: string;
    value: string;
  }>;
  profileImage?: string;
  qrId?: string;
  templateId?: string;
  isActive?: boolean;
  createdAt?: Date;
}

export interface QRTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  logo?: string;
  layout: 'standard' | 'compact' | 'detailed';
  styles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
  };
  isGlobal: boolean;
}