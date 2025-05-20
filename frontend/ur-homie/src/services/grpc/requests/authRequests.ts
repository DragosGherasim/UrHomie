import {
    SignUpRequest,
    ClientDetails,
    ServiceProviderDetails,
  } from "../proto/user_auth_pb";
  
  export const buildClientSignUpRequest = (data: any) => {
    const req = new SignUpRequest();
    req.setEmail(data.email);
    req.setPassword(data.password);
    req.setFirstName(data.firstName);
    req.setLastName(data.lastName);
    req.setPhoneNumber(data.phoneNumber);
    req.setCountry(data.country);
    req.setCity(data.city);
    req.setAddress(data.address);
    req.setRole("CLIENT");
    req.setClient(new ClientDetails());
    return req;
  };
  
  export const buildProviderSignUpRequest = (general: any, provider: any) => {
    const req = new SignUpRequest();
    req.setEmail(general.email);
    req.setPassword(general.password);
    req.setFirstName(general.firstName);
    req.setLastName(general.lastName);
    req.setPhoneNumber(general.phoneNumber);
    req.setCountry(general.country);
    req.setCity(general.city);
    req.setAddress(general.address);
    req.setRole("SERVICE_PROVIDER");
  
    const providerDetails = new ServiceProviderDetails();
    providerDetails.setEducation(provider.education);
    providerDetails.setCertifications(provider.certifications);
    providerDetails.setExperienceDescription(provider.experienceDescription);
    providerDetails.setCoverageArea(parseInt(provider.coverageArea));
    providerDetails.setWorkSchedule(`${provider.startTime} - ${provider.endTime}`);
  
    req.setProvider(providerDetails);
    return req;
  };
  