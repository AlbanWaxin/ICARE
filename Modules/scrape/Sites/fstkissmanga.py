from Sites.util import Site,Scraper
import re
from datetime import datetime, timedelta

class Fstkiss_Scrapper(Scraper):
    
    
    def get_chapter_list(self):
        chapter_list = []
        lists = self.soup.find_all('ul', class_='main version-chap no-volumn')
        if len(lists) <= 0: return 4099
        for chapter in lists[0].find_all('li'):
            try :
                self.format_date(chapter.find('i').text)
            except ValueError:
                return 4003
            chap = {'chapter': chapter.find('a').text,'date' : self.format_date(chapter.find('i').text)}
            chapter_list.append(chap)
        if len(chapter_list) <= 0: return 4003        
        self.chapter_list=chapter_list
        return 2001
    
    def format_date(self,date):
        # Split the input date string into components
        date_components = date.replace(',','').split()
    
        if len(date_components) < 2:
            raise ValueError("Invalid date string format")

        # Extract the month and check its length to determine the format
        month = date_components[0]
        month_format_str = '%B' if len(month) > 3 else '%b'
    
        # Define the format of the input date string
        date_format_str = f"{month_format_str} %d %Y"

        try:
            # Join the components back into a properly formatted date string
            formatted_date_str = ' '.join(date_components)

            # Parse the formatted date string into a datetime object
            date_object = datetime.strptime(formatted_date_str, date_format_str)
            date_result =date_object.strftime("%d/%m/%Y")
            
            return date_result
        except ValueError as e:
            raise ValueError(f"Invalid date string: {e}")
    
    def format_chapter_list(self):
        for chapter in self.chapter_list:
            #print(chapter)
            if not chapter['chapter'].lower().startswith('chapter'):
                index = chapter['chapter'].find('-')
                number = chapter['chapter'][index+2:]
                self.chapter_list[self.chapter_list.index(chapter)]['chapter'] = number
        return 2001
    
    def get_image(self):
        cover = self.soup.find_all('div', class_='summary_image')
        if len(cover) <= 0: return 4098
        image = cover[0].find('img')
        if image == None: return 4004
        self.image = image.get('srcset')
        return 2001
        
    def get_name(self):
        name_box = self.soup.find('div', class_='post-title')
        if name_box == None: return 4097
        name = name_box.find('h1')
        if name == None: return 4004
        self.name = name.text.strip()
        return 2001
        
        
class Fstkissmanga(Site):
    def __init__(self, name="fstkissmanga"):
        super().__init__(name)
        self.scraper = Fstkiss_Scrapper()
        