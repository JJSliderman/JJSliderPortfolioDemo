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

export const useGetAnswers = (username: string) => {
  const { access } = useContext(AuthContext);
  return useQuery({
    queryFn: async () => {
      const response = await fetch(`${getDemoURL}/${username}`, {
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
    queryKey: ["answers", username],
  });
};

export const useLastDemo = () => {
  return useQuery({
    queryFn: async () => {
      const response = await fetch(`${BaseUrl}/theLast`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Unable to get last used demo data");
      }
      return loginSchema.parse(await response.json());
    },
    queryKey: ["lastDemo"],
  });
};

export const useLogin = (username: string, password: string, route: string) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAccess, setRefresh, setLoggedInUser } = useContext(AuthContext);
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BaseUrl}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Unable to login");
      }
      return loginSchema.parse(await response.json());
    },
    mutationKey: [username, password, "login"],
    onSuccess: (value) => {
      setRefresh(value.refresh);
      setAccess(value.access);
      setLoggedInUser(value.loggedInUser);
      showAlert({ message: "Logged in!", severity: "success", open: true });
      navigate(route);
      queryClient.invalidateQueries({
        queryKey: [username, password, "login"],
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
  username: string,
  step: number,
  maxStep: number,
  stepChange: () => void
) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { access } = useContext(AuthContext);
  return useMutation({
    mutationFn: async (newValue: string) => {
      const response = await fetch(setDemoURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ step, maxStep, username, newValue }),
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
