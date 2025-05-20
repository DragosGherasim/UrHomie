from typing import Any, Dict

def build_create_user_profile_message(user_id: int, request) -> Dict[str, Any]:
    message = {
        "UserId": user_id,
        "Email": request.email,
        "FirstName": request.first_name,
        "LastName": request.last_name,
        "PhoneNumber": request.phone_number,
        "Country": request.country,
        "City": request.city,
        "Address": request.address
    }

    if request.HasField("provider"):
        message["ServiceProvider"] = {
            "Education": request.provider.education,
            "Certifications": request.provider.certifications,
            "ExperienceDescription": request.provider.experience_description,
            "WorkSchedule": request.provider.work_schedule,
            "CoverageArea": request.provider.coverage_area
        }
        message["Client"] = None
    elif request.HasField("client"):
        message["Client"] = {}
        message["ServiceProvider"] = None

    return message
