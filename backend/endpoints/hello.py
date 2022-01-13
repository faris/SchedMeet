from fastapi import APIRouter, Depends, Request
from typing import Optional
from dependency import authenticated_uid_check

router = APIRouter()


@router.post("/test_auth")
async def test_auth(key: str = Depends(authenticated_uid_check)):
    return {"user_id": key}


@router.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id}
