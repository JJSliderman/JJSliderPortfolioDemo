import { getDemoURL, setDemoURL } from "../utils/urls/DemoUrls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { AuthContext, useAlert } from "..";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { BaseUrl } from "../utils/urls/BaseUrl";
// Source of API calls, connecting the backend to the frontend. Make new ones to perform
// other backend actions, involving changing new elements added by independent parties.
export const apiSuccessSchema = z.object({ status: z.literal("success") });

export const answersSchema = apiSuccessSchema.extend({
  answers: z.string().array(),
});

export const loginSchema = apiSuccessSchema.extend({
  access: z.string(),
  refresh: z.string(),
  loggedInUser: z.string(),
});

export const useGetAnswers = (step: number) => {
  const { access, loggedInUser } = useContext(AuthContext);
  return useQuery({
    queryFn: async () => {
      const response = await fetch(`${getDemoURL}/${loggedInUser}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Unable to get answers");
      }
      return answersSchema.parse(await response.json());
    },
    queryKey: ["answers", loggedInUser, step],
  });
};

export const useLastDemo = () => {
  const { showAlert } = useAlert();
  const { setRefresh, setAccess, setLoggedInUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: { username: string; password: string }) => {
      const response = await fetch(`${BaseUrl}/theLast/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: value.username,
          password: value.password,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to get last used demo data");
      }
      return loginSchema.parse(await response.json());
    },
    mutationKey: ["lastDemo"],
    onSuccess: (value) => {
      setRefresh(value.refresh);
      setAccess(value.access);
      setLoggedInUser(value.loggedInUser);
      showAlert({ message: "Logged in!", severity: "success", open: true });
      queryClient.invalidateQueries({
        queryKey: ["lastDemo"],
      });
    },
    onError: () => {
      showAlert({
        message: "Unable to login!",
        severity: "error",
        open: true,
      });
    },
  });
};

export const useLogin = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAccess, setRefresh, setLoggedInUser } = useContext(AuthContext);
  return useMutation({
    mutationFn: async (value: { username: string; password: string }) => {
      const response = await fetch(`${BaseUrl}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: value.username,
          password: value.password,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to login");
      }
      return loginSchema.parse(await response.json());
    },
    mutationKey: ["login"],
    onSuccess: (value) => {
      setRefresh(value.refresh);
      setAccess(value.access);
      setLoggedInUser(value.loggedInUser);
      showAlert({ message: "Logged in!", severity: "success", open: true });
      navigate("/route-one");
      queryClient.invalidateQueries({
        queryKey: ["login"],
      });
    },
    onError: () => {
      showAlert({
        message: "Unable to login!",
        severity: "error",
        open: true,
      });
    },
  });
};

export const useSetDemo = (
  step: number,
  maxStep: number,
  stepChange: () => void
) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { access, loggedInUser } = useContext(AuthContext);
  return useMutation({
    mutationFn: async (newValue: string) => {
      const response = await fetch(setDemoURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          step,
          maxStep,
          username: loggedInUser,
          newValue,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to set demo data");
      }
      return apiSuccessSchema.parse(await response.json());
    },
    mutationKey: ["setDemo"],
    onSuccess: () => {
      showAlert({ message: "Data Saved!", severity: "success", open: true });
      if (step === maxStep) {
        navigate("/route-two");
      } else {
        stepChange();
      }
      queryClient.invalidateQueries({ queryKey: ["setDemo"] });
    },
    onError: () => {
      showAlert({
        message: "Unable to save data!",
        severity: "error",
        open: true,
      });
    },
  });
};
