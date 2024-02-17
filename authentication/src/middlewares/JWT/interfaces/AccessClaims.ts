import { BaseClaims } from './BaseClaims';

export interface AccessClaims extends BaseClaims {
  scope?: string; // Scope Values
  client_id?: string; // Client Identifier
  nonce?: string; // Value used to associate a Client session with an ID Token
  auth_time?: number; // Time when the authentication occurred
  at_hash?: string; // Access Token hash value
  c_hash?: string; // Code hash value
  acr?: string; // Authentication Context Class Reference
  amr?: string[]; // Authentication Methods References
  sub_jwk?: string; // Public key used to check the signature of an ID Token
  azp?: string; // Authorized party - the party to which the ID Token was issued
  cnf?: string; // Confirmation
  sip_from_tag?: string; // SIP From tag header field parameter value
  sip_date?: string; // SIP Date header field value
  sip_callid?: string; // SIP Call-Id header field value
  sip_cseq_num?: string; // SIP CSeq numeric header field parameter value
  sip_via_branch?: string; // SIP Via branch header field parameter value
  orig?: string; // Originating Identity String
  dest?: string; // Destination Identity String
  mky?: string; // Media Key Fingerprint String
  events?: string; // Security Events
  toe?: string; // Time of Event
  txn?: string; // Transaction Identifier
  rph?: string; // Resource Priority Header Authorization
  sid?: string; // Session ID
  vot?: string; // Vector of Trust value
  vtm?: string; // Vector of Trust trustmark URL
  attest?: string; // Attestation level as defined in SHAKEN framework
  origid?: string; // Originating Identifier as defined in SHAKEN framework
  act?: string; // Actor
  may_act?: string; // Authorized Actor - the party that is authorized to become the actor
  jcard?: string; // jCard data
  at_use_nbr?: number; // Number of API requests for which the access token can be used
  div?: string; // Diverted Target of a Call
  opt?: string; // Original PASSporT
  vc?: string; // Verifiable Credential as specified in the W3C Recommendation
  vp?: string; // Verifiable Presentation as specified in the W3C Recommendation
  sph?: string; // SIP Priority header field
  ace_profile?: string; // The ACE profile a token is supposed to be used with
  cnonce?: string; // "client-nonce". A nonce previously provided to the AS by the RS via the client
  exi?: number; // "Expires in". Lifetime of the token in seconds from the time the RS first sees it
  roles?: string[]; // Roles
  groups?: string[]; // Groups
  entitlements?: string[]; // Entitlements
  token_introspection?: string; // Token introspection response
  ueid?: string; // The Universal Entity ID
  sueids?: string; // Semi-permanent UEIDs
  oemid?: string; // Hardware OEM ID
  hwmodel?: string; // Model identifier for hardware
  hwversion?: string; // Hardware Version Identifier
  secboot?: string; // Indicate whether the boot was secure
  dbgstat?: string; // Indicate status of debug facilities
  location?: string; // The geographic location
  eat_profile?: string; // Indicates the EAT profile followed
  submods?: string; // The section containing submodules
  cdniv?: string; // CDNI Claim Set Version
  cdnicrit?: string; // CDNI Critical Claims Set
  cdniip?: string; // CDNI IP Address
  cdniuc?: string; // CDNI URI Container
  cdniets?: string; // CDNI Expiration Time Setting for Signed Token Renewal
  cdnistt?: string; // CDNI Signed Token Transport Method for Signed Token Renewal
  cdnistd?: string; // CDNI Signed Token Depth
  sig_val_claims?: string; // Signature Validation Token
  authorization_details?: string; // The claim authorization_details
  verified_claims?: string; // This container Claim
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
