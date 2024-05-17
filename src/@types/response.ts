export interface PodcastIndexSearchFeedType {
  id: number;
  podcastGuid: string;
  title: string;
  url: string;
  originalUrl: string;
  link: string;
  description: string;
  author: string;
  ownerName: string;
  image: string;
  artwork: string;
  lastUpdateTime: number;
  lastCrawlTime: number;
  lastParseTime: number;
  lastGoodHttpStatusTime: number;
  lastHttpStatus: number;
  contentType: string;
  itunesId: number | null;
  generator: string;
  language: string;
  explicit: false;
  type: 0 | 1; // 0: RSS, 1: Atom
  medium: string;
  dead: number;
  episodeCount: number;
  crawlErrors: number;
  parseErrors: number;
  categories: {
    [key: string]: string;
  };
  locked: 0 | 1; //0: 'no',  1: 'yes'
  imageUrlHash: number;
  newestItemPubdate: number;
}

export interface PodcastIndexTrendingFeedType {
  id: number;
  url: string;
  title: string;
  description: string;
  author: string;
  image: string;
  artwork: string;
  newestItemPublishTime: number;
  itunesId: number;
  trendScore: number;
  language: string;
  categories: {
    [key: string]: string;
  };
}

export interface PodcastIndexSearchResType {
  status: "true" | "false";
  feeds: PodcastIndexSearchFeedType[];
  count: number;
  query: string;
  description: string;
}

export interface PodcastIndexTrendingResType {
  status: "true" | "false";
  feeds: PodcastIndexTrendingFeedType[];
  count: number;
  max: number;
  since: number;
  description: string;
}
