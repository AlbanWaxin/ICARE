from Sites.util import Site,Scraper
import re
from datetime import datetime, timedelta

class KaliScan_Scrapper(Scraper):
    
    def check_list(self,lists):
        for list in lists:
            elements = list.find_all('li')
            if len(elements) <= 0 :  continue
            checked_e = True    
            for e in elements:
                if not ("c-" in e.get('id')): 
                    checked_e = False
                    break
            if checked_e:
                return list
        return 4003
    
    def get_chapter_list(self):
        chapter_list = []
        lists = self.soup.find_all('ul', class_='chapter-list')
        if len(lists) <= 0: return 4099
        chap_list = self.check_list(lists)
        if type(chap_list) == int: return chap_list
        for chapter in chap_list.find_all('li'):
            try :
                self.format_date(chapter.find('time').text)
            except ValueError:
                return 4003
            chap = {'chapter': chapter.find('a').get('title'),'date' : self.format_date(chapter.find('time').text)}
            chapter_list.append(chap)
        if len(chapter_list) <= 0: return 4003        
        self.chapter_list=chapter_list
        return 2001

    def format_date(self,date):
        match = re.match(r'(\d+) (day|month|week|year|minute|hour)s? ago', date)
        if match:
            quantity = int(match.group(1))
            unit = match.group(2)
        
            now = datetime.now()

            if unit == 'day':
                date_result = now - timedelta(days=quantity)
            elif unit == 'week':
                date_result = now - timedelta(weeks=quantity)
            elif unit == 'month':
                date_result = now - timedelta(days=quantity * 30)
            elif unit == 'year':
                date_result = now - timedelta(days=quantity * 365)
            elif unit == 'hour':
                date_result = now - timedelta(hours=quantity)
            elif unit == 'minute':
                date_result = now - timedelta(minutes=quantity)
            else:
                raise ValueError("Unsupported time unit")
            date_result =date_result.strftime("%d/%m/%Y")
            return date_result
        else:
            raise ValueError("Unsupported time format")

    def format_chapter_list(self):
        for chapter in self.chapter_list:
            pattern = r"(Chapter\s+\d+\.*\d*)?"
            matches = re.findall(pattern, chapter['chapter'])
            value = ''.join(matches)
            if not value.lower().startswith('chapter'):
                value = "Chapter " + ''.join(re.findall(r'\d+', value))
            value = value.replace("Chapter ","Chp. ")
            self.chapter_list[self.chapter_list.index(chapter)]['chapter'] = value
            print(value)
        return 2001
    
    def get_image(self):
        cover = self.soup.find_all('div', class_='img-cover')
        if len(cover) <= 0: return 4098
        image = cover[0].find('img')
        if image == None: return 4004
        self.image = image.get('data-src')
        return 2001
        
    def get_name(self):
        name_box = self.soup.find('div', class_='name box')
        if name_box == None: return 4097
        name = name_box.find('h1')
        if name == None: return 4004
        self.name = name.text.strip()
        return 2001
        
        
class KaliScan(Site):
    def __init__(self, name="KaliScan"):
        super().__init__(name)
        self.scraper = KaliScan_Scrapper()
