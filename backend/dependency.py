from fastapi import HTTPException, Depends
from fastapi.security import HTTPBasicCredentials, HTTPBearer
import firebase_admin
from firebase_admin import auth

auth_app = firebase_admin.initialize_app()
security = HTTPBearer()


"""
    Function that is used to validate the token in the case that it requires it
    https://stackoverflow.com/questions/62994795/how-to-secure-fastapi-api-endpoint-with-jwt-token-based-authorization
"""


async def authenticated_uid_check(
    credentials: HTTPBasicCredentials = Depends(security),
):

    token = credentials.credentials

    try:
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        uid = decoded_token["uid"]
        return uid
    except firebase_admin.exceptions.FirebaseError as e:  # catches any exception
        raise HTTPException(status_code=401, detail=str(e))
