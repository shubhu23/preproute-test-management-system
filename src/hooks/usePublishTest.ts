import {
 useMutation,
 useQueryClient,
} from "@tanstack/react-query";

import { publishTest }
from "../api/testApi";

export const usePublishTest =
 () => {
  const queryClient =
   useQueryClient();

  return useMutation({
   mutationFn:
    publishTest,

   onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["tests"],
    });
   },
  });
 };