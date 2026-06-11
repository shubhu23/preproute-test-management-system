import {
 Box,
 Button,
 CircularProgress,
 Stack,
 Typography,
} from "@mui/material";

import {
 useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import TestSummary
from "./TestSummary";

import QuestionPreview
from "./QuestionPreview";

import { useTest }
from "../../hooks/useTests";

import { useFetchQuestions }
from "../../hooks/useFetchQuestions";

import { usePublishTest }
from "../../hooks/usePublishTest";

export default function PreviewPublish() {

 const navigate =
  useNavigate();

 const testId =
  localStorage.getItem(
   "currentTestId"
  ) || "";

 const questionIds =
  JSON.parse(
   localStorage.getItem(
    "questionIds"
   ) || "[]"
  );

 const {
  data: test,
  isLoading:
   testLoading,
 } = useTest(testId);

 const {
  data: questions = [],
  isLoading:
   questionLoading,
 } =
  useFetchQuestions(
   questionIds
  );

 const publishMutation =
  usePublishTest();

 const handlePublish =
  async () => {
   try {
    await publishMutation.mutateAsync(
      testId
    );

    toast.success(
      "Test Published Successfully"
    );

    navigate(
      "/dashboard"
    );

   } catch {
    toast.error(
      "Unable to publish test"
    );
   }
  };

 if (
  testLoading ||
  questionLoading
 ) {
  return (
   <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
    <CircularProgress />
   </Box>
  );
 }

 return (
  <Box sx = {{ p: 4 }}>

   <Typography
     variant="h4"
     sx={{ mb: 3 }}
   >
     Preview Test
   </Typography>

   <TestSummary
     test={test}
   />

   <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 3 }}>
     <Button
       variant="outlined"
       onClick={() =>
         navigate(
           `/tests/${testId}/edit`
         )
       }
     >
       Edit Test
     </Button>

     <Button
       variant="outlined"
       onClick={() =>
         navigate(
           `/tests/${testId}/questions`
         )
       }
     >
       Edit Questions
     </Button>
   </Stack>

   <Typography
     variant="h5"
     sx={{ mb: 2 }}
   >
     Questions
   </Typography>

   <Stack spacing={2}>
     {questions.map(
       (
         question: any,
         index: number
       ) => (
         <QuestionPreview
           key={
             question.id
           }
           question={
             question
           }
           index={index}
         />
       )
     )}
   </Stack>

   <Button
     variant="contained"
     size="large"
     sx={{ mt: 4 }}
     onClick={
       handlePublish
     }
     disabled={
       publishMutation.isPending
     }
   >
     Publish Test
   </Button>

  </Box>
 );
}