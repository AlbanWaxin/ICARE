# This file is used to test the functions in the scrape module
from manhuascan import ManhuaScan_Scrapper
from fstkissmanga import fstkiss_Scrapper

ms_scrapper = ManhuaScan_Scrapper()
# ms_scrapper.new_url("https://manhuascan.io/manga/10557-the-baby-isnt-yours")
# ms_scrapper.run_all()
# print(ms_scrapper.return_webtoon())

ms_scrapper.new_url("https://manhuascan.io/manga/102-lady-baby")
#ms_scrapper.run_all()
#print(ms_scrapper.return_webtoon())

fs_scrapper = fstkiss_Scrapper()
fs_scrapper.new_url("https://1st-kissmanga.net/manga/heart-warming-meals-with-mother-fenrir/")
fs_scrapper.run_all()
print(fs_scrapper.return_webtoon()) 
