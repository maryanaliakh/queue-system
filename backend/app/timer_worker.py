"""Trwałe terminy kolejki. Zalecane QUEUE_TIMERS_ENABLED=1 w jednym procesie API."""
import asyncio
import logging
from sqlalchemy import select
from app.database.connection import SessionLocal
from app.models.catalog import Service
from app.models.queue import QueueEntry
from app.models.offers import OfferWindow
from app.queue_timing import ACTIVE, process_service

logger = logging.getLogger(__name__)


async def tick(sessions=SessionLocal, now=None):
    async with sessions() as db:
        ids = list((await db.scalars(select(QueueEntry.service_id).where(
            QueueEntry.status.in_(ACTIVE)).union(select(OfferWindow.service_id).where(
                OfferWindow.status == "active")))).all())
        ids.sort(key=str)
    for service_id in ids:
        async with sessions.begin() as db:
            service = await db.scalar(select(Service).where(Service.id == service_id)
                                      .with_for_update(skip_locked=True))
            if service is not None:
                await process_service(db, service, now)


async def run():
    while True:
        try:
            await tick()
        except Exception as exc:
            # Ponów po wycofaniu transakcji; nie wypisuj danych logowania ani parametrów bazy.
            logger.error("Queue timer tick failed (%s)", type(exc).__name__)
        await asyncio.sleep(5)
