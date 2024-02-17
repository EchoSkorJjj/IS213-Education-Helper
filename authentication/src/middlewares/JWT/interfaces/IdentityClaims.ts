import { DeviceType } from '../../../types';

import { BaseClaims } from './BaseClaims';

export interface IdentityClaims extends BaseClaims {
  name?: string; // Full name
  userRole?: {
    name: string;
    roles: string[];
  }; // User role
  given_name?: string; // Given name(s) or first name(s)
  family_name?: string; // Surname(s) or last name(s)
  middle_name?: string; // Middle name(s)
  nickname?: string; // Casual name
  preferred_username?: string; // Shorthand name by which the End-User wishes to be referred to
  profile?: string; // Profile page URL
  picture?: string; // Profile picture URL
  website?: string; // Web page or blog URL
  email?: string; // Preferred e-mail address
  email_verified?: boolean; // True if the e-mail address has been verified; otherwise false
  gender?: string; // Gender
  birthdate?: string; // Birthday
  zoneinfo?: string; // Time zone
  locale?: string; // Locale
  ipAddress?: string; // IP address
  userAgent?: string; // User agent
  deviceType?: DeviceType; // Device type
  geolocation?: string; // Geolocation
  phone_number?: string; // Preferred telephone number
  phone_number_verified?: boolean; // True if the phone number has been verified; otherwise false
  address?: string; // Preferred postal address
  updated_at?: string; // Time the information was last updated
  place_of_birth?: string; // A structured Claim representing the End-User's place of birth
  nationalities?: string[]; // String array representing the End-User's nationalities
  birth_family_name?: string; // Family name(s) someone has when they were born
  birth_given_name?: string; // Given name(s) someone has when they were born
  birth_middle_name?: string; // Middle name(s) someone has when they were born
  salutation?: string; // End-User's salutation
  title?: string; // End-User's title
  msisdn?: string; // End-User's mobile phone number formatted according to ITU-T recommendation [E.164]
  also_known_as?: string; // Stage name, religious name, or any other type of alias/pseudonym with which a person is known
}
