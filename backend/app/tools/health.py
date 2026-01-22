"""Health reporting and monitoring tools."""
import uuid
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_, func

from app.models.post_disaster import (
    HealthReport, HealthCluster, MedicalDispatch,
    HealthSeverity, Severity, ClusterStatus, DispatchStatus
)
from app.models.monitoring import WaterLevelReading
from app.models.location import LocationHistory


def report_health_symptoms(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    symptoms: Optional[List[str]] = None,
    severity: Optional[str] = None,
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
):
    """
    Report health symptoms and check for nearby health clusters.
    """
    # Get location if not provided
    if not latitude or not longitude:
        if citizen_id:
            last_location = db.query(LocationHistory).filter(
                LocationHistory.citizen_id == citizen_id
            ).order_by(LocationHistory.recorded_at.desc()).first()
            if last_location:
                latitude = last_location.latitude
                longitude = last_location.longitude

    # Determine severity
    if severity:
        try:
            severity_enum = HealthSeverity(severity.lower())
        except ValueError:
            severity_enum = HealthSeverity.MILD
    else:
        # Auto-determine from symptoms count/type
        severity_enum = HealthSeverity.MODERATE if (symptoms and len(symptoms) > 2) else HealthSeverity.MILD

    # Validate citizen_id if provided
    final_citizen_id = citizen_id
    if citizen_id:
        from app.models.citizen import Citizen
        citizen = db.query(Citizen).filter(Citizen.id == citizen_id).first()
        if not citizen:
            return {
                "error": "Invalid citizen_id",
                "message": f"Citizen with ID {citizen_id} does not exist in the database",
                "citizen_id": str(citizen_id),
                "note": "You can still report symptoms anonymously by not providing a citizen_id"
            }

    # Create health report
    health_report = HealthReport(
        citizen_id=final_citizen_id,
        symptoms=symptoms or [],
        severity=severity_enum,
        location_latitude=latitude,
        location_longitude=longitude,
        is_anonymized=True if not citizen_id else False,
        reported_at=datetime.utcnow()
    )

    db.add(health_report)
    db.commit()
    db.refresh(health_report)

    # Check for nearby health clusters
    nearby_clusters = []
    if latitude and longitude:
        # Check clusters within ~10km radius
        lat_range = 0.09
        lng_range = 0.09
        
        clusters = db.query(HealthCluster).filter(
            and_(
                HealthCluster.status != ClusterStatus.RESOLVED,
                HealthCluster.center_latitude.between(latitude - lat_range, latitude + lat_range),
                HealthCluster.center_longitude.between(longitude - lng_range, longitude + lng_range)
            )
        ).all()

        for cluster in clusters:
            # Check if within cluster radius
            distance_km = ((cluster.center_latitude - latitude) ** 2 + 
                          (cluster.center_longitude - longitude) ** 2) ** 0.5 * 111  # Rough km conversion
            if distance_km <= cluster.radius_km:
                nearby_clusters.append({
                    "cluster_id": str(cluster.id),
                    "cluster_name": cluster.cluster_name,
                    "cluster_type": cluster.cluster_type,
                    "severity": cluster.severity.value,
                    "affected_count": cluster.affected_count,
                    "distance_km": round(distance_km, 2)
                })

    # Check for medical dispatches
    medical_dispatches = []
    if nearby_clusters:
        for cluster_info in nearby_clusters:
            cluster_id = uuid.UUID(cluster_info["cluster_id"])
            dispatches = db.query(MedicalDispatch).filter(
                MedicalDispatch.health_cluster_id == cluster_id
            ).all()
            for dispatch in dispatches:
                medical_dispatches.append({
                    "team_name": dispatch.team_name,
                    "status": dispatch.status.value,
                    "dispatched_at": dispatch.dispatched_at.isoformat()
                })

    result = {
        "report_id": str(health_report.id),
        "symptoms": health_report.symptoms,
        "severity": health_report.severity.value,
        "reported_at": health_report.reported_at.isoformat(),
        "nearby_clusters": nearby_clusters,
        "cluster_warnings": len(nearby_clusters),
        "medical_dispatches": medical_dispatches if medical_dispatches else None
    }

    if nearby_clusters:
        result["warning"] = f"⚠️ {len(nearby_clusters)} health cluster(s) detected nearby. Medical assistance may be dispatched."

    print(f"🏥 [HEALTH TOOL] Health report created: {health_report.id}, {len(nearby_clusters)} nearby clusters")
    return result


def check_health_clusters(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
):
    """
    Check for active health clusters in an area.
    """
    # Get location
    if not latitude or not longitude:
        if citizen_id:
            last_location = db.query(LocationHistory).filter(
                LocationHistory.citizen_id == citizen_id
            ).order_by(LocationHistory.recorded_at.desc()).first()
            if last_location:
                latitude = last_location.latitude
                longitude = last_location.longitude

    if not latitude or not longitude:
        # Get all active clusters if no location
        clusters = db.query(HealthCluster).filter(
            HealthCluster.status != ClusterStatus.RESOLVED
        ).all()
    else:
        # Get clusters within ~20km radius
        lat_range = 0.18
        lng_range = 0.18
        
        clusters = db.query(HealthCluster).filter(
            and_(
                HealthCluster.status != ClusterStatus.RESOLVED,
                HealthCluster.center_latitude.between(latitude - lat_range, latitude + lat_range),
                HealthCluster.center_longitude.between(longitude - lng_range, longitude + lng_range)
            )
        ).all()

    result = {
        "location": location or (f"{latitude}, {longitude}" if latitude and longitude else "all_areas"),
        "clusters": []
    }

    for cluster in clusters:
        # Get medical dispatches
        dispatches = db.query(MedicalDispatch).filter(
            MedicalDispatch.health_cluster_id == cluster.id
        ).all()

        # Get recent health reports in cluster area
        recent_reports = db.query(HealthReport).filter(
            and_(
                HealthReport.reported_at >= datetime.utcnow() - timedelta(days=7),
                HealthReport.location_latitude.between(
                    cluster.center_latitude - (cluster.radius_km / 111),
                    cluster.center_latitude + (cluster.radius_km / 111)
                ) if HealthReport.location_latitude else True,
                HealthReport.location_longitude.between(
                    cluster.center_longitude - (cluster.radius_km / 111),
                    cluster.center_longitude + (cluster.radius_km / 111)
                ) if HealthReport.location_longitude else True
            )
        ).count()

        result["clusters"].append({
            "cluster_id": str(cluster.id),
            "cluster_name": cluster.cluster_name,
            "cluster_type": cluster.cluster_type,
            "center": {
                "latitude": cluster.center_latitude,
                "longitude": cluster.center_longitude
            },
            "radius_km": cluster.radius_km,
            "affected_count": cluster.affected_count,
            "recent_reports": recent_reports,
            "severity": cluster.severity.value,
            "status": cluster.status.value,
            "detected_at": cluster.detected_at.isoformat(),
            "medical_dispatches": [
                {
                    "team_name": d.team_name,
                    "team_size": d.team_size,
                    "status": d.status.value,
                    "dispatched_at": d.dispatched_at.isoformat()
                }
                for d in dispatches
            ]
        })

    result["total_clusters"] = len(result["clusters"])
    result["summary"] = {
        "active": len([c for c in result["clusters"] if c["status"] == "detected"]),
        "investigating": len([c for c in result["clusters"] if c["status"] == "investigating"]),
        "total_affected": sum([c["affected_count"] for c in result["clusters"]])
    }

    print(f"🏥 [HEALTH CLUSTERS] Found {len(result['clusters'])} active clusters")
    return result


def get_water_level(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    location: Optional[str] = None,
    sensor_id: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
):
    """
    Get current water level readings from sensors.
    """
    if sensor_id:
        # Get specific sensor
        readings = db.query(WaterLevelReading).filter(
            WaterLevelReading.sensor_id == sensor_id
        ).order_by(WaterLevelReading.reading_timestamp.desc()).limit(10).all()
    elif latitude and longitude:
        # Get readings near location
        lat_range = 0.045  # ~5km
        lng_range = 0.045
        
        readings = db.query(WaterLevelReading).filter(
            and_(
                WaterLevelReading.reading_timestamp >= datetime.utcnow() - timedelta(hours=24),
                WaterLevelReading.latitude.between(latitude - lat_range, latitude + lat_range),
                WaterLevelReading.longitude.between(longitude - lng_range, longitude + lng_range)
            )
        ).order_by(WaterLevelReading.reading_timestamp.desc()).limit(10).all()
    elif citizen_id:
        # Get user's location first
        last_location = db.query(LocationHistory).filter(
            LocationHistory.citizen_id == citizen_id
        ).order_by(LocationHistory.recorded_at.desc()).first()
        
        if last_location:
            lat_range = 0.045
            lng_range = 0.045
            readings = db.query(WaterLevelReading).filter(
                and_(
                    WaterLevelReading.reading_timestamp >= datetime.utcnow() - timedelta(hours=24),
                    WaterLevelReading.latitude.between(
                        last_location.latitude - lat_range,
                        last_location.latitude + lat_range
                    ),
                    WaterLevelReading.longitude.between(
                        last_location.longitude - lng_range,
                        last_location.longitude + lng_range
                    )
                )
            ).order_by(WaterLevelReading.reading_timestamp.desc()).limit(10).all()
        else:
            readings = []
    else:
        # Get all recent readings
        readings = db.query(WaterLevelReading).filter(
            WaterLevelReading.reading_timestamp >= datetime.utcnow() - timedelta(hours=6)
        ).order_by(WaterLevelReading.reading_timestamp.desc()).limit(20).all()

    if not readings:
        return {
            "status": "no_data",
            "message": "No water level readings found for the specified location"
        }

    # Calculate statistics
    water_levels = [r.water_level_cm for r in readings]
    max_level = max(water_levels)
    min_level = min(water_levels)
    avg_level = sum(water_levels) / len(water_levels)

    # Determine trend (comparing latest to average)
    latest = readings[0].water_level_cm
    trend = "rising" if latest > avg_level else "falling" if latest < avg_level else "stable"

    result = {
        "location": location or (f"{latitude}, {longitude}" if latitude and longitude else "multiple"),
        "readings": [
            {
                "sensor_id": r.sensor_id,
                "location_name": r.location_name,
                "water_level_cm": r.water_level_cm,
                "water_level_m": round(r.water_level_cm / 100, 2),
                "reading_timestamp": r.reading_timestamp.isoformat(),
                "sensor_status": r.sensor_status.value,
                "coordinates": {
                    "latitude": r.latitude,
                    "longitude": r.longitude
                }
            }
            for r in readings[:5]  # Return top 5 most recent
        ],
        "statistics": {
            "max_cm": max_level,
            "max_m": round(max_level / 100, 2),
            "min_cm": min_level,
            "average_cm": round(avg_level, 2),
            "latest_cm": latest,
            "trend": trend
        },
        "alert_level": "critical" if max_level > 100 else "high" if max_level > 50 else "moderate" if max_level > 20 else "low"
    }

    print(f"💧 [WATER LEVEL] Retrieved {len(readings)} readings, max: {max_level}cm")
    return result
