/**
 * Defines the different ways that the data can be viewed and interacted with in the UI
 */
export enum VIEW_MODES {
  // "Stuntsheet" mode is for viewing and updating a specific stuntsheet.
  // Used for drawing and editing formations.
  STUNTSHEET = "Stuntsheet",
  // "Flow" mode is for viewing and updating the transition between two stuntsheets.
  // Used for creating and editing continuities.
  FLOW = "Flow",
}
