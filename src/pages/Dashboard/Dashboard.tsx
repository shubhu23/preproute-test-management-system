import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "../../components/Layout/Layout";
import {
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/Filters/SearchBar";
import TestFilters from "../../components/Filters/TestFilters";
import TestTable from "../../components/TestTable/TestTable";
import DeleteTestDialog from "../../components/DeleteTestDialog/DeleteTestDialog";
import useDebounce from "../../hooks/useDebounce";
import { useDeleteTest } from "../../hooks/useDeleteTest";
import { useTests } from "../../hooks/useTests";
  import { useSubjects } from "../../hooks/useSubjects";


function Dashboard() {
    const [search,
  setSearch] = useState("");

const [status,
  setStatus] = useState("");

const [subject,
  setSubject] = useState("");

const [sort,
  setSort] = useState("");

  const [selectedTestId,
 setSelectedTestId] =
 useState("");

const [deleteOpen,
 setDeleteOpen] =
 useState(false);

const navigate = useNavigate();

  const {
  data: tests = [],
  isLoading,
  error,
} = useTests();

  const debouncedSearch =
  useDebounce(search);


const {
  data: subjectsData = [],
} = useSubjects();

const subjects = subjectsData.map(
  (subject: any) => subject.name
);

  const filteredTests =
  useMemo(() => {
    let data = [...tests];

    if (debouncedSearch) {
      data = data.filter(
        (test) =>
          test.name
            .toLowerCase()
            .includes(
              debouncedSearch.toLowerCase()
            )
      );
    }

    if (status) {
      data = data.filter(
        (test) =>
          test.status === status
      );
    }

    if (subject) {
      data = data.filter(
        (test) =>
          test.subject === subject
      );
    }

    if (sort === "newest") {
      data.sort(
        (a, b) =>
          new Date(
            b.created_at
          ).getTime() -
          new Date(
            a.created_at
          ).getTime()
      );
    }

    if (sort === "oldest") {
      data.sort(
        (a, b) =>
          new Date(
            a.created_at
          ).getTime() -
          new Date(
            b.created_at
          ).getTime()
      );
    }

    return data;
  }, [
    tests,
    debouncedSearch,
    status,
    subject,
    sort,
  ]);

  const deleteMutation = useDeleteTest();

  const resetFilters = () => {
  setSearch("");
  setStatus("");
  setSubject("");
  setSort("");
};

const handleDeleteClick =
 (id: string) => {
  setSelectedTestId(id);
  setDeleteOpen(true);
};

const handleDeleteConfirm =
 () => {
  deleteMutation.mutate(
    selectedTestId,
    {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    }
  );
};

const handleCreateTest = () => {
  navigate("/tests/create");
};

const handleEdit = (id: string) => {
  navigate(`/tests/${id}/edit`);
};

const handleView = (id: string) => {
  navigate(`/tests/${id}/view`);
};
  if (isLoading) {
  return (
    <Layout>
      <Typography>
        Loading tests...
      </Typography>
    </Layout>
  );
}
if (error) {
  return (
    <Layout>
      <Typography color="error">
        Failed to load tests
      </Typography>
    </Layout>
  );
}
  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </Box>

        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <TestFilters
            status={status}
            subject={subject}
            sort={sort}
            subjects={subjects}
            onStatusChange={setStatus}
            onSubjectChange={setSubject}
            onSortChange={setSort}
            onReset={resetFilters}
          />
        </Box>
        
        <DeleteTestDialog
          open={deleteOpen}
          loading={deleteMutation.isPending}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
        />

        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, fontSize: { xs: "24px", md: "32px" } }}
          >
            Test Management
          </Typography>
          <Typography 
            color="text.secondary"
            sx={{ fontSize: { xs: "13px", md: "14px" }, mt: 0.5 }}
          >
            Create, manage and publish tests
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreateTest}
          sx={{
            borderRadius: "12px",
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "13px", md: "15px" },
            mb: { xs: 3, md: 4 },
          }}
        >
          Create New Test
        </Button>

        <Box sx={{ mt: { xs: 2, md: 4 }, overflowX: "auto" }}>
          <TestTable
            rows={filteredTests}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onView={handleView}
          />
        </Box>
      </Box>
    </Layout>
  );
}

export default Dashboard;


