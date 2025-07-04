# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: user_auth.proto
# Protobuf Python Version: 5.29.0
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    29,
    0,
    '',
    'user_auth.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0fuser_auth.proto\"/\n\x0cLogInRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x10\n\x08password\x18\x02 \x01(\t\"3\n\rLogInResponse\x12\x0b\n\x03jwt\x18\x01 \x01(\t\x12\x15\n\rerror_message\x18\x02 \x01(\t\"!\n\x12ValidateJwtRequest\x12\x0b\n\x03jwt\x18\x01 \x01(\t\"Y\n\x13ValidateJwtResponse\x12\x10\n\x08is_valid\x18\x01 \x01(\x08\x12\x0b\n\x03sub\x18\x02 \x01(\t\x12\x0c\n\x04role\x18\x03 \x01(\t\x12\x15\n\rerror_message\x18\x04 \x01(\t\"\x8a\x02\n\rSignUpRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x10\n\x08password\x18\x02 \x01(\t\x12\x0c\n\x04role\x18\x03 \x01(\t\x12\x12\n\nfirst_name\x18\x04 \x01(\t\x12\x11\n\tlast_name\x18\x05 \x01(\t\x12\x14\n\x0cphone_number\x18\x06 \x01(\t\x12\x0f\n\x07\x63ountry\x18\x07 \x01(\t\x12\x0c\n\x04\x63ity\x18\x08 \x01(\t\x12\x0f\n\x07\x61\x64\x64ress\x18\t \x01(\t\x12 \n\x06\x63lient\x18\n \x01(\x0b\x32\x0e.ClientDetailsH\x00\x12+\n\x08provider\x18\x0b \x01(\x0b\x32\x17.ServiceProviderDetailsH\x00\x42\x0e\n\x0cprofile_data\"P\n\x0eSignUpResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\x12\x15\n\rerror_message\x18\x02 \x01(\t\x12\x16\n\x0e\x63orrelation_id\x18\x03 \x01(\t\"\x0f\n\rClientDetails\"\x91\x01\n\x16ServiceProviderDetails\x12\x11\n\teducation\x18\x01 \x01(\t\x12\x16\n\x0e\x63\x65rtifications\x18\x02 \x01(\t\x12\x1e\n\x16\x65xperience_description\x18\x03 \x01(\t\x12\x15\n\rwork_schedule\x18\x04 \x01(\t\x12\x15\n\rcoverage_area\x18\x05 \x01(\x05\"\x07\n\x05\x45mpty2\xeb\x01\n\x12UserAuthentication\x12&\n\x05LogIn\x12\r.LogInRequest\x1a\x0e.LogInResponse\x12\x38\n\x0bValidateJwt\x12\x13.ValidateJwtRequest\x1a\x14.ValidateJwtResponse\x12)\n\x06SignUp\x12\x0e.SignUpRequest\x1a\x0f.SignUpResponse\x12&\n\x0cRefreshToken\x12\x06.Empty\x1a\x0e.LogInResponse\x12 \n\x06LogOut\x12\x06.Empty\x1a\x0e.LogInResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'user_auth_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_LOGINREQUEST']._serialized_start=19
  _globals['_LOGINREQUEST']._serialized_end=66
  _globals['_LOGINRESPONSE']._serialized_start=68
  _globals['_LOGINRESPONSE']._serialized_end=119
  _globals['_VALIDATEJWTREQUEST']._serialized_start=121
  _globals['_VALIDATEJWTREQUEST']._serialized_end=154
  _globals['_VALIDATEJWTRESPONSE']._serialized_start=156
  _globals['_VALIDATEJWTRESPONSE']._serialized_end=245
  _globals['_SIGNUPREQUEST']._serialized_start=248
  _globals['_SIGNUPREQUEST']._serialized_end=514
  _globals['_SIGNUPRESPONSE']._serialized_start=516
  _globals['_SIGNUPRESPONSE']._serialized_end=596
  _globals['_CLIENTDETAILS']._serialized_start=598
  _globals['_CLIENTDETAILS']._serialized_end=613
  _globals['_SERVICEPROVIDERDETAILS']._serialized_start=616
  _globals['_SERVICEPROVIDERDETAILS']._serialized_end=761
  _globals['_EMPTY']._serialized_start=763
  _globals['_EMPTY']._serialized_end=770
  _globals['_USERAUTHENTICATION']._serialized_start=773
  _globals['_USERAUTHENTICATION']._serialized_end=1008
# @@protoc_insertion_point(module_scope)
