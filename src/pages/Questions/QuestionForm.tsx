import {
  Grid,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

import {
  useForm,
  Controller,
} from "react-hook-form";

import {
  useEffect,
} from "react";

export default function QuestionForm({
  onSubmit,
  defaultValues,
  formResetRef,
}: any) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: defaultValues || {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_option: "",
      difficulty: "",
      explanation: "",
    },
  });

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues]);

  // Provide reset function via ref for external clearing
  useEffect(() => {
    const resetForm = () =>
      reset({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct_option: "",
        difficulty: "",
        explanation: "",
      });

    if (formResetRef) {
      formResetRef.current = resetForm;
    }

    return () => {
      if (formResetRef) {
        formResetRef.current = null;
      }
    };
  }, [reset, formResetRef]);

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    reset({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_option: "",
      difficulty: "",
      explanation: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(
        handleFormSubmit
      )}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid size={12}>
          <TextField
            fullWidth
            label="Question"
            {...register(
              "question",
              {
                required: true,
              }
            )}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            label="Option 1"
            {...register(
              "option1"
            )}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            label="Option 2"
            {...register(
              "option2"
            )}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            label="Option 3"
            {...register(
              "option3"
            )}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            label="Option 4"
            {...register(
              "option4"
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="correct_option"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label="Correct Option"
                {...field}
              >
                <MenuItem value="option1">
                  Option 1
                </MenuItem>

                <MenuItem value="option2">
                  Option 2
                </MenuItem>

                <MenuItem value="option3">
                  Option 3
                </MenuItem>

                <MenuItem value="option4">
                  Option 4
                </MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label="Difficulty"
                {...field}
              >
                <MenuItem value="easy">
                  Easy
                </MenuItem>

                <MenuItem value="medium">
                  Medium
                </MenuItem>

                <MenuItem value="hard">
                  Hard
                </MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Explanation"
            {...register(
              "explanation"
            )}
          />
        </Grid>

        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Question"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
