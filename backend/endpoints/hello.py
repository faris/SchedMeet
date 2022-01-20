from fastapi import APIRouter, Depends, Request
from typing import Optional
from dependency import authenticated_uid_check

router = APIRouter()


@router.post("/test")
async def test_auth(key: str = Depends(authenticated_uid_check)):
    return {"user_id": key}

