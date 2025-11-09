import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import API from "../api/api";

export default function CategoryForm({ open, onClose, category }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { reset(category || {}); }, [category, reset]);

  const onSubmit = async (data) => {
    if (category?.id) {
      await API.put(`/categories/${category.id}`, data);
    } else {
      await API.post("/categories", data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{category ? "Edit" : "Create"} Category</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Name" fullWidth {...register("name", { required: true })} margin="normal" />
          <TextField label="Description" fullWidth multiline rows={4} {...register("description")} margin="normal" />
          <Button type="submit" variant="contained">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
