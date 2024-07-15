import requests
import json
import os
from bs4 import BeautifulSoup

class Site:
    def __init__(self, name=""):
        self.name = name
        self.webtoon_list_path = "./Files/webtoons"+ self.name +".json"
        self.r_webtoon_list_path = "./Files/r_webtoons"+ self.name +".json"
        self.contain_r_webtoon = False
        self.scraper = Scraper()
        self.setup()
    
    def setup(self):
        code = self.read_webtoon_list()
        if code != 2101:
            return code
        if self.contain_r_webtoon:
            code = self.read_r_webtoon_list()
            if code != 2101:
                return code
        return 2101
    
    def read_webtoon_list(self):
        self.webtoon_list = []
        try: 
            with open(self.webtoon_list_path) as json_file:
                self.webtoon_list = json.load(json_file)
        except FileNotFoundError:
            print("Webtoon of "+ self.name+ "list not found")
            return 4101
        except json.JSONDecodeError:
            print("webtoon list is empty or malformed")
            return 4102
        return 2101
            
    def read_r_webtoon_list(self): 
        self.r_webtoon_list = []
        try: 
            with open(self.r_webtoon_list_path) as json_file:
                self.r_webtoon_list = json.load(json_file)
        except FileNotFoundError:
            print("R_Webtoon list not found")
            return 4101
        except json.JSONDecodeError:
            print("r_webtoon list is empty or malformed")
            return 4102
        return 2101
    
    def write_webtoon_list(self):
        try:
            
            with open(self.webtoon_list_path, 'w') as outfile:
                json.dump(self.webtoon_list, outfile)
        except FileNotFoundError:
            print("Webtoon list not found")
            return 4101
        return 2101
    
    def write_r_webtoon_list(self):
        try:
            with open(self.r_webtoon_list_path, 'w') as outfile:
                json.dump(self.r_webtoon_list, outfile)
        except FileNotFoundError:
            print("R_Webtoon list not found")
            return 4101
        return 2101
    
    def get_webtoon(self, webtoon_url):
        for webtoon in self.webtoon_list:
            if webtoon["url"] == webtoon_url:
                return webtoon
        return 4103
    
    def get_webtoon_list(self):
        return self.webtoon_list
    
    def get_r_webtoon_list(self):
        return self.r_webtoon_list
    
    def update(self):
        if len(self.webtoon_list) == 0: return ([],2001)
        result = [2001] * len(self.webtoon_list)
        for i in range(len(self.webtoon_list)):
            webtoon = self.webtoon_list[i]
            print('Webtoon : ', webtoon["url"],' ' , i , '/', len(self.webtoon_list))
            self.scraper.new_url(webtoon["url"])
            code = self.scraper.run_all()
            if code != 2001: result[i] = (webtoon["url"],code)
            self.webtoon_list[i] = self.scraper.return_webtoon()
        code2 = self.write_webtoon_list()
        return (result,code2)
    
    def update_r(self):
        for i in range(len(self.r_webtoon_list)):
            webtoon = self.r_webtoon_list[i]
            code = self.scraper.new_url(webtoon["url"])
            if code != 2001: return code
            code = self.scraper.run_all()
            if code != 2001: return code
            self.r_webtoon_list[i] = self.scraper.return_webtoon()
        code = self.write_r_webtoon_list()
        return code
    
    def add_webtoon(self, webtoon_url):
        if (webtoon_url in [webtoon["url"] for webtoon in self.webtoon_list]):
            print("Already have this webtoon")
            return 2102
        print("Site", self.name, "Adding", webtoon_url)
        self.scraper.new_url(webtoon_url)
        code = self.scraper.run_all()
        if code != 2001: return code
        self.webtoon_list.append(self.scraper.return_webtoon())
        code = self.write_webtoon_list()
        return code
    
    def add_r_webtoon(self, webtoon_url):
        self.scraper.new_url(webtoon_url)
        code = self.scraper.run_all()
        if code != 2001: return code
        self.r_webtoon_list.append(self.scraper.return_webtoon())
        code = self.write_r_webtoon_list()
        return code
            
class Scraper:
    def __init__(self, url=""):
        self.url = url
        self.name = ""
        self.chapter_list = []
        self.image = ""
        self.soup = None
        
    def new_url(self, url):
        self.url = url 

    def get_html(self):
        response = requests.get(self.url)
        return response.text

    def get_soup(self):
        self.soup = BeautifulSoup(self.get_html(), 'html.parser')
        if self.soup == None: return 4001
        return 2001    
    
    def return_webtoon(self):
        return {"name": self.name, "chapter_list": self.chapter_list, "image": self.image, "url": self.url}
    
    def run_all(self):
        code = self.get_soup()
        if code != 2001: return code
        code = self.get_chapter_list()
        self.format_chapter_list()
        if code != 2001: return code
        code = self.get_image()
        if code != 2001: return code
        code = self.get_name()
        if code != 2001: return code
        return 2001
    