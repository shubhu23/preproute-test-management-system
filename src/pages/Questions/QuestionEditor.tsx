import {
  Box,
  Button,
  Typography,
  TextField,
  Radio,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../../components/Layout/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateQuestion, useCreateQuestions } from "../../hooks/useQuestions";
import { useSubjects } from "../../hooks/useSubjects";

interface QuestionEditorProps {
  initialQuestion?: any;
  questionIndex?: number;
}

export default function QuestionEditor({
  initialQuestion,
  questionIndex = 0,
}: QuestionEditorProps) {
  const navigate = useNavigate();
  const updateMutation = useUpdateQuestion();
  const createMutation = useCreateQuestions();

  const testId = localStorage.getItem("currentTestId");
  
  // Initialize all state first
  const [question, setQuestion] = useState(
    initialQuestion?.question || ""
  );
  const [options, setOptions] = useState([
    initialQuestion?.option1 || "",
    initialQuestion?.option2 || "",
    initialQuestion?.option3 || "",
    initialQuestion?.option4 || "",
  ]);
  const [correctOption, setCorrectOption] = useState(
    initialQuestion?.correct_option || "option1"
  );
  const [difficulty, setDifficulty] = useState(
    initialQuestion?.difficulty || ""
  );
  const [solution, setSolution] = useState(
    initialQuestion?.solution || ""
  );
  const [subject, setSubject] = useState(
    initialQuestion?.subject || localStorage.getItem("currentTestSubject") || ""
  );

  // Now call hooks after state is initialized
  const { data: subjects = [] } = useSubjects();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleSave = async () => {
    if (!question || options.slice(0, 4).some((opt) => !opt) || !subject) {
      alert("Please fill in all required fields (Question, 4 Options, and Subject)");
      return;
    }

    const questionData = {
      type: "mcq",
      question,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      ...(options[4] && { option5: options[4] }),
      ...(options[5] && { option6: options[5] }),
      correct_option: correctOption,
      difficulty: difficulty || undefined,
      subject,
      // ...(topic && { topic }),
      // ...(subTopic && { sub_topic: subTopic }),
      explanation: solution || undefined,
      test_id: testId,
    };

    try {
      if (initialQuestion?.id) {
        await updateMutation.mutateAsync({
          id: initialQuestion.id,
          ...questionData,
        });
      } else {
        await createMutation.mutateAsync([questionData]);
      }

      // Redirect to confirmation or next question
      navigate("/tests/confirmation");
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question");
    }
  };

  const handleNext = () => {
    handleSave();
  };

  const handlePrevious = () => {
    navigate("/tests/confirmation");
  };

  return (
    <Layout>
      <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Question {questionIndex + 1}
        </Typography>

        {/* Delete All Edits */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="text"
            sx={{ color: "#ef4444" }}
            onClick={() => {
              setQuestion("");
              setOptions(["", "", "", ""]);
              setCorrectOption("option1");
              setDifficulty("");
              setSolution("");
              setSubject(localStorage.getItem("currentTestSubject") || "");
            }}
          >
            ✕ Delete All Edits
          </Button>
        </Box>

        {/* Question Editor */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
            Question Text
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="Type here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9fafb",
              },
            }}
          />
        </Paper>

        {/* Options */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Type the options below
          </Typography>
          <Stack spacing={2}>
            {options.map((option, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  backgroundColor: "#f9fafb",
                  borderRadius: 1,
                }}
              >
                <Radio
                  checked={
                    correctOption === `option${index + 1}`
                  }
                  onChange={() =>
                    setCorrectOption(`option${index + 1}`)
                  }
                />
                <TextField
                  fullWidth
                  placeholder={`Type Option ${String.fromCharCode(65 + index)} here`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                    },
                  }}
                />
                {options.length > 4 && (
                  <IconButton
                    onClick={() => handleDeleteOption(index)}
                    size="small"
                  >
                    <DeleteIcon sx={{ color: "#ef4444" }} />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>

          {options.length < 6 && (
            <Button
              sx={{ mt: 2, textTransform: "none" }}
              onClick={handleAddOption}
            >
              + Add Option
            </Button>
          )}
        </Box>

        {/* Solution */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Add Solution
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Type here"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9fafb",
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Question Settings */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Question Settings
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={subject}
                label="Subject"
                onChange={(e) => setSubject(e.target.value)}
              >
                <MenuItem value="">Select Subject</MenuItem>
                {subjects.map((subj: any) => (
                  <MenuItem key={subj.id} value={subj.id}>
                    {subj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Level of Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Level of Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value="">Select from Drop-down</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Navigation Buttons */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between" }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#ef4444",
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={handlePrevious}
          >
            Exit Test Creation
          </Button>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              ← Previous
            </Button>

            <Button
              variant="contained"
              sx={{
                bgcolor: "#6366f1",
                textTransform: "none",
                fontWeight: 600,
              }}
              onClick={handleNext}
            >
              Next →
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}
