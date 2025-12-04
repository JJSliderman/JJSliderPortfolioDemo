import {
  deleteCrewmateURL,
  getCrewURL,
  getDemoURL,
  retireCrewmateURL,
  setCrewmateURL,
  setCrewURL,
  setDemoURL,
} from "../utils/urls/DemoUrls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { AuthContext, useAlert } from "..";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { BaseUrl } from "../utils/urls/BaseUrl";
// Source of API calls, connecting the backend to the frontend. Make new ones to perform
// other backend actions, involving changing new elements added by independent parties.
export const apiSuccessSchema = z.object({ status: z.literal("success") });

export const crewSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  organizername: z.string(),
});
export const crewmateSchema = z.object({
  teamname: z.string(),
  name: z.string(),
  color: z.string(),
  epithet: z.string(),
  retired: z.boolean(),
  enlistment: z.coerce.date(),
});

export const answersSchema = apiSuccessSchema.extend({
  answers: z.string().array(),
});

export const getCrewSchema = apiSuccessSchema.extend({
  crew: crewSchema,
  crewmates: crewmateSchema.array(),
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
    enabled: loggedInUser !== "",
    queryKey: ["answers", loggedInUser, step],
  });
};

export const useGetCrew = (
  filter: {
    name: string;
    color: string;
    enlistment: Date | null;
    epithet: string;
    retired: string;
  },
  sortBy: string,
  direction: string,
  page: number,
  rows: number,
  editOccurred: boolean
) => {
  const { access, loggedInUser } = useContext(AuthContext);
  return useQuery({
    queryFn: async () => {
      const response = await fetch(
        `${getCrewURL}/${loggedInUser}?name=${filter.name}&color=${
          filter.color
        }&retired=${filter.retired}&epithet=${filter.epithet}&enlistment=${
          filter.enlistment?.getTime().toString() ?? ""
        }&sortBy=${sortBy}&direction=${direction}&page=${page.toString()}&rows=${rows.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Unable to get crew");
      }
      return getCrewSchema.parse(await response.json());
    },
    enabled: loggedInUser !== "",
    queryKey: [
      "crew",
      loggedInUser,
      page,
      rows,
      filter,
      direction,
      sortBy,
      editOccurred,
    ],
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

export const useSetCrew = (
  stepChange: () => void,
  name: string,
  symbol: string
) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { access, loggedInUser } = useContext(AuthContext);
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(setCrewURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          symbol,
          username: loggedInUser,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to set crew data");
      }
      return apiSuccessSchema.parse(await response.json());
    },
    mutationKey: ["setCrew"],
    onSuccess: () => {
      showAlert({
        message: "Crew information Saved!",
        severity: "success",
        open: true,
      });
      stepChange();
      queryClient.invalidateQueries({ queryKey: ["setCrew"] });
    },
    onError: () => {
      showAlert({
        message: "Unable to save crew data!",
        severity: "error",
        open: true,
      });
    },
  });
};

export const useSetCrewmate = (
  stepChange: () => void,
  name: string,
  epithet: string,
  leader: string,
  color: string,
  oldname: string
) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { access, loggedInUser } = useContext(AuthContext);
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(setCrewmateURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          epithet,
          color,
          organizer: loggedInUser,
          leader,
          oldname,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to set crewmate data");
      }
      return apiSuccessSchema.parse(await response.json());
    },
    mutationKey: ["setCrewmate"],
    onSuccess: () => {
      showAlert({
        message: "Crewmate information Saved!",
        severity: "success",
        open: true,
      });
      stepChange();
      queryClient.invalidateQueries({ queryKey: ["setCrewmate"] });
    },
    onError: () => {
      showAlert({
        message: "Unable to save crewmate data!",
        severity: "error",
        open: true,
      });
    },
  });
};

export const useRetireCrewmate = (
  stepChange: () => void,
  name: string,
  leader: string
) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { access, loggedInUser } = useContext(AuthContext);
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(retireCrewmateURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          organizer: loggedInUser,
          leader,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to retire crewmate");
      }
      return apiSuccessSchema.parse(await response.json());
    },
    mutationKey: ["retireCrewmate"],
    onSuccess: () => {
      showAlert({
        message: "Crewmate Retired!",
        severity: "success",
        open: true,
      });
      stepChange();
      queryClient.invalidateQueries({ queryKey: ["retireCrewmate"] });
    },
    onError: () => {
      showAlert({
        message: "Unable to retire crewmate!",
        severity: "error",
        open: true,
      });
    },
  });
};

export const useDeleteCrewmate = (
  stepChange: () => void,
  name: string,
  leader: string
) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { access, loggedInUser } = useContext(AuthContext);
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(deleteCrewmateURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          organizer: loggedInUser,
          leader,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to remove crewmate");
      }
      return apiSuccessSchema.parse(await response.json());
    },
    mutationKey: ["deleteCrewmate"],
    onSuccess: () => {
      showAlert({
        message: "Crewmate Removed!",
        severity: "success",
        open: true,
      });
      stepChange();
      queryClient.invalidateQueries({ queryKey: ["deleteCrewmate"] });
    },
    onError: () => {
      showAlert({
        message: "Unable to remove crewmate!",
        severity: "error",
        open: true,
      });
    },
  });
};
