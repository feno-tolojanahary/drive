import { Router } from "express";

export interface IRouteContructor {
    new (router: Router): IRoute;
}

export interface IRoute {
    routes(): void;                                                       
}