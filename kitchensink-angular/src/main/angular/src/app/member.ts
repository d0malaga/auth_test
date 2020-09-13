// Used when creating new members
export interface NewMember {
  name: string;
  phoneNumber: number;
  email: string;
}

// When reading members the also have an id
export interface Member extends NewMember {
  id: number;
}
