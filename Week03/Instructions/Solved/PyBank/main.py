#PyBank
import os
import csv

#Get name of the file to be processed from user
csvname = input("Please enter the name of the file to be processed (must be on ""raw_data"" folder): ")
#csvname = "budget_data_1.csv"
csvpath = os.path.join(".","raw_data",csvname)

#Define/Initiate variables
rowcount = 0
totalrevenue = 0
difference = 0
revenuelastrow = 0
totaldifference = 0
maxincrease = 0
maxincreasemonth = ""
maxdecrease = 0
maxdecreasemonth = ""

#Open file and process data
with open(csvpath,"r",newline='') as csvfile:
	csvreader = csv.reader(csvfile, delimiter=',')
	next(csvreader, None)
	for row in csvreader:
		rowcount = rowcount + 1
		#calculate difference in revenue based on last month
		difference = int(row[1])-revenuelastrow
		#Keep track of total revenue
		totalrevenue = totalrevenue + int(row[1])
		#Save current month's revenue to be used in next iteration
		revenuelastrow = int(row[1])
		#keep track of total difference for calculating average
		totaldifference = totaldifference + difference
		#Save maxincrease if applicable
		if difference > maxincrease:
			maxincrease = difference
			maxincreasemonth = row[0]
		#Save maxdecrease if applicable
		if difference < maxdecrease:
			maxdecrease = difference
			maxdecreasemonth = row[0]
#calculate average difference in revenue
avgmonthlychange = totaldifference / rowcount
#print results on screen
print("Financial Analysis")
print("----------------------------")
print("Total Months: " + str(rowcount))
print("Total Revenue: $" + str(totalrevenue))
print("Average Revenue Change: $" + str(avgmonthlychange))
print("The greatest increase in revenue (date and amount): " +
      maxincreasemonth + " (" + str(maxincrease) + ")")
print("The greatest decrease in revenue (date and amount): " +
      maxdecreasemonth + " (" + str(maxdecrease) + ")")

#Ask user for file name for output
resultsfilename = input("Enter name for results file (include "".txt""): ")
#resultsfilename = "PyBankOutput1.txt"

#Create/update file with results in the Output folder
csvoutputpath = os.path.join(".", "Output", resultsfilename)
with open(csvoutputpath, "w", newline="") as csvoutput:
	#csvwriter = csv.writer(csvoutput)
	csvoutput.write("Financial Analysis\n")
	csvoutput.write("----------------------------\n")
	csvoutput.write("Total Months: " + str(rowcount) + "\n")
	csvoutput.write("Total Revenue: " + str(totalrevenue) + "\n")
	csvoutput.write("Average Revenue Change: " + str(avgmonthlychange) + "\n")
	csvoutput.write("The greatest increase in revenue (date and amount): " +
	                maxincreasemonth + " (" + str(maxincrease) + ")\n")
	csvoutput.write("The greatest decrease in revenue (date and amount): " +
	                maxdecreasemonth + " (" + str(maxdecrease) + ")\n")
