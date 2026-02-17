import React, { useEffect, useState } from "react";
import API from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import CategoryForm from "./CategoryForm";
import "./CategoriesList.css";


export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const load = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };
  useEffect(() => { load(); }, []);

  const onCreate = () => { setEditing(null); setOpenForm(true); };
  const onEdit = (c) => { setEditing(c); setOpenForm(true); };
  const onDelete = async (id) => { await API.delete(`/categories/${id}`); load(); };

  return (
  <DashboardLayout>
    <div className="page-bg">

      {/* HEADER */}
      <div className="page-header">
        <h2>Categories</h2>

        <Button
          variant="contained"
          onClick={onCreate}
          className="primary-btn"
        >
          New Category
        </Button>
      </div>

      {/* TABLE CARD */}
      <div className="card-surface">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.description}</TableCell>

                <TableCell align="right">
                  <Button size="small" onClick={() => onEdit(c)}>
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(c.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          load();
        }}
        category={editing}
      />

    </div>
  </DashboardLayout>
);
}
