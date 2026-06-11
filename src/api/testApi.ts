import api from "./axios";
import { type Test } from "../types/test";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getTests =
 async (
  params?: {
   search?: string;
   status?: string;
  }
 ) => {
  const res =
   await api.get("/tests", {
    params,
   });

  return res.data.data;
 };

export const getTestById =
  async (
    id: string
  ): Promise<Test> => {
    const response =
      await api.get<
        ApiResponse<Test>
      >(`/tests/${id}`);

    return response.data.data;
  };

export const deleteTest = async (
  testId: string
) => {
  const response =
    await api.delete(
      `/tests/${testId}`
    );

  return response.data;
};

export const publishTest =
 async (
   testId: string
 ) => {
  const response =
   await api.put(
     `/tests/${testId}`,
     {
       status: "live",
     }
   );

  return response.data;
 };

export const createTest = async (
  payload: CreateTestPayload
) => {
  const response = await api.post<
    ApiResponse<Test>
  >("/tests", payload);

  return response.data;
};

export const updateTest = async ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<Test>;
}) => {
  const response = await api.put(
    `/tests/${id}`,
    payload
  );

  return response.data;
};