import {
  SignUpRequest,
  ClientDetails,
  ServiceProviderDetails,
} from "../proto/user_auth_pb";
import { GeneralFormData, ProviderDetailsData } from "../../../types/forms";

const setCommonFields = (req: SignUpRequest, data: GeneralFormData) => {
  req.setEmail(data.email);
  req.setPassword(data.password);
  req.setFirstName(data.firstName);
  req.setLastName(data.lastName);
  req.setPhoneNumber(data.phoneNumber);
  req.setCountry(data.country);
  req.setCity(data.city);
  req.setAddress(data.address);
};

export const buildClientSignUpRequest = (data: GeneralFormData): SignUpRequest => {
  const req = new SignUpRequest();
  setCommonFields(req, data);
  req.setRole("CLIENT");
  req.setClient(new ClientDetails());
  return req;
};

export const buildProviderSignUpRequest = (
  general: GeneralFormData,
  provider: ProviderDetailsData
): SignUpRequest => {
  const req = new SignUpRequest();
  setCommonFields(req, general);
  req.setRole("SERVICE_PROVIDER");

  const providerDetails = new ServiceProviderDetails();
  providerDetails.setEducation(provider.education);
  providerDetails.setCertifications(provider.certifications);
  providerDetails.setExperienceDescription(provider.experienceDescription);
  providerDetails.setCoverageArea(parseInt(provider.coverageArea) || 0);
  providerDetails.setWorkSchedule(`${provider.startTime} - ${provider.endTime}`);

  req.setProvider(providerDetails);
  return req;
};