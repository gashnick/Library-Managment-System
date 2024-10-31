import { createSlice } from "@reduxjs/toolkit";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchBookStart: (state) => {
      state.loading = true;
    },
    fetchBookSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBookFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBook: (state, action) => {
      state.push(action.payload);
    },
    updateBook: (state, action) => {
      const index = state.books.findIndex(
        (book) => book.id === action.payload.id
      );
      if (index !== -1) state.books[index] = action.payload;
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload);
    },
  },
});

export const {
  fetchBookStart,
  fetchBookSuccess,
  fetchBookFailure,
  addBook,
  updateBook,
  deleteBook,
} = bookSlice.actions;

export default bookSlice.reducer;
