import axios from "axios";
import React, { useState, createContext } from "react";

interface UserContextValue {
  loading: boolean;
  error: null | string;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  applied: boolean;
  stats: { message: string; avg_positions: number; avg_salary: number; total_jobs: number; min_salary: number; max_salary: number; } | null;
  newJob: (data: any, access_token: string) => Promise<void>;
  updateJob: (id: string, data: any, access_token: string) => Promise<void>;
  deleteJob: (id: string, access_token: string) => Promise<void>;
  applyToJob: (id: string, access_token: string) => Promise<void>;
  getTopicStats: (topic: string) => Promise<void>;
  setCreated: (created: boolean) => void;
  setUpdated: (updated: boolean) => void;
  setDeleted: (deleted: boolean) => void;
  checkJobApplied: (id: string, access_token: string) => Promise<void>;
  clearErrors: () => void;
}

const JobContext = createContext<UserContextValue>({
  loading: false,
  error: null,
  created: false,
  updated: false,
  deleted: false,
  applied: false,
  stats: null,
  newJob: async () => { },
  updateJob: async () => { },
  deleteJob: async () => { },
  applyToJob: async () => { },
  getTopicStats: async () => { },
  setCreated: (created: boolean) => { },
  setUpdated: (updated: boolean) => { },
  setDeleted: (deleted: boolean) => { },
  checkJobApplied: async () => { },
  clearErrors: () => { },
});

export const JobProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [applied, setApplied] = useState(false);
  const [stats, setStats] = useState(null);

  // Create a new job
  const newJob = async (data, access_token) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.API_URL}/api/jobs/new/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data) {
        setLoading(false);
        setCreated(true);
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Update job
  const updateJob = async (id, data, access_token) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.API_URL}/api/jobs/${id}/update/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data) {
        setLoading(false);
        setUpdated(true);
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Apply to Job
  const applyToJob = async (id, access_token) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.API_URL}/api/jobs/${id}/apply/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data.applied === true) {
        setLoading(false);
        setApplied(true);
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Check job applied
  const checkJobApplied = async (id, access_token) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.API_URL}/api/jobs/${id}/check/`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setLoading(false);
      setApplied(res.data);
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Get topic stats
  const getTopicStats = async (topic) => {
    try {
      setLoading(true);

      const res = await axios.get(`${process.env.API_URL}/api/stats/${topic}/`);

      setLoading(false);
      setStats(res.data);
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Delete job
  const deleteJob = async (id, access_token) => {
    try {
      setLoading(true);

      const res = await axios.delete(
        `${process.env.API_URL}/api/jobs/${id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setLoading(false);
      setDeleted(true);
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Clear Errors
  const clearErrors = () => {
    setError(null);
  };

  return (
    <JobContext.Provider
      value={{
        loading,
        error,
        created,
        updated,
        deleted,
        applied,
        stats,
        newJob,
        updateJob,
        deleteJob,
        getTopicStats,
        applyToJob,
        setUpdated,
        checkJobApplied,
        setCreated,
        setDeleted,
        clearErrors,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
