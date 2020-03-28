import math as math
#import matplotlib.pyplot as plt
import random
e=math.e
def poisson(k, l):
    exp = math.pow(e,-l)
    lambdaPower = math.pow(l,k)
    num = exp*lambdaPower
    denom = math.factorial(k)
    return num/denom

class my_dictionary(dict): 
  
    # __init__ function 
    def __init__(self): 
        self = dict() 
          
    # Function to add key:value 
    def add(self, key, value): 
        self[key] = value 



def poissonValues(mean):
    
    trainChance=my_dictionary()
    for i in range(100):
        if poisson(i,mean)*100 >=.5:
            trainChance.add(i,round(poisson(i,mean)*100))
    keys=[x for x in trainChance.keys()]
    for i in range(1,len(trainChance.keys())):
        trainChance[keys[i]]=trainChance[keys[i]]+trainChance[keys[i]-1]
    return trainChance

class TrainTrack:
    def __init__(self,trains,duration):
        self.poissonTrains=poissonValues(trains)
        self.poissonDuration=poissonValues(duration)
        self.hasTrain=False
        self.isWaiting=False
        self.trackOccupancy=[]
    def getTimeBetweenTrains(self):
        r=random.randint(1,100)
        for key, val in self.poissonTrains.items():
            if r<= val:
                return key
        return list(self.poissonTrains.keys())[len(self.poissonTrains.keys())-1]
    def getHowLong(self):
        r=random.randint(1,100)

        for key, val in self.poissonDuration.items():
            if r<= val:
                return key
        return list(self.poissonDuration.keys())[len(self.poissonDuration.keys())-1]
    def simulate(self):
        waitFor=0
        thisTrain=0
        if(random.randint(1,100)>50):
            self.isWaiting=True
            waitFor=self.getHowLong()
        for i in range (60):
            print("SECOND : "+str(i))
            if self.isWaiting==True and i >= waitFor:
                self.isWaiting=False
            if self.hasTrain and i >=thisTrain:
                self.hasTrain = False
            if self.hasTrain == False and self.isWaiting==False:
                self.hasTrain=True
                self.isWaiting=True
                thisTrain = i + self.getHowLong()
                waitFor = waitFor + self.getTimeBetweenTrains()
                
            print("WAIT FOR: "+str(waitFor)) 
            print("THIS TRAIN: "+str(thisTrain))
            print("HAS TRAIN: "+str(self.hasTrain))
            print("IS WAITING: "+str(self.isWaiting))
            if self.hasTrain == True:
                self.trackOccupancy.append(1)
            else:
                self.trackOccupancy.append(0)
        return self.trackOccupancy
                

def simulateTrains(L0,L1,numTrains):
    tracks = [TrainTrack(L0,L1) for x in range(numTrains)]
    results=[x.simulate() for x in tracks]
   # print(results)
    '''
    fig,ax = plt.subplots(numTrains)
    fig.suptitle("Presence of Trains on Tracks every second")
    for i in range(len(results)):
        
        ax[i].plot([x for x in range (60)],results[i])
        ax[i].set_title("Track "+str(i))
        
    plt.legend()
    plt.show()
    '''

##simulateTrains(15,3,4)
print(poisson(5, 5))
print(poissonValues(5))