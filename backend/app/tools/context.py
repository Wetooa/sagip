"""Context-aware user profile analysis tool for personalized recommendations."""
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta

from app.models.citizen import Citizen, CensusData, VulnerabilityProfile, RiskLevel
from app.models.post_disaster import HealthReport, HealthSeverity
from app.models.location import LocationHistory


def get_user_context(
    db: Session,
    citizen_id: Optional[Any] = None,
    query_type: Optional[str] = None
):
    """
    Get comprehensive user context for personalized advice and recommendations.
    Analyzes user profile, census data, vulnerability factors, health conditions, and location.
    
    This tool should be called when users ask for advice, plans, or recommendations
    (e.g., "What should I pack in my evacuation bag?", "How should I prepare?")
    """
    # TODO: Remove this hardcoded value - for testing only
    # If citizen_id is None, use test ID (remove in production)
    from uuid import UUID
    
    print(f"🔍 [CONTEXT TOOL] Received citizen_id: {citizen_id} (type: {type(citizen_id)})")
    
    if not citizen_id:
        citizen_id = UUID("9cf8c0f0-77fd-49c0-a825-1d42a92f4a62")
        print(f"⚠️ [CONTEXT TOOL] Using hardcoded test citizen_id: {citizen_id}")
    elif isinstance(citizen_id, str):
        # Convert string to UUID if needed
        try:
            citizen_id = UUID(citizen_id)
            print(f"✅ [CONTEXT TOOL] Converted string to UUID: {citizen_id}")
        except ValueError:
            return {
                "error": "invalid_citizen_id",
                "message": f"Invalid citizen ID format: {citizen_id}"
            }
    
    print(f"🔍 [CONTEXT TOOL] Final citizen_id before query: {citizen_id} (type: {type(citizen_id)})")

    # Get citizen basic info
    citizen = db.query(Citizen).filter(Citizen.id == citizen_id).first()
    if not citizen:
        return {
            "error": "citizen_not_found",
            "message": f"Citizen with ID {citizen_id} not found"
        }

    # Get census data
    census_data = db.query(CensusData).filter(
        CensusData.citizen_id == citizen_id
    ).first()

    # Get vulnerability profile
    vulnerability = db.query(VulnerabilityProfile).filter(
        VulnerabilityProfile.citizen_id == citizen_id
    ).first()

    # Get recent health reports
    recent_health_reports = db.query(HealthReport).filter(
        and_(
            HealthReport.citizen_id == citizen_id,
            HealthReport.reported_at >= datetime.utcnow() - timedelta(days=30)
        )
    ).order_by(HealthReport.reported_at.desc()).limit(5).all()

    # Get last known location
    last_location = db.query(LocationHistory).filter(
        LocationHistory.citizen_id == citizen_id
    ).order_by(LocationHistory.recorded_at.desc()).first()

    # Build comprehensive context
    context = {
        "citizen_id": str(citizen_id),
        "basic_info": {
            "name": citizen.full_name,
            "phone": citizen.phone_number,
            "email": citizen.email
        },
        "family_profile": {},
        "vulnerability_factors": {},
        "health_considerations": {},
        "location_context": {},
        "personalization_notes": []
    }

    # Analyze census data
    if census_data:
        context["family_profile"] = {
            "family_size": census_data.family_size,
            "medical_needs": census_data.medical_needs,
            "address": census_data.address,
            "barangay": census_data.barangay,
            "city": census_data.city,
            "province": census_data.province,
            "volunteer_willingness": census_data.volunteer_willingness
        }

        # Parse additional_info JSON for vulnerable sectors
        if census_data.additional_info:
            additional = census_data.additional_info if isinstance(census_data.additional_info, dict) else {}
            
            # Check for vulnerable sectors
            has_children = False
            has_seniors = False
            has_pwd = False  # Persons with disabilities
            has_pregnant = False
            
            # Common keys that might indicate vulnerable sectors
            vulnerable_keywords = {
                "children": ["child", "children", "kids", "minor", "infant", "toddler"],
                "seniors": ["senior", "elderly", "old", "aged", "retired"],
                "pwd": ["disability", "disabled", "pwd", "special needs", "wheelchair"],
                "pregnant": ["pregnant", "pregnancy", "expecting"]
            }
            
            # Search in additional_info values
            additional_str = str(additional).lower()
            for key, keywords in vulnerable_keywords.items():
                if any(kw in additional_str for kw in keywords):
                    if key == "children":
                        has_children = True
                    elif key == "seniors":
                        has_seniors = True
                    elif key == "pwd":
                        has_pwd = True
                    elif key == "pregnant":
                        has_pregnant = True
            
            # Also check medical_needs field
            if census_data.medical_needs:
                medical_str = census_data.medical_needs.lower()
                if any(kw in medical_str for kw in vulnerable_keywords["children"]):
                    has_children = True
                if any(kw in medical_str for kw in vulnerable_keywords["seniors"]):
                    has_seniors = True
                if any(kw in medical_str for kw in vulnerable_keywords["pwd"]):
                    has_pwd = True
                if any(kw in medical_str for kw in vulnerable_keywords["pregnant"]):
                    has_pregnant = True

            context["vulnerability_factors"]["has_children"] = has_children
            context["vulnerability_factors"]["has_seniors"] = has_seniors
            context["vulnerability_factors"]["has_pwd"] = has_pwd
            context["vulnerability_factors"]["has_pregnant"] = has_pregnant

            # Add to personalization notes
            if has_children:
                context["personalization_notes"].append("Family includes children - need child-friendly items and considerations")
            if has_seniors:
                context["personalization_notes"].append("Family includes seniors - need mobility assistance and medical supplies")
            if has_pwd:
                context["personalization_notes"].append("Family includes persons with disabilities - need accessibility considerations")
            if has_pregnant:
                context["personalization_notes"].append("Family includes pregnant member - need special medical considerations")

    # Analyze vulnerability profile
    if vulnerability:
        context["vulnerability_factors"]["risk_level"] = vulnerability.risk_level.value
        context["vulnerability_factors"]["risk_score"] = vulnerability.risk_score
        
        if vulnerability.factors:
            factors = vulnerability.factors if isinstance(vulnerability.factors, dict) else {}
            context["vulnerability_factors"]["detailed_factors"] = factors
            
            # Extract specific vulnerability indicators
            factors_str = str(factors).lower()
            if "elderly" in factors_str or "senior" in factors_str:
                context["vulnerability_factors"]["has_seniors"] = True
            if "child" in factors_str or "minor" in factors_str:
                context["vulnerability_factors"]["has_children"] = True
            if "disability" in factors_str or "pwd" in factors_str:
                context["vulnerability_factors"]["has_pwd"] = True

        # Add risk-based notes
        if vulnerability.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
            context["personalization_notes"].append(
                f"High vulnerability risk ({vulnerability.risk_level.value}) - prioritize safety and early evacuation"
            )

    # Analyze health reports
    if recent_health_reports:
        all_symptoms = []
        max_severity = HealthSeverity.MILD
        
        for report in recent_health_reports:
            if report.symptoms:
                if isinstance(report.symptoms, list):
                    all_symptoms.extend(report.symptoms)
                else:
                    all_symptoms.append(str(report.symptoms))
            
            # Track highest severity
            severity_values = {HealthSeverity.MILD: 1, HealthSeverity.MODERATE: 2, HealthSeverity.SEVERE: 3}
            if severity_values.get(report.severity, 0) > severity_values.get(max_severity, 0):
                max_severity = report.severity

        context["health_considerations"] = {
            "recent_symptoms": list(set(all_symptoms))[:10],  # Unique symptoms, limit to 10
            "max_severity": max_severity.value,
            "recent_reports_count": len(recent_health_reports),
            "has_ongoing_health_issues": max_severity != HealthSeverity.MILD
        }

        if all_symptoms:
            context["personalization_notes"].append(
                f"Recent health symptoms reported: {', '.join(set(all_symptoms)[:5])}"
            )
        
        if max_severity == HealthSeverity.SEVERE:
            context["personalization_notes"].append(
                "Severe health symptoms reported - ensure medical supplies and medications are included"
            )

    # Analyze medical needs from census
    if census_data and census_data.medical_needs:
        context["health_considerations"]["medical_needs"] = census_data.medical_needs
        context["personalization_notes"].append(
            f"Medical needs identified: {census_data.medical_needs}"
        )

    # Location context
    if last_location:
        context["location_context"] = {
            "last_known_location": {
                "latitude": last_location.latitude,
                "longitude": last_location.longitude,
                "recorded_at": last_location.recorded_at.isoformat(),
                "source": last_location.source.value
            },
            "location_age_hours": int((datetime.utcnow() - last_location.recorded_at).total_seconds() / 3600)
        }
    elif census_data:
        context["location_context"] = {
            "registered_address": {
                "address": census_data.address,
                "barangay": census_data.barangay,
                "city": census_data.city,
                "province": census_data.province
            }
        }

    # Generate summary recommendations based on context
    recommendations = []
    
    if context["vulnerability_factors"].get("has_children"):
        recommendations.append("Include child-specific items: formula, diapers, toys, comfort items")
        recommendations.append("Plan for child safety: identification tags, emergency contacts")
    
    if context["vulnerability_factors"].get("has_seniors"):
        recommendations.append("Include mobility aids: walker, cane, wheelchair if needed")
        recommendations.append("Pack extra medications and medical records for seniors")
        recommendations.append("Plan for slower evacuation pace")
    
    if context["vulnerability_factors"].get("has_pwd"):
        recommendations.append("Ensure accessibility equipment is ready")
        recommendations.append("Contact local authorities for evacuation assistance if needed")
    
    if context["vulnerability_factors"].get("has_pregnant"):
        recommendations.append("Include prenatal vitamins and medical records")
        recommendations.append("Plan for frequent rest stops during evacuation")
    
    if context["health_considerations"].get("medical_needs"):
        recommendations.append(f"Essential: {context['health_considerations']['medical_needs']}")
    
    if context["health_considerations"].get("recent_symptoms"):
        recommendations.append("Pack medications for recent symptoms")
        recommendations.append("Include first aid supplies")
    
    if context["vulnerability_factors"].get("risk_level") in ["high", "critical"]:
        recommendations.append("High priority: Prepare evacuation bag immediately")
        recommendations.append("Consider early evacuation before conditions worsen")

    context["recommendations"] = recommendations
    context["query_type"] = query_type or "general_advice"

    print(f"👤 [USER CONTEXT] Analyzed profile for citizen {citizen_id}: {len(recommendations)} recommendations")
    return context
