"""Rescue request-related factories."""
import factory
import random
from datetime import datetime
from app.factories.base import BaseFactory, fake, get_philippine_phone
from app.models.rescue_request import (
    RescueRequest,
    RescueRequestStatus,
    RescueUrgency,
)
from app.factories.citizen import CitizenFactory


class RescueRequestFactory(BaseFactory):
    """Factory for RescueRequest model."""

    class Meta:
        model = RescueRequest

    citizen = factory.SubFactory(CitizenFactory)
    name = factory.LazyAttribute(lambda obj: obj.citizen.full_name if obj.citizen else fake.name())
    contact = factory.LazyAttribute(
        lambda obj: obj.citizen.phone_number if obj.citizen and obj.citizen.phone_number else get_philippine_phone()
    )
    household_size = factory.LazyFunction(lambda: random.randint(1, 8))
    status = factory.LazyFunction(
        lambda: fake.random_element(elements=[
            RescueRequestStatus.OPEN,
            RescueRequestStatus.OPEN,
            RescueRequestStatus.OPEN,
            RescueRequestStatus.IN_PROGRESS,
        ])
    )
    urgency = factory.LazyFunction(
        lambda: fake.random_element(elements=[
            RescueUrgency.HIGH,
            RescueUrgency.HIGH,
            RescueUrgency.CRITICAL,
            RescueUrgency.CRITICAL,
            RescueUrgency.CRITICAL,
        ])
    )
    latitude = factory.LazyFunction(lambda: 10.3157)  # Default Cebu City
    longitude = factory.LazyFunction(lambda: 123.8854)  # Default Cebu City
    needs = factory.LazyFunction(
        lambda: {
            "water": fake.boolean(chance_of_getting_true=80),
            "food": fake.boolean(chance_of_getting_true=85),
            "medical": fake.boolean(chance_of_getting_true=40),
            "shelter": fake.boolean(chance_of_getting_true=70),
            "evacuation": fake.boolean(chance_of_getting_true=60),
            "other": None,
        }
    )
    note = factory.LazyAttribute(lambda obj: _generate_note_for_urgency(obj.urgency))
    photo_url = None
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


def _generate_note_for_urgency(urgency: RescueUrgency) -> str:
    """Generate contextual note based on urgency level for storm-affected areas."""
    if urgency == RescueUrgency.CRITICAL:
        notes = [
            "Tubig na hapit sa atubangan, dili na makagawas! Taas na kaayo ang baha, may mga bata ug tigulang!",
            "Nangayo ug tabang dayon! Ang balay nalunop na sa baha, naa sa atop nalang mi!",
            "Emergency! Water level sa balay kapin 6 feet na, wala nay kuryente, nagtago sa 2nd floor!",
            "Stranded mi sa atop, ang tubig kusog kaayo ug ang hangin grabe! May sakit nga bata!",
            "URGENT: Ang balay hapit na maanod, naa pa mi sa sulod! Nahadlok na kaayo mi!",
            "Rescue needed now! May mga tigulang nga dili makasaka sa taas! Tubig kusog kaayo!",
            "Nangayo ug rescue! May baby nga 6 months old, wala nay tubig ug pagkaon!",
            "Critical situation! Ang among silingan nalunop na ang balay, may nabasa nga sugat!",
            "Palihug tabang! Ang baha milapaw sa bubong, naa ra sa atop ang pamilya!",
            "Need immediate evacuation! May asthmatic nga anak, ang hangin ug tubig grabe kaayo!",
        ]
    elif urgency == RescueUrgency.HIGH:
        notes = [
            "Ang baha milapas na sa hawak, kinahanglan na ug evacuation. May mga bata ug edaran.",
            "Tubig na sa balay, hapit na mi lutaw. Nanginahanglan ug rescue boat.",
            "High water level na diri sa among lugar, padayon ang pag-ulan. Need help soon.",
            "Ang among balay apil sa flood prone area, kusog ang baha. Naa pa mi sa 2nd floor.",
            "Stranded sa balay tungod sa baha, wala nay pagkaon ug tubig nga mainom.",
            "Ang tubig kusog na kaayo, mahadlok mi nga molapas pa. May elderly nga tawo.",
            "Need rescue soon, ang situation grabe na. Wala nay electricity ug communication.",
            "Ang floodwater increasing rapidly, kinahanglan na ug evacuation assistance.",
            "May sakit nga hamtong diri, di makapanglihok. Ang baha taas na kaayo.",
            "Flooded na ang first floor, nahadlok nga molapaw pa. Nangayo ug tabang.",
        ]
    else:  # NORMAL
        notes = [
            "Ang baha duol na sa among balay, mangayo lang unta ug advisory.",
            "May gamay nga baha sa dalan, pero okay ra pa. Monitoring lang.",
            "Nangayo ug update sa flood situation sa area. Naa pa sa safe zone.",
            "Ang tubig sakay-sakay pa, pero naa nay gamay nga baha sa compound.",
            "May baha sa atubangan pero wala pa musulod sa balay. Stand by lang.",
            "Request for monitoring, rising water levels pero controlled pa.",
            "Low-lying area mi, hinay-hinay ang pagtaas sa tubig. Advisory needed.",
            "Slightly flooded ang area pero okay pa ang pamilya. Para sa records lang.",
            "Ground floor may konting tubig na, pero safe pa ang mga tao sa taas.",
            "Nangayo ug information kung kanus-a ang evacuation if needed.",
        ]
    
    return fake.random_element(elements=notes)
