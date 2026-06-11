import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface TestState {
  currentTestId: string;

  mode: "create" | "edit";

  draft: any;
}

const initialState: TestState = {
  currentTestId: "",

  mode: "create",

  draft: null,
};

const testSlice = createSlice({
  name: "test",

  initialState,

  reducers: {
    setCurrentTest(
      state,
      action:
        PayloadAction<string>
    ) {
      state.currentTestId =
        action.payload;
    },

    setMode(
      state,
      action:
        PayloadAction<
          "create" | "edit"
        >
    ) {
      state.mode =
        action.payload;
    },

    setDraft(
      state,
      action
    ) {
      state.draft =
        action.payload;
    },

    clearDraft(state) {
      state.currentTestId =
        "";

      state.mode =
        "create";

      state.draft =
        null;
    },
  },
});

export const {
  setCurrentTest,
  setMode,
  setDraft,
  clearDraft,
} = testSlice.actions;

export default testSlice.reducer;