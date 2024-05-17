import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import {
  PodcastIndexSearchResType,
  PodcastIndexTrendingResType,
} from "../@types/response";

dotenv.config();

// ======== Required values ========
const apiKey = process.env.PODCAST_INDEX_API_KEY!;
const apiSecret = process.env.PODCAST_INDEX_API_SECRET!;

// ======== Hash them to get the Authorization token ========
const apiHeaderTime = Math.floor(Date.now() / 1000);
const data4Hash = apiKey + apiSecret + apiHeaderTime;
const hash4Header = crypto.createHash("sha1").update(data4Hash).digest("hex");

const axiosInstance = axios.create({
  baseURL: "https://api.podcastindex.org/api/1.0",
  headers: {
    "X-Auth-Date": apiHeaderTime,
    "X-Auth-Key": apiKey,
    Authorization: hash4Header,
    // "User-Agent": "SuperPodcastPlayer/1.8",
  },
});

export async function searchPodcastIdxFeed(query: string) {
  try {
    const { data }: { data: PodcastIndexSearchResType } =
      await axiosInstance.get(`/search/byterm?q=${query}`);
    return data;
  } catch (error) {
    console.error("Error making search request in podcast index.");
  }
}

export async function getPodcastIdxTrending() {
  try {
    const { data }: { data: PodcastIndexTrendingResType } =
      await axiosInstance.get("/podcasts/trending?lang=en");
    return data;
  } catch (error) {
    console.error("Error making trending request in podcast index.");
  }
}
