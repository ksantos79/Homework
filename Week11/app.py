import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
import pymysql
pymysql.install_as_MySQLdb()
import pandas as pd
import numpy as np
from flask import Flask, jsonify
import datetime as dt

engine = create_engine("sqlite:///hawaii.sqlite", echo=False)
Base = automap_base()
Base.prepare(engine, reflect=True)
measurements = Base.classes.measurements
stations_class = Base.classes.stations
session = Session(engine)
#Designning a Flask API based on the queries that you have just developed
app = Flask(__name__)


# Flask Routes 
#"""List all available api routes."""
@app.route("/") 
def welcome():
    return ( 
         f"<h3>Routes:</h3></br>"
         f"/api/v1.0/precipitation<br/>" 
         f"- List of last year's temperature from all stations<br/>" 
         f"/api/v1.0/stations<br/>" 
         f"- List of stations <br/>" 
         f"/api/v1.0/tobs<br/>" 
         f"- List of Temperature Observations (tobs) for the previous year<br/>" 
         f"/api/v1.0/start<br/>" 
         f"- With start date, come out the MAX, MIN and AVG temperature for all dates from that date of last year  to greater than and equal to that date<br/>" 
         f"/api/v1.0/start/end<br/>" 
         f"- With start date and the end date, come out the MAX, MIN and AVG temperature in between of those dates<br/>" 
           ) 

@app.route("/api/v1.0/precipitation")
def precipitation():
    max_date_str = engine.execute("SELECT MAX(date) AS date FROM measurements").fetchall()
    max_date = pd.to_datetime(max_date_str[0][0])
    start_date = max_date - dt.timedelta(days=365)
    year_data = pd.read_sql_query(f"SELECT date,prcp FROM measurements WHERE date >= '{start_date}' AND date <= '{max_date}' ORDER BY date", session.bind)
    
    formatted_data = year_data.to_dict('records')
    return jsonify(formatted_data)

@app.route("/api/v1.0/stations")
def stations():
    stations_data = pd.read_sql_query(f"SELECT * FROM stations", session.bind)
    formatted_data = stations_data.to_dict('records')
    return jsonify(formatted_data)

@app.route("/api/v1.0/tobs")
def tobs():
    max_date_str = engine.execute("SELECT MAX(date) AS date FROM measurements").fetchall()
    max_date = pd.to_datetime(max_date_str[0][0])
    start_date = max_date - dt.timedelta(days=365)
    year_data = pd.read_sql_query(f"SELECT date,tobs FROM measurements WHERE date >= '{start_date}' AND date <= '{max_date}' ORDER BY date", session.bind)
    
    formatted_data = year_data.to_dict('records')
    return jsonify(formatted_data)

@app.route("/api/v1.0/from/<start_date>")
def start(start_date):    
    temp_data = engine.execute(f"SELECT MIN(tobs),MAX(tobs),AVG(tobs) FROM measurements WHERE date >= '{start_date}'").fetchall()
    temp_dict = {"Min":temp_data[0][0],"Max":temp_data[0][1],"Avg":round(temp_data[0][2],2)}
    return jsonify(temp_dict)

@app.route("/api/v1.0/fromto/<start_date>/<end_date>")
def startend(start_date,end_date):
    temp_data = engine.execute(f"SELECT MIN(tobs),MAX(tobs),AVG(tobs) FROM measurements WHERE date >= '{start_date}' AND date <= '{end_date}'").fetchall()
    temp_dict = {"Min":temp_data[0][0],"Max":temp_data[0][1],"Avg":round(temp_data[0][2],2)}
    return jsonify(temp_dict)


if __name__ == "__main__":
    app.run(debug=True)