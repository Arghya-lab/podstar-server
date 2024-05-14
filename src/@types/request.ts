import { Request } from "express";

export type SearchPodcastsRequest = Request<
  {},
  {},
  {},
  {
    query: string;
    page: number;
    perPage: number;
    [key: string]: any;
  }
>;

export type GetPodcastsInfoRequest = Request<
  {},
  {},
  {},
  {
    id?: string;
    feedUrl?: string;
    [key: string]: any;
  }
>;

export type AddPodcastRequest = Request<
  {},
  {},
  {
    feedUrl: string;
    [key: string]: any;
  }
>;

export type LocalSignupRequest = Request<
  {},
  {},
  {
    userName: string;
    email: string;
    password: string;
    [kay: string]: any;
  }
>;

export type VerifyEmailRequest = Request<
  {},
  any,
  {},
  {
    token: string;
  },
  Record<string, any>
>;
