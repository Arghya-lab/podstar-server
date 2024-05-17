import { Request } from "express";

export type SearchPodcastsRequest = Request<
  {},
  any,
  {},
  | {
      query: string;
      page: number;
      perPage: number;
    }
  | any,
  Record<string, any>
>;

export type GetPodcastsInfoRequest = Request<
  {},
  {},
  {},
  {
    id: string;
  },
  {}
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

export type ValidateEmailForForgotPasswordRequest = Request<
  {},
  any,
  {},
  {
    email: string;
  },
  Record<string, any>
>;
