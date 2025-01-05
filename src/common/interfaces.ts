export interface ICommonType {
  id: number;
  code: string;
  name: string;
}

export interface ILoggedUser {
  id: number;
  accessToken: string;
  email: string;
  username: string;
  userRole: ICommonType;
  user: ICommonType | null;
}

export interface SignupFormInputs {
  fName: string;
  lName: string;
  email: string;
  nic: string;
  address: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export type SystemUserFormPayload = Omit<
  SignupFormInputs,
  'nic' | 'confirmPassword'
>;
export type SignupPayload = Omit<SignupFormInputs, 'confirmPassword'>;
export type CreateUserForm = Omit<
  SignupFormInputs,
  'password' | 'confirmPassword' | 'nic'
>;

export interface AdminUser {
  id: number;
  fname: string;
  lname: string;
  email: string;
  userRole: ICommonType;
}

export interface Donor {
  id: number;
  fname: string;
  lname: string;
  address: string;
  email: string;
  nic: string;
  mobile: string;
  isActive: boolean;
}

export interface IDonation {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  isPerDay: boolean;
}

export type ICreateDonation = Omit<IDonation, 'id' | 'isActive'>;

export interface IStatusPayload {
  id: number;
  status: boolean;
}

export interface IDonationStatusPayload {
  id: number;
  status: string;
}

export interface DonationItem {
  donationTypeName: string;
  isPerDay: boolean | null;
  itemName: string;
  quantity: number;
  scheduledDate: string | null;
}

export interface Donation {
  id: number;
  donorId: number;
  donorFirstName: string;
  donorLastName: string;
  donorNic: string;
  purpose: string;
  scheduledDate: string;
  status: string;
  donationItems: DonationItem[];
}

export interface IDonorItem {
  donationTypeId: string;
  itemName: string;
  quantity: number;
}

export interface ICreateDonationPayload {
  donorId: number;
  purpose: string;
  scheduledDate: string;
  items: IDonorItem[];
}

export interface ICreateDonationForm {
  donorId: number;
  purpose: string;
  scheduledDate: string;
  items: IDonorItem[];
}
