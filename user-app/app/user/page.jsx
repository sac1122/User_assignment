"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Style from "./user.module.css";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import UserDetailsModal from "./userDetail";
import AddUserForm from "./userForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import useUserData from "./hooks/useUserData";
import axios from "axios";
import { toast } from "react-toastify";
import NoDataFound from "./noDataFound";

export default function UserList() {
  const { fetchUserList, userList, isLoading } = useUserData();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Button onClick={() => handleDetails(params.row)}>
          {params.value}
        </Button>
      ),
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "interest",
      headerName: "Interest",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params.value.map((interest, index) => (
            <span key={index} className={Style.badge}>
              {interest}
            </span>
          ))}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon sx={{ fontSize: "18px" }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchUserList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = (row) => {
    setEditMode(true);
    setSelectedUser(row);
    setDrawerOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedUser(row);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_HOST}/delete-user?_id=${selectedUser?._id}`
      );
      fetchUserList();
      setConfirmOpen(false);
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error("Error on deleting user.");
    } finally {
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
  };

  const handleAdd = () => {
    setEditMode(false);
    setSelectedUser(null);
    setDrawerOpen(true);
  };

  const handleDetails = (row) => {
    setSelectedUser(row);
    setDetailsOpen(true);
  };

  return (
    <div style={{ height: "100vh", width: "100%", background: "#fff" }}>
      <div className={Style.main_div + " p-5"}>
        <div className={Style.list_heading}>
          <div className={Style.title_div}>
            <PersonIcon />
            <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              User List
            </h1>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            style={{ marginLeft: "auto" }}
          >
            <AddIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
            Add
          </Button>
        </div>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
           <div className={Style.table_card} style={{ position: "relative" }}>
            {userList?.length > 0 ?
            <DataGrid
              rows={userList?.map((user, index) => ({
                ...user,
                id: index + 1,
              }))}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              getRowId={(row) => row._id}
            />
            :
            <NoDataFound />}
          </div>
          
        )}
      </div>
      <AddUserForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={editMode ? "edit" : "add"}
        userData={selectedUser}
        handleList={() => {
          setDrawerOpen(false);
          fetchUserList();
        }}
      />
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <UserDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        id={selectedUser?._id}
      />
    </div>
  );
}
