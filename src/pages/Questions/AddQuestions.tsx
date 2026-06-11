import {
  Box,
  Button,
  Typography,
  Stack,
} from "@mui/material";

import {
  useState,
  useRef,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import QuestionForm from "./QuestionForm";

import QuestionCard from "./QuestionCard";

import {
  useCreateQuestions,
} from "../../hooks/useQuestions";

export default function AddQuestions() {
  const navigate =
    useNavigate();

  const mutation =
    useCreateQuestions();

  const [questions,
    setQuestions] =
    useState<any[]>([]);

  const [editingIndex,
    setEditingIndex] =
    useState<
      number | null
    >(null);

  const formResetRef =
    useRef<
      (() => void) | null
    >(null);

  const testId =
    localStorage.getItem(
      "currentTestId"
    );

  const subject =
    localStorage.getItem(
      "currentTestSubject"
    );

  const handleAddQuestion =
    (data: any) => {
      if (
        editingIndex !== null
      ) {
        const updated =
          [...questions];

        updated[
          editingIndex
        ] = data;

        setQuestions(
          updated
        );

        setEditingIndex(
          null
        );

        if (
          formResetRef.current
        ) {
          formResetRef.current();
        }

        return;
      }

      setQuestions([
        ...questions,
        data,
      ]);
    };

  const handleDelete =
    (index: number) => {
      setQuestions(
        questions.filter(
          (_, i) =>
            i !== index
        )
      );
    };

  const handleCancelEdit =
    () => {
      setEditingIndex(
        null
      );

      if (
        formResetRef.current
      ) {
        formResetRef.current();
      }
    };

  const handleSave =
    async () => {
      if (
        questions.length === 0
      ) {
        alert(
          "Add at least one question"
        );

        return;
      }

      const payload =
        questions.map(
          (q) => ({
            ...q,
            type: "mcq",
            subject,
            test_id:
              testId,
          })
        );

      const response =
        await mutation.mutateAsync(
          payload
        );

      const ids =
        response.data.map(
          (q: any) =>
            q.id
        );

      localStorage.setItem(
        "questionIds",
        JSON.stringify(ids)
      );

      navigate(
        "/tests/confirmation"
      );
    };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Add Questions
      </Typography>

      <Typography
        sx={{ mb: 3 }}
      >
        Total Questions:
        {questions.length}
      </Typography>

      {editingIndex !== null && (
        <Typography
          sx={{
            mb: 2,
            color: "orange",
            fontWeight: 600,
          }}
        >
          Editing Question{" "}
          {editingIndex + 1}
        </Typography>
      )}

      <QuestionForm
        onSubmit={
          handleAddQuestion
        }
        defaultValues={
          editingIndex !== null
            ? questions[
                editingIndex
              ]
            : undefined
        }
        formResetRef={
          formResetRef
        }
      />

      {editingIndex !== null && (
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          color="warning"
          onClick={
            handleCancelEdit
          }
        >
          Cancel Edit
        </Button>
      )}

      <Stack
        spacing={2}
        sx={{ mt: 4 }}
      >
        {questions.map(
          (
            question,
            index
          ) => (
            <QuestionCard
              key={index}
              question={
                question
              }
              index={index}
              onEdit={() =>
                setEditingIndex(
                  index
                )
              }
              onDelete={() =>
                handleDelete(
                  index
                )
              }
            />
          )
        )}
      </Stack>

      <Button
        sx={{ mt: 4 }}
        variant="contained"
        onClick={handleSave}
      >
        Save & Continue
      </Button>
    </Box>
  );
}