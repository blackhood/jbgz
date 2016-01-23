import re, urllib2

class Blackdog:

    def __init__(self):
    
        self.webs = {
                        '91': 'http://sh.k7p.work/index.php',
                        'bobo': 'http://www.boboporn.com/videos?o=bw',
                        'caoliu': 'http://cl.1024ab.tk/thread0806.php?fid=22',
                    }

    def get_from_91 (self):
        pass

    def get_from_bobo (self, page_num):
        bobo_url = self.webs['bobo']
        bobo_url += "&page=%s" % page_num

        print bobo_url

        # every page there are 18 videos
        conn = urllib2.urlopen(bobo_url)
        html = conn.read()

        p = re.compile(".*<a href=\"(/video/\d*/.*)\">")
        reg = p.findall(html)
        videos = []
        for match in reg:
            # print match
            video_link = "http://www.boboporn.com/" + match
            print video_link

            # find the length of this video

            video = self.get_source(video_link, "bobo")
            videos.append(video)
        return videos

    def get_from_caoliu (self):
        pass

    def push_to_mongo (self):
        pass

    def get_source(link, web, length=None):
        if web == "bobo":
            html = urllib2.urlopen(link).read()
            # find video source link
            p = re.complie ("file:\"(.*.mp4)\"")
            source = p.findall(html)[0]
            
            # find video image
            p = re.complie ("image: \"(.*)\"")
            img = p.findall(html)[0]

            # find name of this video
            p = re.compile ("<title>(.*) - BoBoPorn</title>")
            title = p.findall(html)[0]

            v = {
                    "user_id" : "507c7f79bcf86cd7994f6c0e",
                    "user_name" : "woxingliu",
                    "title" : title,
                    "src" : source,
                    "duration" : length,
                    "thumnail" : img,
                    "views" : 0,
                }
            return v

blackdog = Blackdog()
print blackdog.get_from_bobo(1)

