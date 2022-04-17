import datetime

def convertTimeIntervalToArrayOfTimes(start_time, end_time):
    
    tempTime = start_time
    arrayOfTimes = []
    
    while(tempTime <= end_time):
        arrayOfTimes.append(tempTime)
        tempTime = tempTime + datetime.timedelta(minutes=30)
    return arrayOfTimes


