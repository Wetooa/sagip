"""Notification retrieval tools."""
import uuid
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.communication import Notification, NotificationType, NotificationStatus, NotificationPriority


def get_user_notifications(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    notification_type: Optional[str] = None,
    unread_only: bool = False
):
    """
    Get notifications for a user, optionally filtered by type and read status.
    """
    if not citizen_id:
        return {"error": "citizen_id is required"}

    query = db.query(Notification).filter(Notification.citizen_id == citizen_id)

    # Filter by type
    if notification_type:
        try:
            notif_type_enum = NotificationType(notification_type.lower())
            query = query.filter(Notification.notification_type == notif_type_enum)
        except ValueError:
            pass

    # Filter by read status
    if unread_only:
        query = query.filter(
            Notification.status.in_([NotificationStatus.PENDING, NotificationStatus.SENT])
        )

    notifications = query.order_by(Notification.created_at.desc()).limit(50).all()

    result = {
        "citizen_id": str(citizen_id),
        "notifications": [
            {
                "notification_id": str(n.id),
                "type": n.notification_type.value,
                "title": n.title,
                "message": n.message,
                "priority": n.priority.value,
                "status": n.status.value,
                "sent_at": n.sent_at.isoformat() if n.sent_at else None,
                "read_at": n.read_at.isoformat() if n.read_at else None,
                "created_at": n.created_at.isoformat(),
                "is_read": n.status == NotificationStatus.READ
            }
            for n in notifications
        ],
        "total": len(notifications),
        "unread_count": len([n for n in notifications if n.status != NotificationStatus.READ]),
        "by_type": {},
        "by_priority": {}
    }

    # Calculate statistics
    for notification in notifications:
        notif_type = notification.notification_type.value
        result["by_type"][notif_type] = result["by_type"].get(notif_type, 0) + 1

        priority = notification.priority.value
        result["by_priority"][priority] = result["by_priority"].get(priority, 0) + 1

    # Get urgent alerts
    urgent_alerts = [n for n in notifications if n.priority == NotificationPriority.URGENT and n.status != NotificationStatus.READ]
    if urgent_alerts:
        result["urgent_alerts"] = [
            {
                "notification_id": str(n.id),
                "title": n.title,
                "message": n.message,
                "created_at": n.created_at.isoformat()
            }
            for n in urgent_alerts[:5]
        ]

    print(f"🔔 [NOTIFICATIONS] Retrieved {len(notifications)} notifications for citizen {citizen_id}")
    return result
