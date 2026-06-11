import { useQuery } from "@tanstack/react-query";

import { fetchBulkQuestions }
from "../api/questionApi";

export const useFetchQuestions =
 (
  questionIds: string[]
 ) => {
  return useQuery({
   queryKey: [
    "questions",
    questionIds,
   ],

   queryFn: () =>
    fetchBulkQuestions(
      questionIds
    ),

   enabled:
    questionIds.length > 0,
  });
 };