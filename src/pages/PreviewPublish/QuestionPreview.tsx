import {
 Card,
 CardContent,
 Typography,
 Chip,
 Stack,
} from "@mui/material";

export default function QuestionPreview({
 question,
 index,
}: any) {
 return (
  <Card>
   <CardContent>

    <Stack
      direction="row"
      sx={{ justifyContent: "space-between" }}
    >
      <Typography
        sx={{ fontWeight: 700 }}
      >
        Q{index + 1}
      </Typography>

      <Chip
        label={
          question.difficulty
        }
      />
    </Stack>

    <Typography sx={{ mt: 2 }}>
      {question.question}
    </Typography>

    <Typography sx ={{ mt: 1 }}>
      A. {question.option1}
    </Typography>

    <Typography>
      B. {question.option2}
    </Typography>

    <Typography>
      C. {question.option3}
    </Typography>

    <Typography>
      D. {question.option4}
    </Typography>

    <Typography
      color="success.main"
      sx={{ mt: 2 }}
    >
      Correct:
      {
        question.correct_option
      }
    </Typography>

   </CardContent>
  </Card>
 );
}