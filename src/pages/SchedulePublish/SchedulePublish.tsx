import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTest } from "../../hooks/useTests";
import { useFetchQuestions } from "../../hooks/useFetchQuestions";
import Layout from "../../components/Layout/Layout";
import EditIcon from "@mui/icons-material/Edit";
import { usePublishTest } from "../../hooks/usePublishTest";
import { toast } from "react-toastify";

type LiveUntilOption = "always" | "1week" | "2weeks" | "3weeks" | "1month" | "custom";

export default function SchedulePublish() {
  const navigate = useNavigate();
  const testId = localStorage.getItem("currentTestId") || "";
  const questionIds = JSON.parse(
    localStorage.getItem("questionIds") || "[]"
  );

  const { data: test, isLoading: testLoading } = useTest(testId);
  const { data: questions = [], isLoading: questionLoading } =
    useFetchQuestions(questionIds);
  const publishMutation = usePublishTest();

  const [publishType, setPublishType] = useState<"now" | "schedule">("schedule");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [liveUntilOption, setLiveUntilOption] = useState<LiveUntilOption>("custom");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleConfirm = async () => {
    try {
      // If scheduling, validate date/time
      if (publishType === "schedule" && !publishDate && !publishTime) {
        toast.error("Please select date and time for scheduled publish");
        return;
      }

      // If custom duration, validate end date
      if (liveUntilOption === "custom" && !endDate) {
        toast.error("Please select end date for custom duration");
        return;
      }

      // Publish the test
      await publishMutation.mutateAsync(testId);
      
      toast.success("Test published successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to publish test");
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate(`/tests/${testId}/confirmation`);
  };

  if (testLoading || questionLoading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

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
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              bgcolor: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "0.9rem",
            }}
          >
            ✓
          </Box>
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
                {/* Chapter Badge */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label="Chapter Wise"
                    size="small"
                    sx={{
                      bgcolor: "#1e1b4b",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Chapter Title */}
                <Typography sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <span style={{ color: "#8b5cf6" }}>◆</span>
                  <span style={{ fontWeight: 600 }}>Chapter 1</span>
                  <Chip
                    label="Easy"
                    size="small"
                    sx={{ bgcolor: "#a7f3d0", color: "#065f46", ml: 1 }}
                  />
                </Typography>

                {/* Test Details */}
                <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mb: 0.5 }}>
                  Subject: {test?.subject || "English"}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mb: 0.5 }}>
                  Topic: Grammar | Writing
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mb: 2 }}>
                  Sub Topic: Application
                </Typography>

                {/* Test Metrics */}
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Time
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>60 Min</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Questions
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>50 Qs</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Marks
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>250 Marks</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Edit Button */}
              <Button
                variant="text"
                startIcon={<EditIcon />}
                sx={{ color: "#6366f1", mt: 2 }}
              >
                Edit
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Publish Options */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <RadioGroup
              value={publishType}
              onChange={(e) => setPublishType(e.target.value as "now" | "schedule")}
            >
              <FormControlLabel
                value="now"
                control={<Radio />}
                label="Publish Now"
              />
              <FormControlLabel
                value="schedule"
                control={<Radio />}
                label="Schedule Publish"
              />
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Schedule Publish Form */}
        {publishType === "schedule" && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Select Date and Time
              </Typography>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
                <TextField
                  type="date"
                  label="Select Date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  fullWidth
                />
                <TextField
                  type="time"
                  label="Select Time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Live Until Options */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Live Until
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#6b7280", mb: 2 }}>
              Choose how long this test should remain available on the platform.
            </Typography>

            <RadioGroup
              value={liveUntilOption}
              onChange={(e) => setLiveUntilOption(e.target.value as LiveUntilOption)}
            >
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <FormControlLabel
                  value="always"
                  control={<Radio />}
                  label="Always Available"
                />
                <FormControlLabel
                  value="3weeks"
                  control={<Radio />}
                  label="3 Weeks"
                />
                <FormControlLabel
                  value="1week"
                  control={<Radio />}
                  label="1 Week"
                />
                <FormControlLabel
                  value="1month"
                  control={<Radio />}
                  label="1 Month"
                />
                <FormControlLabel
                  value="2weeks"
                  control={<Radio />}
                  label="2 Weeks"
                />
                <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label="Custom Duration"
                />
              </Box>
            </RadioGroup>

            {/* Custom Duration Fields */}
            {liveUntilOption === "custom" && (
              <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #e5e7eb", display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <TextField
                  type="date"
                  label="Select End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                />
                <TextField
                  type="time"
                  label="Select End Time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  fullWidth
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              color: "#ef4444",
              borderColor: "#fca5a5",
            }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#6366f1",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
            }}
            onClick={handleConfirm}
            disabled={publishMutation.isPending}
          >
            {publishMutation.isPending ? "Confirming..." : "Confirm"}
          </Button>
        </Stack>
      </Box>
    </Layout>
  );
}
