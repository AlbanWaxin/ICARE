# This file is used to test the functions in the scrape module
#from manhuascan import ManhuaScan_Scrapper

#ms_scrapper = ManhuaScan_Scrapper()
# ms_scrapper.new_url("https://manhuascan.io/manga/10557-the-baby-isnt-yours")
# ms_scrapper.run_all()
# print(ms_scrapper.return_webtoon())

#ms_scrapper.new_url("https://manhuascan.io/manga/102-lady-baby")
#ms_scrapper.run_all()
#print(ms_scrapper.return_webtoon())

import re

s = "Chapter 1, Chapter 2.5, and Chapter 3.14 are important sections of the book."
pattern = r"(Chapter\s+\d+\.\d+)?"
matches = re.findall(pattern, s)
print(matches)
