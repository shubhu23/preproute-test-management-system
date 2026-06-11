import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getTests,
  getTestById,
  deleteTest,
  createTest,
  updateTest,
} from "../api/testApi";

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tests"],
      });
    },
  });
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTest,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["test", variables.id],
      });
    },
  });
};

export const useTests = () => {
  return useQuery({
    queryKey: ["tests"],
    queryFn: () => getTests(),
  });
};

export const useTest = (
  id: string
) => {
  return useQuery({
    queryKey: ["test", id],
    queryFn: () =>
      getTestById(id),
    enabled: !!id,
  });
};

export const useDeleteTest =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: deleteTest,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: ["tests"],
          }
        );
      },
    });
  };