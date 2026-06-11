import {
    Chip,
    IconButton,
} from "@mui/material";

import {
    DataGrid,
    type GridColDef,
} from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";

import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

import type { Test } from "../../types/test";

interface Props {
    rows: Test[];

    onEdit: (
        id: string
    ) => void;

    onDelete: (
        id: string
    ) => void;

    onView: (
        id: string
    ) => void;
}

export default function TestTable({
    rows,
    onEdit,
    onDelete,
    onView,
}: Props) {
    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Test Name",
            flex: 1.5,
        },

        {
            field: "subject",
            headerName: "Subject",
            flex: 1,
        },

        {
            field: "status",
            headerName: "Status",
            flex: 1,

            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "live"
                            ? "success"
                            : "warning"
                    }
                />
            ),
        },

        {
            field: "created_at",
            headerName: "Created Date",
            flex: 1,
        },

        {
            field: "actions",
            headerName: "Actions",
            flex: 1,

            sortable: false,

            renderCell: (params) => (
                <>
                    <IconButton
                        onClick={() =>
                            onView(params.row.id)
                        }
                    >
                        <VisibilityIcon />
                    </IconButton>

                    <IconButton
                        onClick={() =>
                            onEdit(params.row.id)
                        }
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={() =>
                            onDelete(params.row.id)
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
        />
    );
}