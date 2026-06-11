import { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputAdornment,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";
import { getSubjects, getTopicsBySubject, getSubTopics } from "../../api/subjectApi";
import { useCreateTest, useTest, useUpdateTest } from "../../hooks/useTests";
export default function CreateTest() {
    const navigate = useNavigate();
    const { id: testId } = useParams<{ id?: string }>();
    const location = window.location.pathname;
    const isViewMode = location.includes('/view');
    const isEditMode = location.includes('/edit');
    const { data: existingTest } = useTest(testId || "");
    const [subjects, setSubjects] = useState<any[]>([]);
    const tabs = [
        "chapterwise",
        "pyq",
        "mock",
    ] as const;

    const tabsList = [
        { label: "Chapter Wise", value: "chapterwise" },
        { label: "PYQ", value: "pyq" },
        { label: "Mock Test", value: "mock" },
    ]

    type TabType = (typeof tabs)[number];

    const [activeTab, setActiveTab] = useState(0);
    const [currentTab, setCurrentTab] = useState<
        "chapterwise" | "pyq" | "mock"
    >("chapterwise");
    const [topics, setTopics] = useState<any[]>([]);
    const [subTopics, setSubTopics] = useState<any[]>([]);
    const initialFormData = {
        subject: "",
        testName: "",
        topic: "",
        subTopic: "",
        duration: "",
        difficulty: "Easy",
        wrongAnswer: "-1",
        unattempted: "0",
        correctAnswer: "5",
        noOfQuestions: "",
        totalMarks: "",
    };

    const [formData, setFormData] =
        useState(initialFormData);

    const createTestMutation =
        useCreateTest();

    const updateTestMutation =
        useUpdateTest();

    const loadSubjects = async () => {
        try {
            const data = await getSubjects();
            setSubjects(data);
        } catch (error) {
            console.error("Subjects Error:", error);
        }
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    useEffect(() => {
        if (existingTest && testId && subjects.length > 0) {
            // Pre-populate form with existing test data
            const testType = existingTest.type as TabType;
            const typeIndex = tabs.indexOf(testType);

            // Find subject ID by matching subject name
            const subjectData = subjects.find(s => s.name === existingTest.subject);
            const subjectId = subjectData?.id || "";

            setActiveTab(typeIndex >= 0 ? typeIndex : 0);
            setCurrentTab(testType || "chapterwise");

            // Load all data asynchronously
            const loadData = async () => {
                try {
                    let topicId = "";
                    let subTopicId = "";

                    // Get topics if subject ID exists
                    if (subjectId) {
                        const topicsData = await getTopicsBySubject(subjectId);
                        setTopics(topicsData || []);

                        // Find topic ID by matching topic name
                        if (existingTest.topics?.[0] && topicsData) {
                            const topicData = topicsData.find((t: { name: string }) => t.name === existingTest.topics[0]);
                            topicId = topicData?.id || "";

                            // Get sub-topics if topic ID exists
                            if (topicId) {
                                const subTopicsData = await getSubTopics(topicId);
                                setSubTopics(subTopicsData || []);

                                // Find sub-topic ID by matching sub-topic name
                                if (existingTest.sub_topics?.[0] && subTopicsData) {
                                    const subTopicData = subTopicsData.find((st: { name: string }) => st.name === existingTest.sub_topics[0]);
                                    subTopicId = subTopicData?.id || "";
                                }
                            }
                        }
                    }

                    // Set all form data at once after all lookups are complete
                    setFormData({
                        subject: subjectId,
                        testName: existingTest.name || "",
                        topic: topicId,
                        subTopic: subTopicId,
                        duration: String(existingTest.total_time || ""),
                        difficulty: existingTest.difficulty?.charAt(0).toUpperCase() + existingTest.difficulty?.slice(1) || "Medium",
                        wrongAnswer: String(existingTest.wrong_marks || "-1"),
                        unattempted: String(existingTest.unattempt_marks || "0"),
                        correctAnswer: String(existingTest.correct_marks || "5"),
                        noOfQuestions: String(existingTest.total_questions || ""),
                        totalMarks: String(existingTest.total_marks || ""),
                    });
                } catch (error) {
                    console.error("Error loading test data:", error);
                }
            };

            loadData();
        }
    }, [existingTest, testId, subjects]);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "subject") {
            try {
                const topicsData = await getTopicsBySubject(value);
                setTopics(topicsData || []);
                setSubTopics([]);
                setFormData((prev) => ({
                    ...prev,
                    subject: value,
                    topic: "",
                    subTopic: "",
                }));
            } catch (error) {
                console.error("Topics Error:", error);
            }
        }

        if (name === "topic") {
            try {
                const subTopicData = await getSubTopics(value);
                setSubTopics(subTopicData || []);
                setFormData((prev) => ({
                    ...prev,
                    topic: value,
                    subTopic: "",
                }));
            } catch (error) {
                console.error("Sub Topics Error:", error);
            }
        }
    };

    const handleNext = async () => {
        // Create test for current tab
        try {
            const response = await createTestMutation.mutateAsync({
                name: formData.testName,
                type: tabs[activeTab],
                subject: formData.subject,
                topics: formData.topic ? [formData.topic] : [],
                sub_topics: formData.subTopic ? [formData.subTopic] : [],
                correct_marks: Number(formData.correctAnswer),
                wrong_marks: Number(formData.wrongAnswer),
                unattempt_marks: Number(formData.unattempted),
                difficulty: formData.difficulty.toLowerCase(),
                total_time: Number(formData.duration),
                total_marks: Number(formData.totalMarks),
                total_questions: Number(formData.noOfQuestions),
                status: "draft",
            });

            toast.success("Test created successfully");
            // Navigate to questions page for the current test
            localStorage.setItem("currentTestId", response.data.id);
            localStorage.setItem("currentTestSubject", formData.subject);
            navigate(`/tests/${response.data.id}/questions`);
        } catch (error) {
            console.error("Error creating test:", error);
            toast.error("Failed to create test");
        }
    };

    const handleUpdate = async () => {
        // Update test
        try {
            await updateTestMutation.mutateAsync({
                id: testId || "",
                payload: {
                    name: formData.testName,
                    type: tabs[activeTab],
                    subject: formData.subject,
                    topics: formData.topic ? [formData.topic] : [],
                    sub_topics: formData.subTopic ? [formData.subTopic] : [],
                    correct_marks: Number(formData.correctAnswer),
                    wrong_marks: Number(formData.wrongAnswer),
                    unattempt_marks: Number(formData.unattempted),
                    difficulty: formData.difficulty.toLowerCase(),
                    total_time: Number(formData.duration),
                    total_marks: Number(formData.totalMarks),
                    total_questions: Number(formData.noOfQuestions),
                    status: "draft",
                }
            });

            toast.success("Test updated successfully");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating test:", error);
            toast.error("Failed to update test");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard");
    }

    const handleMarkChange = (
        field: "wrongAnswer" | "unattempted" | "correctAnswer",
        type: "increment" | "decrement"
    ) => {
        setFormData((prev) => {
            const current = Number(prev[field]);

            return {
                ...prev,
                [field]:
                    type === "increment"
                        ? String(current + 1)
                        : String(current - 1),
            };
        });
    };

    return (
        <Layout>
            <Box sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                boxSizing: "border-box",
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden"
            }}>
                {/* Tabs */}

                <Box
                    sx={{
                        display: "flex",
                        gap: { xs: 1.5, sm: 2, md: 3 },
                        mb: { xs: 2, sm: 2.5, md: 3 },
                        borderBottom: "1px solid #E5E7EB",
                        pb: { xs: 1, sm: 1.5, md: 2 },
                        overflowX: "auto",
                    }}
                >
                    {tabsList.map((tab, index) => (

                        <Typography
                            key={tab.value}
                            onClick={() => {
                                if (!isViewMode) {
                                    setActiveTab(index);
                                    setCurrentTab(tab.value as any);
                                }
                            }}
                            sx={{
                                fontSize: { xs: "12px", sm: "13px", md: "14px" },
                                cursor: isViewMode ? "default" : "pointer",
                                color:
                                    currentTab === tab.value
                                        ? "#5988EF"
                                        : "#9CA3AF",
                                fontWeight:
                                    currentTab === tab.value
                                        ? 600
                                        : 400,
                                borderBottom:
                                    currentTab === tab.value
                                        ? "2px solid #5988EF"
                                        : "none",
                                pb: { xs: 0.75, md: 1 },
                                whiteSpace: "nowrap",
                            }}
                        >
                            {tab.label}
                        </Typography>
                    ))}
                </Box>

                {/* Form Container */}
                <Box
                    sx={{
                        width: "100%",
                        overflow: "hidden",
                        maxWidth: 900,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: { xs: 2, sm: 2.5, md: 3 },
                        mb: { xs: 3, md: 3 },
                    }}
                >
                    {/* Left Column */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
                        {/* Subject */}
                        <Box>
                            <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, fontWeight: 500, mb: 0.75 }}>
                                Subject
                            </Typography>
                            <Select
                                fullWidth
                                disabled={isViewMode}
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    Choose Subject
                                </MenuItem>

                                {subjects.map((subject) => (
                                    <MenuItem
                                        key={subject.id}
                                        value={subject.id}
                                    >
                                        {subject.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        {/* Topic */}
                        <Select
                            fullWidth
                            disabled={isViewMode}
                            name="topic"
                            value={formData.topic}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="">
                                Choose Topic
                            </MenuItem>

                            {topics.map((topic) => (
                                <MenuItem
                                    key={topic.id}
                                    value={topic.id}
                                >
                                    {topic.name}
                                </MenuItem>
                            ))}
                        </Select>

                        {/* Duration */}
                        <Box>
                            <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, fontWeight: 500, mb: 0.75 }}>
                                Duration (Minutes)
                            </Typography>
                            <TextField
                                fullWidth
                                disabled={isViewMode}
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="Enter the time"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        backgroundColor: "#F9FAFB",
                                    },
                                }}
                            />
                        </Box>

                        {/* Marking Scheme */}
                        <Box>
                            <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, fontWeight: 500, mb: { xs: 1.5, md: 2 } }}>
                                Marking Scheme:
                            </Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: { xs: 1.5, md: 2 } }}>
                                <Box>
                                    <Typography sx={{ fontSize: { xs: "11px", md: "12px" }, color: "#6B7280", mb: 0.75 }}>
                                        Wrong Answer
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        disabled={isViewMode}
                                        name="wrongAnswer"
                                        value={formData.wrongAnswer}
                                        onChange={handleInputChange}
                                        size="small"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                                            <Typography
                                                                sx={{ fontSize: "10px", cursor: isViewMode ? "default" : "pointer", opacity: isViewMode ? 0.5 : 1 }}
                                                                onClick={() => !isViewMode && handleMarkChange("wrongAnswer", "increment")}
                                                            >
                                                                ▲
                                                            </Typography>
                                                            <Typography
                                                                sx={{ fontSize: "10px", cursor: isViewMode ? "default" : "pointer", opacity: isViewMode ? 0.5 : 1 }}
                                                                onClick={() => !isViewMode && handleMarkChange("wrongAnswer", "decrement")}
                                                            >
                                                                ▼
                                                            </Typography>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "8px",
                                                backgroundColor: "#F9FAFB",
                                            },
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: { xs: "11px", md: "12px" }, color: "#6B7280", mb: 0.75 }}>
                                        Unattempted
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        disabled={isViewMode}
                                        name="unattempted"
                                        value={formData.unattempted}
                                        onChange={handleInputChange}
                                        size="small"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                                            <Typography sx={{ fontSize: "10px", cursor: isViewMode ? "default" : "pointer", opacity: isViewMode ? 0.5 : 1 }} onClick={() => !isViewMode && handleMarkChange("unattempted", "increment")}>
                                                                ▲
                                                            </Typography>
                                                            <Typography sx={{ fontSize: "10px", cursor: isViewMode ? "default" : "pointer", opacity: isViewMode ? 0.5 : 1 }} onClick={() => !isViewMode && handleMarkChange("unattempted", "decrement")}>
                                                                ▼
                                                            </Typography>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}

                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "8px",
                                                backgroundColor: "#F9FAFB",
                                            },
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: { xs: "11px", md: "12px" }, color: "#6B7280", mb: 0.75 }}>
                                        Correct Answer
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        disabled={isViewMode}
                                        name="correctAnswer"
                                        value={formData.correctAnswer}
                                        onChange={handleInputChange}
                                        size="small"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                                            <Typography sx={{ fontSize: "10px", cursor: isViewMode ? "default" : "pointer", opacity: isViewMode ? 0.5 : 1 }} onClick={() => !isViewMode && handleMarkChange("correctAnswer", "increment")}>
                                                                ▲
                                                            </Typography>
                                                            <Typography sx={{ fontSize: "10px", cursor: isViewMode ? "default" : "pointer", opacity: isViewMode ? 0.5 : 1 }} onClick={() => !isViewMode && handleMarkChange("correctAnswer", "decrement")}>
                                                                ▼
                                                            </Typography>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}

                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "8px",
                                                backgroundColor: "#F9FAFB",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right Column */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
                        {/* Test Name */}
                        <Box>
                            <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, fontWeight: 500, mb: 0.75 }}>
                                Name of Test
                            </Typography>
                            <TextField
                                fullWidth
                                disabled={isViewMode}
                                name="testName"
                                value={formData.testName}
                                onChange={handleInputChange}
                                placeholder="Enter name of Test"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        backgroundColor: "#F9FAFB",
                                    },
                                }}
                            />
                        </Box>

                        {/* Sub Topic */}
                        <Select
                            fullWidth
                            disabled={isViewMode}
                            name="subTopic"
                            value={formData.subTopic}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="">
                                Choose Sub Topic
                            </MenuItem>

                            {subTopics.map((subTopic) => (
                                <MenuItem
                                    key={subTopic.id}
                                    value={subTopic.id}
                                >
                                    {subTopic.name}
                                </MenuItem>
                            ))}
                        </Select>

                        {/* Test Difficulty Level */}
                        <Box>
                            <Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 2 }}>
                                Test Difficulty Level
                            </Typography>
                            <RadioGroup
                                row
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                            >
                                <FormControlLabel
                                    disabled={isViewMode}
                                    value="Easy"
                                    control={<Radio sx={{ color: "#5988EF" }} />}
                                    label={<Typography sx={{ fontSize: "14px" }}>Easy</Typography>}
                                />
                                <FormControlLabel
                                    disabled={isViewMode}
                                    value="Medium"
                                    control={<Radio sx={{ color: "#5988EF" }} />}
                                    label={<Typography sx={{ fontSize: "14px" }}>Medium</Typography>}
                                />
                                <FormControlLabel
                                    disabled={isViewMode}
                                    value="Hard"
                                    control={<Radio sx={{ color: "#5988EF" }} />}
                                    label={<Typography sx={{ fontSize: "14px" }}>Difficult</Typography>}
                                />
                            </RadioGroup>
                        </Box>

                        {/* Total Marks Fields */}
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 1.5, md: 2 } }}>
                            <Box>
                                <Typography sx={{ fontSize: { xs: "11px", md: "12px" }, color: "#6B7280", mb: 0.75 }}>
                                    No of Questions
                                </Typography>
                                <TextField
                                    fullWidth
                                    disabled={isViewMode}
                                    name="noOfQuestions"
                                    value={formData.noOfQuestions}
                                    onChange={handleInputChange}
                                    placeholder="Ex:250 Marks"
                                    size="small"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                            backgroundColor: "#F9FAFB",
                                        },
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: { xs: "11px", md: "12px" }, color: "#6B7280", mb: 0.75 }}>
                                    Total Marks
                                </Typography>
                                <TextField
                                    fullWidth
                                    disabled={isViewMode}
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    onChange={handleInputChange}
                                    placeholder="Ex:250 Marks"
                                    size="small"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                            backgroundColor: "#F9FAFB",
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: { xs: 1, md: 2 }, justifyContent: { xs: "center", sm: "flex-end" }, mt: { xs: 3, md: 4 }, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                    {isViewMode ? (
                        <Button
                            onClick={() => navigate("/dashboard")}
                            sx={{
                                color: "#5988EF",
                                backgroundColor: "transparent",
                                border: "none",
                                textTransform: "none",
                                fontSize: { xs: "14px", md: "16px" },
                                fontWeight: 600,
                                cursor: "pointer",
                                px: { xs: 2, md: 3 },
                                py: { xs: 1, md: 1.2 },
                                "&:hover": { backgroundColor: "#F3F4F6" },
                            }}
                        >
                            Back
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCancel}
                            sx={{
                                color: "#5988EF",
                                backgroundColor: "transparent",
                                border: "none",
                                textTransform: "none",
                                fontSize: { xs: "14px", md: "16px" },
                                fontWeight: 600,
                                cursor: "pointer",
                                px: { xs: 2, md: 3 },
                                py: { xs: 1, md: 1.2 },
                                "&:hover": { backgroundColor: "#F3F4F6" },
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                    {!isViewMode && (
                        <Button
                            onClick={isEditMode ? handleUpdate : handleNext}
                            variant="contained"
                            sx={{
                                backgroundColor: "#5988EF",
                                color: "white",
                                textTransform: "none",
                                fontSize: { xs: "14px", md: "16px" },
                                fontWeight: 600,
                                px: { xs: 3, md: 4 },
                                py: { xs: 1, md: 1.2 },
                                borderRadius: "8px",
                                minWidth: { xs: "120px", md: "auto" },
                                "&:hover": { backgroundColor: "#4973D9" },
                            }}
                        >
                            {isEditMode ? "Update" : "Next"}
                        </Button>
                    )}
                </Box>
            </Box>
        </Layout>
    );
}
