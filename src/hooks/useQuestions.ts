import { useMutation } from "@tanstack/react-query";

import { createQuestions, updateQuestion } from "../api/questionApi";

export const useCreateQuestions =
  () => {
    return useMutation({
      mutationFn:
        createQuestions,
    });
  };

export const useUpdateQuestion = () => {
  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      updateQuestion(id, data),
  });
};