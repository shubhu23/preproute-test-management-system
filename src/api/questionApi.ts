import api from "./axios";

export const createQuestions = async (
  questions: any[]
) => {
  const response =
    await api.post(
      "/questions/bulk",
      {
        questions,
      }
    );

  return response.data;
};

export const fetchBulkQuestions =
 async (
   question_ids: string[]
 ) => {
  const response =
   await api.post(
     "/questions/fetchBulk",
     {
       question_ids,
     }
   );

  return response.data.data;
 };

export const updateQuestion = async (
  id: string,
  data: any
) => {
  const response =
    await api.put(
      `/questions/${id}`,
      data
    );

  return response.data;
};