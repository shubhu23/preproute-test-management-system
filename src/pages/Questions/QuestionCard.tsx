import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Box,
} from "@mui/material";

export default function QuestionCard({
  question,
  index,
  onEdit,
  onDelete,
}: any) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  const getCorrectOptionLabel = (option: string) => {
    const labels: any = {
      option1: "A",
      option2: "B",
      option3: "C",
      option4: "D",
    };
    return labels[option] || option;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{ fontWeight: 600, mb: 1 }}
          >
            Q{index + 1}. {question.question}
          </Typography>
        </Box>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>A.</strong> {question.option1}
          </Typography>

          <Typography variant="body2">
            <strong>B.</strong> {question.option2}
          </Typography>

          <Typography variant="body2">
            <strong>C.</strong> {question.option3}
          </Typography>

          <Typography variant="body2">
            <strong>D.</strong> {question.option4}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, flexWrap: "wrap" }}
        >
          {question.correct_option && (
            <Chip
              label={`Correct: ${getCorrectOptionLabel(
                question.correct_option
              )}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}

          {question.difficulty && (
            <Chip
              label={`Difficulty: ${question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}`}
              color={getDifficultyColor(
                question.difficulty
              )}
              size="small"
            />
          )}
        </Stack>

        {question.explanation && (
          <Box sx={{ mb: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Explanation:
            </Typography>
            <Typography variant="caption" display="block">
              {question.explanation}
            </Typography>
          </Box>
        )}

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={onEdit}
          >
            Edit
          </Button>

          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={onDelete}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}