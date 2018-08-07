from flask import Flask, render_template
import pymongo
import time
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import datetime as dt


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=True)


def scrape():
    browser = init_browser()
    mars = {}

#------------------------------------------------------------------

    browser = Browser("chrome",executable_path="chromedriver.exe",headless=True)
    url = "https://mars.nasa.gov/news/"
    browser.visit(url)
    html = browser.html
    news_soup = BeautifulSoup(html,"html.parser")
    news_title = news_soup.find('div',class_="content_title").text
    news_paragraph = news_soup.find('div',class_="article_teaser_body").text

    mars["news_title"] = news_title
    mars["news_paragraph"] = news_paragraph
    
#------------------------------------------------------------------

    url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(url)
    browser.find_by_id("full_image").click()
    time.sleep(2)
    browser.find_link_by_partial_text("more info").click()
    time.sleep(2)

    html = browser.html
    img_soup = BeautifulSoup(html, "html.parser")
    img = img_soup.find("figure", class_="lede")
    img_url = "https://www.jpl.nasa.gov" + img.find("a")["href"]

    mars["img_url"] = img_url

#------------------------------------------------------------------

    url = "https://twitter.com/marswxreport?lang=en"
    browser.visit(url)

    html = browser.html
    weather_soup = BeautifulSoup(html,"html.parser")

    tweet_blob = weather_soup.find_all('p',class_="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text".split())
    tweet_data = []
    for el in tweet_blob:
        test = el.get_text()
        if test.startswith(("Sol")):
            tweet_data.append(test)
    tweet_data

    mars["weather"] = tweet_data

#------------------------------------------------------------------

    url = "http://space-facts.com/mars/"
    df_list = pd.read_html(url)

    df = df_list[0]

    df.columns = ["description","value"]
    df.set_index("description",inplace=True)

    facts_table = df.to_html(classes="table table-striped")

    mars["facts_table"] = facts_table

#------------------------------------------------------------------

    url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(url)

    html = browser.html
    hemi_soup = BeautifulSoup(html,"html.parser")

    hemi_links = hemi_soup.find_all("a", class_="itemLink product-item")
    image_hemi_urls = {}
    hemi_title = []

    for i in range(0,len(hemi_links),2):  
        browser.visit("https://astrogeology.usgs.gov/"+hemi_links[i]["href"])
        time.sleep(2)
        
        html = browser.html
        hemi_img_soup = BeautifulSoup(html,"html.parser")
        
        hemi_title_temp = hemi_img_soup.find("h2",class_="title").text
        
        sample_button = browser.find_link_by_text("Sample").first
        hemi_title.append([hemi_title_temp,sample_button["href"]])
        image_hemi_urls[hemi_title_temp] = sample_button["href"]

    mars["hemi_title"] = hemi_title
    mars["image_hemi_urls"] = image_hemi_urls

    return mars