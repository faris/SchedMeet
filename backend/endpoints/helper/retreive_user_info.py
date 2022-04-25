from firebase_admin import auth
from pprint import pprint


def get_users_info(array_of_firebase_uids):

    firebase_list_of_uids = []
    firebase_list_of_users = dict()

    for user_id in set(array_of_firebase_uids):
        firebase_list_of_uids.append(auth.UidIdentifier(user_id))
    
    results = auth.get_users(firebase_list_of_uids)

    for user in results.users:
        print(vars(user))
        firebase_list_of_users[user.uid] = {
              "user_id" : user.uid,
              "user_email": user.email,
              "user_name": user.display_name,
              
        }
    
    return firebase_list_of_users


