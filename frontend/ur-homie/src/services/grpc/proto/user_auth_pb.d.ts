import * as jspb from 'google-protobuf'



export class LogInRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): LogInRequest;

  getPassword(): string;
  setPassword(value: string): LogInRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogInRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LogInRequest): LogInRequest.AsObject;
  static serializeBinaryToWriter(message: LogInRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogInRequest;
  static deserializeBinaryFromReader(message: LogInRequest, reader: jspb.BinaryReader): LogInRequest;
}

export namespace LogInRequest {
  export type AsObject = {
    email: string,
    password: string,
  }
}

export class LogInResponse extends jspb.Message {
  getJwt(): string;
  setJwt(value: string): LogInResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): LogInResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogInResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LogInResponse): LogInResponse.AsObject;
  static serializeBinaryToWriter(message: LogInResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogInResponse;
  static deserializeBinaryFromReader(message: LogInResponse, reader: jspb.BinaryReader): LogInResponse;
}

export namespace LogInResponse {
  export type AsObject = {
    jwt: string,
    errorMessage: string,
  }
}

export class ValidateJwtRequest extends jspb.Message {
  getJwt(): string;
  setJwt(value: string): ValidateJwtRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateJwtRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateJwtRequest): ValidateJwtRequest.AsObject;
  static serializeBinaryToWriter(message: ValidateJwtRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateJwtRequest;
  static deserializeBinaryFromReader(message: ValidateJwtRequest, reader: jspb.BinaryReader): ValidateJwtRequest;
}

export namespace ValidateJwtRequest {
  export type AsObject = {
    jwt: string,
  }
}

export class ValidateJwtResponse extends jspb.Message {
  getIsValid(): boolean;
  setIsValid(value: boolean): ValidateJwtResponse;

  getSub(): string;
  setSub(value: string): ValidateJwtResponse;

  getRole(): string;
  setRole(value: string): ValidateJwtResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): ValidateJwtResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateJwtResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateJwtResponse): ValidateJwtResponse.AsObject;
  static serializeBinaryToWriter(message: ValidateJwtResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateJwtResponse;
  static deserializeBinaryFromReader(message: ValidateJwtResponse, reader: jspb.BinaryReader): ValidateJwtResponse;
}

export namespace ValidateJwtResponse {
  export type AsObject = {
    isValid: boolean,
    sub: string,
    role: string,
    errorMessage: string,
  }
}

export class SignUpRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): SignUpRequest;

  getPassword(): string;
  setPassword(value: string): SignUpRequest;

  getRole(): string;
  setRole(value: string): SignUpRequest;

  getFirstName(): string;
  setFirstName(value: string): SignUpRequest;

  getLastName(): string;
  setLastName(value: string): SignUpRequest;

  getPhoneNumber(): string;
  setPhoneNumber(value: string): SignUpRequest;

  getCountry(): string;
  setCountry(value: string): SignUpRequest;

  getCity(): string;
  setCity(value: string): SignUpRequest;

  getAddress(): string;
  setAddress(value: string): SignUpRequest;

  getClient(): ClientDetails | undefined;
  setClient(value?: ClientDetails): SignUpRequest;
  hasClient(): boolean;
  clearClient(): SignUpRequest;

  getProvider(): ServiceProviderDetails | undefined;
  setProvider(value?: ServiceProviderDetails): SignUpRequest;
  hasProvider(): boolean;
  clearProvider(): SignUpRequest;

  getProfileDataCase(): SignUpRequest.ProfileDataCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignUpRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignUpRequest): SignUpRequest.AsObject;
  static serializeBinaryToWriter(message: SignUpRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignUpRequest;
  static deserializeBinaryFromReader(message: SignUpRequest, reader: jspb.BinaryReader): SignUpRequest;
}

export namespace SignUpRequest {
  export type AsObject = {
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    country: string,
    city: string,
    address: string,
    client?: ClientDetails.AsObject,
    provider?: ServiceProviderDetails.AsObject,
  }

  export enum ProfileDataCase { 
    PROFILE_DATA_NOT_SET = 0,
    CLIENT = 10,
    PROVIDER = 11,
  }
}

export class SignUpResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): SignUpResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): SignUpResponse;

  getCorrelationId(): string;
  setCorrelationId(value: string): SignUpResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignUpResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SignUpResponse): SignUpResponse.AsObject;
  static serializeBinaryToWriter(message: SignUpResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignUpResponse;
  static deserializeBinaryFromReader(message: SignUpResponse, reader: jspb.BinaryReader): SignUpResponse;
}

export namespace SignUpResponse {
  export type AsObject = {
    success: boolean,
    errorMessage: string,
    correlationId: string,
  }
}

export class ClientDetails extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientDetails.AsObject;
  static toObject(includeInstance: boolean, msg: ClientDetails): ClientDetails.AsObject;
  static serializeBinaryToWriter(message: ClientDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientDetails;
  static deserializeBinaryFromReader(message: ClientDetails, reader: jspb.BinaryReader): ClientDetails;
}

export namespace ClientDetails {
  export type AsObject = {
  }
}

export class ServiceProviderDetails extends jspb.Message {
  getEducation(): string;
  setEducation(value: string): ServiceProviderDetails;

  getCertifications(): string;
  setCertifications(value: string): ServiceProviderDetails;

  getExperienceDescription(): string;
  setExperienceDescription(value: string): ServiceProviderDetails;

  getWorkSchedule(): string;
  setWorkSchedule(value: string): ServiceProviderDetails;

  getCoverageArea(): number;
  setCoverageArea(value: number): ServiceProviderDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceProviderDetails.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceProviderDetails): ServiceProviderDetails.AsObject;
  static serializeBinaryToWriter(message: ServiceProviderDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceProviderDetails;
  static deserializeBinaryFromReader(message: ServiceProviderDetails, reader: jspb.BinaryReader): ServiceProviderDetails;
}

export namespace ServiceProviderDetails {
  export type AsObject = {
    education: string,
    certifications: string,
    experienceDescription: string,
    workSchedule: string,
    coverageArea: number,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

