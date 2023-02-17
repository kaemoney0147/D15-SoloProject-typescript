import express from "express";
import createHttpError from "http-errors";
import AccomodationsModel from "./model.js";
import { UserRequest } from "../users/index";
// import q2m from "query-to-mongo";
// import {UserInterface} from '../accommodation/model'
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";

const accommodationRouter = express.Router();

accommodationRouter.post(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const reqs = req as UserRequest;
      const newAccomodation = new AccomodationsModel({
        ...req.body,
        user: reqs.user._id,
      });
      const { _id } = await newAccomodation.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

accommodationRouter.get(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accomodation = await AccomodationsModel.find();
      res.send(accomodation);
    } catch (error) {
      next(error);
    }
  }
);

accommodationRouter.get(
  "/me",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const reqs = req as UserRequest;
      const accomodation = await AccomodationsModel.find({
        user: req.user._id,
      }).populate({
        path: "user",
      });
      if (accomodation) {
        res.send(accomodation);
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accomodationId} is not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

accommodationRouter.put(
  "/me/:accomodationId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accomodationToUpdate = await AccomodationsModel.findById(
        req.params.accomodationId
      ).populate({
        path: "user",
      });
      if (accomodationToUpdate) {
        const myPost =
          accomodationToUpdate.user._id.toString() === req.user._id.toString();

        if (myPost) {
          const updatedAccomodation =
            await AccomodationsModel.findByIdAndUpdate(
              req.params.accomodationId,
              req.body,
              { new: true, runValidators: true }
            );
          res.send(updatedAccomodation);
        } else {
          next(createHttpError(403, "It's not your post"));
        }
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accomodationId} is not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
accommodationRouter.delete(
  "/me/:accomodationId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accomodationToDelete = await AccomodationsModel.findById(
        req.params.accomodationId
      ).populate({
        path: "user",
      });
      if (accomodationToDelete) {
        const myPost =
          accomodationToDelete.user._id.toString() === req.user._id.toString();

        if (myPost) {
          const updatedAccomodation =
            await AccomodationsModel.findByIdAndDelete(
              req.params.accomodationId
            );
          res.status(204).send();
        } else {
          next(createHttpError(403, "It's not your post"));
        }
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accomodationId} is not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

accommodationRouter.get(
  "/:accomodationId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findById(
        req.params.accomodationId
      ).populate({
        path: "user",
      });
      if (accomodation) {
        res.send(accomodation);
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accomodationId} is not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
export default accommodationRouter;
