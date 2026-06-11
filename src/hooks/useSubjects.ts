import { useQuery } from "@tanstack/react-query";
import { getSubjects, getTopicsBySubject, getSubTopics, getSubTopicsByTopics } from "../api/subjectApi";

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
};

export const useTopics = (
  subjectId: string
) => {
  return useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () =>
      getTopicsBySubject(subjectId),
    enabled: !!subjectId,
  });
};

export const useSubTopics = (
  topicId: string
) => {
  return useQuery({
    queryKey: ["sub-topics", topicId],
    queryFn: () =>
      getSubTopics(topicId),
    enabled: !!topicId,
  });
};

export const useSubTopicsByTopics = (
  topicIds: string[]
) => {
  return useQuery({
    queryKey: ["sub-topics", topicIds],
    queryFn: () =>
      getSubTopicsByTopics(topicIds),
    enabled: topicIds.length > 0,
  });
};