import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTest } from "../../hooks/useTests";
import { useFetchQuestions } from "../../hooks/useFetchQuestions";
import Layout from "../../components/Layout/Layout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import QuestionCard from "../Questions/QuestionCard";

export default function TestConfirmation() {
  const navigate = useNavigate();
  const testId = localStorage.getItem("currentTestId") || "";
  const questionIds = JSON.parse(
    localStorage.getItem("questionIds") || "[]"
  );

  const { data: test, isLoading: testLoading } = useTest(testId);
  const { data: questions = [], isLoading: questionLoading } =
    useFetchQuestions(questionIds);

  if (testLoading || questionLoading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const handlePublishNow = () => {
    navigate("/tests/publish");
  };

  const handleSchedulePublish = () => {
    navigate("/tests/schedule-publish");
  };

  const handleEditTest = () => {
    navigate(`/tests/${testId}/edit`);
  };

  return (
    <Layout>
      <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
        {/* Header */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          Test creation
        </Typography>

        {/* Success Banner */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            p: 2,
            bgcolor: "#f0f9ff",
            borderRadius: 1,
            border: "1px solid #e0f2fe",
          }}
        >
          <CheckCircleIcon sx={{ color: "#10b981", fontSize: 24 }} />
          <Stack>
            <Typography sx={{ fontWeight: 600 }}>Test created</Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#10b981" }}>
              All {questions.length} Questions done
            </Typography>
          </Stack>
        </Box>

        {/* Test Summary Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Box sx={{ flex: 1 }}>
                {/* Test Type Badge */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={test?.type ? test.type.replace(/^./, (str: string) => str.toUpperCase()) : "Test"}
                    size="small"
                    sx={{
                      bgcolor: "#1e1b4b",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Test Title */}
                <Typography component="div" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <span style={{ color: "#8b5cf6" }}>◆</span>
                  <span style={{ fontWeight: 600 }}>{test?.name || "Test"}</span>
                  <Chip
                    label={test?.difficulty ? test.difficulty.replace(/^./, (str: string) => str.toUpperCase()) : "Medium"}
                    size="small"
                    sx={{ bgcolor: "#a7f3d0", color: "#065f46", ml: 1 }}
                  />
                </Typography>

                {/* Test Details Grid */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, mt: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      Subject
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {test?.subject || "English"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      Topic
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                      {test?.topics && test.topics.length > 0 ? (
                        test.topics.map((topic: string, idx: number) => (
                          <Chip key={idx} label={topic} size="small" variant="outlined" />
                        ))
                      ) : (
                        <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>No topics</Typography>
                      )}
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      Sub Topic
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                      {test?.sub_topics && test.sub_topics.length > 0 ? (
                        test.sub_topics.map((subTopic: string, idx: number) => (
                          <Chip key={idx} label={subTopic} size="small" variant="outlined" />
                        ))
                      ) : (
                        <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>No sub-topics</Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Test Metrics */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Time
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>{test?.total_time || 0} Min</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Questions
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>{test?.total_questions || 0} Qs</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Marks
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>{test?.total_marks || 0} Marks</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Edit Button */}
              <Button
                variant="text"
                startIcon={<EditIcon />}
                sx={{ color: "#6366f1", mt: 2 }}
                onClick={handleEditTest}
              >
                Edit
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Questions Section */}
        {questions.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Questions ({questions.length})
            </Typography>
            <Stack spacing={2}>
              {questions.map((question: any, index: number) => (
                <QuestionCard
                  key={index}
                  question={question}
                  index={index}
                  onEdit={() => {
                    // Edit functionality can be added if needed
                  }}
                  onDelete={() => {
                    // Delete functionality can be added if needed
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#6366f1",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
            }}
            onClick={handlePublishNow}
          >
            Publish Now
          </Button>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 4,
            }}
            onClick={handleSchedulePublish}
          >
            Schedule Publish
          </Button>
        </Stack>
      </Box>
    </Layout>
  );
}
