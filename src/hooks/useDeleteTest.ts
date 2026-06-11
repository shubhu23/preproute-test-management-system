import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";

import { deleteTest } from "../api/testApi";

export const useDeleteTest = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteTest,

    onMutate: async (
      deletedId
    ) => {
      await queryClient.cancelQueries({
        queryKey: ["tests"],
      });

      const previousTests =
        queryClient.getQueryData<any>([
          "tests",
        ]);

      queryClient.setQueryData(
        ["tests"],
        (old: any[]) =>
          old?.filter(
            (test) =>
              test.id !== deletedId
          )
      );

      return {
        previousTests,
      };
    },

    onError: (
      _error,
      _variables,
      context
    ) => {
      queryClient.setQueryData(
        ["tests"],
        context?.previousTests
      );

      toast.error(
        "Failed to delete test"
      );
    },

    onSuccess: () => {
      toast.success(
        "Test deleted successfully"
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tests"],
      });
    },
  });
};