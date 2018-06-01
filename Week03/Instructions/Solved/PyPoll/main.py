import os
import csv

#Definition of function to find out if there is a tie
def istie(list):
  largest = max(list)

  istieindexes =[]
  istieindexes=[i for i, j in enumerate(list) if j == largest]

  return istieindexes
#Ask user for file to be processed
csvname = input("Please enter the name of the file to be processed (file must be in ""raw_data"" folder: ")  
#csvname = "election_data_1.csv"

#set path of the file
csvpath = os.path.join(".","raw_data",csvname)

#define/initiate variables
rowcount = 0
totalvotes = 0
candidates = []
percentagevotes = []
totalvotespercandidate = []
#open and process file
with open(csvpath,"r",newline='') as csvfile:
	csvreader = csv.reader(csvfile,delimiter = ',')
	#skip header
	next(csvreader, None)
	for row in csvreader:
		rowcount = rowcount + 1
		#capture candidate name from row
		candidate = row[2]
		#check if candidate exists
		index = candidates.index(candidate) if candidate in candidates else -1
		if index >= 0:
			#update total votes and votes for candidate
			totalvotespercandidate[index] = totalvotespercandidate[index] +1
			totalvotes = totalvotes +1
		else:
			#add candidate and update votes counts
			candidates.append(candidate)
			totalvotespercandidate.append(1)
			totalvotes = totalvotes +1
#Calculate percentages
for i in range(0,len(totalvotespercandidate)):
  percentagevotes.append((totalvotespercandidate[i]/totalvotes)*100)

#Find winner or tie
winner = istie(totalvotespercandidate)

#print results on the screen
print("Election Results")
print("------------------------")
print("Total Votes: "+str(totalvotes))
print("------------------------")
i = 0
for i in range(0,len(candidates)-1):
  message = candidates[i]+": "+str(percentagevotes[i])+"% ("+str(totalvotespercandidate[i])+")"
  print(message)
print("------------------------")
i = 0
if len(winner) > 1:
  print("It's a tie!")
  print("The candidates below had the same number of votes ("+str(totalvotespercandidate[winner[0]])+"):")
  for i in range(0,len(winner)-1):
    print(candidates[i])
else:
  print("Winner: "+candidates[winner[0]])

print("------------------------")

#Get Output filename from user
resultsfilename = input("Enter name for results file (including extension): ")
#resultsfilename = "PyPollOutput1.txt"

#create/update txt file with the results
csvoutputpath = os.path.join(".","Output",resultsfilename)
with open(csvoutputpath,'w') as csvoutput:
	#csvwriter = csv.writer(csvoutput)
	csvoutput.write("Election Results")
	csvoutput.write("\n----------------------------\n")
	csvoutput.write("Total Votes: "+str(totalvotes))
	csvoutput.write("\n----------------------------\n")
	i = 0
	for i in range(0,len(candidates)-1):
		csvoutput.write(candidates[i]+": "+str(percentagevotes[i])+"% ("+str(totalvotespercandidate[i])+")\n")
	csvoutput.write("----------------------------\n")
	if len(winner) > 1:
	  csvoutput.write("It's a tie!\n")
	  csvoutput.write("The candidates below had the same number of votes\n")
	  for i in winner:
	    csvoutput.write(candidates[i])
	else:
		csvoutput.write("Winner: "+candidates[winner[0]])
	csvoutput.write("\n----------------------------")